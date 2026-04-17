const API_URL = window.location.hostname.includes("localhost")
    ? "http://localhost:8080"
    : "https://sorteio-crente-production.up.railway.app";

function autoResize(el) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
}

function capitalizarNome(nome) {
    return nome
        .toLowerCase()
        .split(" ")
        .filter(p => p)
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");
}

function tratarNomes(texto) {
    return texto
        .split(",")
        .map(nome => capitalizarNome(nome.trim()))
        .filter(nome => nome)
        .filter((nome, i, arr) => arr.indexOf(nome) === i);
}

function atualizarContador() {
    const nomes = tratarNomes(document.getElementById("nomes").value);
    const contador = document.getElementById("contador");

    if (nomes.length === 0) {
        contador.innerText = "";
        return;
    }

    contador.innerText = `Nomes: ${nomes.length}`;
}

function animarSorteio(nomes, elemento) {
    let i = 0;

    return new Promise(resolve => {
        const intervalo = setInterval(() => {
            elemento.innerText = nomes[i % nomes.length];
            elemento.classList.add("animando");
            i++;
        }, 100);

        setTimeout(() => {
            clearInterval(intervalo);
            elemento.classList.remove("animando");
            resolve();
        }, 1500);
    });
}

async function sortear() {
    const textarea = document.getElementById("nomes");
    const resultado = document.getElementById("resultado");

    const botao = document.getElementById("btnSortear");
    const btnListas = document.getElementById("btnListas");
    const btnLimpar = document.getElementById("btnLimpar");

    const nomes = tratarNomes(textarea.value);

    if (!nomes.length) {
        resultado.innerText = "Digite pelo menos um nome válido!";
        resultado.classList.add("resultado-final");
        return;
    }

    setLoading(true);

    await animarSorteio(nomes, resultado);

    try {
        const response = await fetch(`${API_URL}/sortear?nomes=${nomes.join(",")}`);
        const data = await response.json();

        resultado.classList.remove("resultado-final");
        void resultado.offsetWidth;

        resultado.innerText = "🎉 " + data.nome;
        resultado.classList.add("resultado-final");

        resultado.scrollIntoView({ behavior: "smooth" });

    } catch (error) {
        console.error(error);
        resultado.innerText = "Erro ao conectar com o servidor";
        resultado.classList.add("resultado-final");
    }

    setLoading(false);
}

function setLoading(isLoading) {
    const botao = document.getElementById("btnSortear");
    const btnListas = document.getElementById("btnListas");
    const btnLimpar = document.getElementById("btnLimpar");

    [botao, btnListas, btnLimpar].forEach(btn => {
        btn.disabled = isLoading;
        btn.classList.toggle("loading", isLoading);
    });

    botao.innerText = isLoading ? "Sorteando..." : "Sortear";
}

document.getElementById("nomes").addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sortear();
    }
});

function isMobile() {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
}

if (isMobile()) {
    const textarea = document.getElementById("nomes");

    textarea.addEventListener("focus", () => {
        document.body.style.alignItems = "flex-start";
        document.body.style.paddingTop = "40px";
    });

    textarea.addEventListener("blur", () => {
        setTimeout(() => {
            document.body.style.alignItems = "center";
            document.body.style.paddingTop = "20px";
        }, 150);
    });
}

function limparNomes() {
    document.getElementById("nomes").value = "";
    document.getElementById("resultado").innerText = "";
    atualizarContador();
}

async function abrirModal() {
    const btn = document.getElementById("btnListas");
    const modal = document.getElementById("modal");

    btn.classList.add("loading");
    btn.disabled = true;

    modal.style.display = "flex";

    try {
        const response = await fetch(`${API_URL}/participantes`);
        const lista = await response.json();

        renderParticipantes(lista);

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar participantes");
    }

    btn.classList.remove("loading");
    btn.disabled = false;
}

function fecharModal() {
    document.getElementById("modal").style.display = "none";

    const btn = document.getElementById("btnListas");
    btn.classList.remove("loading");
    btn.disabled = false;
}

function renderParticipantes(lista) {
    const container = document.getElementById("participantes");
    container.innerHTML = "";

    if (!lista.length) {
        container.innerHTML = "<p>Nenhum participante ainda</p>";
        return;
    }

    lista.forEach(nome => {
        container.appendChild(criarElementoParticipante(nome));
    });
}

function criarElementoParticipante(nome) {
    const div = document.createElement("div");
    div.className = "participante";

    div.innerHTML = `
        <input type="checkbox" value="${nome}">
        
        <input 
            type="text" 
            value="${nome}" 
            class="nome-editavel" 
            disabled
        >

        <button class="btn-editar" onclick="habilitarEdicao(event)">✏️</button>
        <button class="btn-remover" onclick="removerParticipante(event)">❌</button>
    `;

    return div;
}

function adicionarParticipante() {
    const input = document.getElementById("novoParticipante");
    const nome = input.value.trim();

    if (!nome) return;

    const container = document.getElementById("participantes");
    container.appendChild(criarElementoParticipante(nome));

    input.value = "";
}

function removerParticipante(event) {
    event.target.closest(".participante")?.remove();
}

function adicionarAoSorteio() {
    const selecionados = Array.from(
        document.querySelectorAll("#participantes .participante")
    )
        .filter(p => p.querySelector("input[type='checkbox']").checked)
        .map(p => p.querySelector(".nome-editavel").value.trim());

    const textarea = document.getElementById("nomes");

    const atuais = textarea.value
        ? textarea.value.split(",").map(n => n.trim())
        : [];

    const combinados = [...new Set([...atuais, ...selecionados])];

    textarea.value = combinados.join(", ");
    atualizarContador();

    fecharModal();
}

async function salvarParticipantes() {
    const lista = Array.from(
        document.querySelectorAll(".participante")
    ).map(p => p.querySelector(".nome-editavel").value.trim())
        .filter(n => n);

    try {
        await fetch(`${API_URL}/participantes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(lista)
        });

        alert("Lista salva com sucesso!");

    } catch (error) {
        console.error(error);
        alert("Erro ao salvar lista");
    }
}

function habilitarEdicao(event) {
    const item = event.target.closest(".participante");
    const input = item.querySelector(".nome-editavel");

    input.disabled = false;
    input.focus();

    input.selectionStart = input.value.length;

    input.addEventListener("blur", () => {
        input.disabled = true;

        const checkbox = item.querySelector("input[type='checkbox']");
        checkbox.value = input.value.trim();
    }, { once: true });
}

document.addEventListener("blur", function (e) {
    if (e.target.classList.contains("nome-editavel")) {
        e.target.disabled = true;
    }
}, true);

let modoEdicao = false;

function toggleModoEdicao() {
    const modal = document.querySelector(".modal-content");
    const botao = document.getElementById("btnEditarModo");

    modal.classList.toggle("modo-edicao");

    const ativo = modal.classList.contains("modo-edicao");
    botao.innerText = ativo ? "Concluir" : "Editar";
}