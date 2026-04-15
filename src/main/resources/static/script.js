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

async function sortear() {
    const textarea = document.getElementById("nomes");
    const resultado = document.getElementById("resultado");
    const botao = document.getElementById("btnSortear");

    let nomes = tratarNomes(textarea.value);

    if (nomes.length === 0) {
        alert("Digite pelo menos um nome válido!");
        return;
    }

    botao.classList.add("loading");
    botao.innerText = "Sorteando...";
    botao.disabled = true;

    await animarSorteio(nomes, resultado);

    try {
        const response = await fetch(`http://localhost:8080/sortear?nomes=${nomes.join(",")}`);
        const data = await response.json();

        resultado.innerText = "🎉 " + data.nome;
        resultado.classList.add("resultado-final");
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao conectar com o servidor");
    }

    botao.classList.remove("loading");
    botao.innerText = "Sortear";
    botao.disabled = false;
}