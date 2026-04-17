function autoResize(el) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
}

function capitalizarNome(nome) {
    return nome
        .toLowerCase()
        .split(" ")
        .filter(p => p !== "")
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");
}

function tratarNomes(texto) {
    return texto
        .split(",")
        .map(nome => capitalizarNome(nome.trim()))
        .filter(nome => nome !== "")
        .filter((nome, index, array) => array.indexOf(nome) === index);
}

function atualizarContador() {
    const nomes = tratarNomes(document.getElementById("nomes").value);
    document.getElementById("contador").innerText = `Nomes: ${nomes.length}`;
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

document.getElementById("nomes").addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sortear();
    }
});

async function sortear() {
    const textarea = document.getElementById("nomes");
    const resultado = document.getElementById("resultado");
    const botao = document.getElementById("btnSortear");
    const btnListas = document.getElementById("btnListas");
    const btnLimpar = document.getElementById("btnLimpar");


    let nomes = tratarNomes(textarea.value);

    if (nomes.length === 0) {
        resultado.innerText = "Digite pelo menos um nome válido!";
        resultado.classList.add("resultado-final");
        return;
    }

    botao.classList.add("loading");
    btnListas.classList.add("loading");
    btnLimpar.classList.add("loading");
    botao.innerText = "Sorteando...";
    botao.disabled = true;
    btnListas.disabled = true;
    btnLimpar.disabled = true;


    await animarSorteio(nomes, resultado);

    try {
        const response = await fetch(`https://sorteio-crente-production.up.railway.app/sortear?nomes=${nomes.join(",")}`)
        const data = await response.json();

        resultado.classList.remove("resultado-final");
        void resultado.offsetWidth;
        resultado.innerText = "🎉 " + data.nome;
        resultado.classList.add("resultado-final");

        resultado.scrollIntoView({ behavior: "smooth" });

    } catch (error) {
        console.error("Erro:", error);
        resultado.innerText = "Erro ao conectar com o servidor";
        resultado.classList.add("resultado-final");
    }

    botao.classList.remove("loading");
    btnListas.classList.remove("loading");
    btnLimpar.classList.remove("loading");
    botao.innerText = "Sortear";
    botao.disabled = false;
    btnListas.disabled = false;
    btnLimpar.disabled = false;
}

const textarea = document.getElementById("nomes");

function isMobile() {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
}

if (isMobile()) {
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
    const textarea = document.getElementById("nomes");
    const resultado = document.getElementById("resultado");

    textarea.value = "";
    resultado.innerText = "";

    atualizarContador();
}

const API_URL = "http://localhost:8080";

async function abrirModal() {
    const btn = document.getElementById("btnListas");
    const modal = document.getElementById("modal");

    btn.classList.add("loading");
    btn.disabled = true;

    modal.style.display = "flex";

    try {
        const response = await fetch(`${API_URL}/participantes`);
        const lista = await response.json();

        const container = document.getElementById("participantes");
        container.innerHTML = "";

        if (lista.length === 0) {
            container.innerHTML = "<p>Nenhum participante ainda</p>";
            return;
        }

        lista.forEach(nome => {
            const div = document.createElement("div");
            div.className = "participante";

            div.innerHTML = `
                <input type="checkbox" value="${nome}">
                <label>${nome}</label>
                <button class="btn-remover" onclick="removerParticipante(event)">❌</button>
            `;

            container.appendChild(div);
        });

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar participantes");
    }

    btn.classList.remove("loading");
    btn.disabled = false;
}

function fecharModal() {
    const modal = document.getElementById("modal");
    const btn = document.getElementById("btnListas");

    modal.style.display = "none";

    btn.classList.remove("loading");
    btn.disabled = false;
}

function adicionarAoSorteio() {
    const checkboxes = document.querySelectorAll("#participantes input:checked");

    const novos = Array.from(checkboxes).map(cb => cb.value);

    const textarea = document.getElementById("nomes");

    const atuais = textarea.value
        ? textarea.value.split(",").map(n => n.trim())
        : [];

    const combinados = [...new Set([...atuais, ...novos])];

    textarea.value = combinados.join(", ");

    atualizarContador();

    fecharModal();
}

function adicionarParticipante() {
    const input = document.getElementById("novoParticipante");
    const nome = input.value.trim();

    if (!nome) return;

    const container = document.getElementById("participantes");

    const div = document.createElement("div");
    div.className = "participante";

    div.innerHTML = `
        <input type="checkbox" value="${nome}" checked>
        <label>${nome}</label>
    `;

    container.appendChild(div);

    input.value = "";
}

async function salvarParticipantes() {
    const checkboxes = document.querySelectorAll("#participantes input");

    const lista = Array.from(checkboxes).map(cb => cb.value);

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

function removerParticipante(event) {
    const item = event.target.closest(".participante");

    if (item) {
        item.remove();
    }
}