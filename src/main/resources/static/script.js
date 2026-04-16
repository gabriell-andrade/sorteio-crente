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
        const response = await fetch(`${API_URL}/listas`);
        const data = await response.json();

        const select = document.getElementById("listaModal");
        select.innerHTML = "";

        if (Object.keys(data).length === 0) {
            select.innerHTML = "<option>Nenhuma lista encontrada</option>";
            return;
        }

        Object.keys(data).forEach(nome => {
            const option = document.createElement("option");
            option.value = nome;
            option.textContent = nome;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Erro ao carregar listas:", error);
        alert("Erro ao carregar listas");
    }

    btn.classList.remove("loading");
    btn.disabled = false;
}

function fecharModal() {
    const modal = document.getElementById("modal");
    const btn = document.getElementById("btnListas");

    if (modal) modal.style.display = "none";

    if (btn) {
        btn.classList.remove("loading");
        btn.disabled = false;
    }
}