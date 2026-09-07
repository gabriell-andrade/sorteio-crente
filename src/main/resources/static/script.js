const API_URL = "/api/v1";
let sorteioEmAndamento = false;
let modoEdicaoAtivo = false;
let participantesOriginais = [];
let ultimoElementoComFoco = null;

async function lerResposta(response) {
    const texto = await response.text();
    let dados = null;

    if (texto) {
        try {
            dados = JSON.parse(texto);
        } catch {
            throw new Error("O servidor retornou uma resposta inválida.");
        }
    } else if (!response.ok) {
        throw new Error("O servidor retornou uma resposta inválida.");
    }

    if (!response.ok) {
        throw new Error(dados?.mensagem || "Não foi possível concluir a operação.");
    }

    return dados;
}

function autoResize(el) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 220) + "px";
    el.style.overflowY = el.scrollHeight > 220 ? "auto" : "hidden";
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
    if (sorteioEmAndamento) return;

    const textarea = document.getElementById("nomes");
    const resultado = document.getElementById("resultado");

    const botao = document.getElementById("btnSortear");
    const btnListas = document.getElementById("btnListas");
    const btnLimpar = document.getElementById("btnLimpar");

    const nomes = tratarNomes(textarea.value);

    if (!nomes.length) {
        mostrarMensagem("Digite pelo menos um nome válido.", true);
        return;
    }

    sorteioEmAndamento = true;
    setLoading(true);
    limparMensagem();

    try {
        await animarSorteio(nomes, resultado);

        const response = await fetch(`${API_URL}/sorteios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nomes, quantidade: 1 })
        });
        const data = await lerResposta(response);

        if (!Array.isArray(data.vencedores) || data.vencedores.length === 0) {
            throw new Error("O servidor não retornou um vencedor válido.");
        }

        resultado.classList.remove("resultado-final");
        void resultado.offsetWidth;

        resultado.innerText = "🎉 " + data.vencedores.join(", ");
        resultado.classList.add("resultado-final");

    } catch (error) {
        console.error(error);
        mostrarMensagem(error.message || "Erro ao conectar com o servidor.", true);
    } finally {
        sorteioEmAndamento = false;
        setLoading(false);
    }
}

function setLoading(isLoading) {
    const botao = document.getElementById("btnSortear");
    const btnListas = document.getElementById("btnListas");
    const btnLimpar = document.getElementById("btnLimpar");

    [botao, btnListas, btnLimpar].forEach(btn => {
        btn.disabled = isLoading;
        btn.classList.toggle("loading", isLoading);
    });

    document.getElementById("nomes").disabled = isLoading;

    botao.innerText = isLoading ? "Sorteando..." : "Sortear";
}

function mostrarMensagem(mensagem, erro = false) {
    const elemento = document.getElementById("mensagem");
    elemento.innerText = mensagem;
    elemento.classList.toggle("erro", erro);
}

function limparMensagem() {
    mostrarMensagem("");
}

document.getElementById("nomes").addEventListener("input", event => {
    autoResize(event.target);
    atualizarContador();
});

document.getElementById("nomes").addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sortear();
    }
});

function limparNomes() {
    document.getElementById("nomes").value = "";
    document.getElementById("resultado").innerText = "";
    limparMensagem();
    autoResize(document.getElementById("nomes"));
    atualizarContador();
}

async function abrirModal() {
    const btn = document.getElementById("btnListas");
    const modal = document.getElementById("modal");

    btn.classList.add("loading");
    btn.disabled = true;

    ultimoElementoComFoco = document.activeElement;
    modal.hidden = false;
    modal.style.display = "flex";
    modal.querySelector(".modal-content").focus();
    mostrarMensagemModal("Carregando participantes...");

    try {
        const response = await fetch(`${API_URL}/participantes`);
        const lista = await lerResposta(response);
        if (!Array.isArray(lista)) {
            throw new Error("A lista recebida é inválida.");
        }
        participantesOriginais = [...lista];
        renderParticipantes(lista);
        mostrarMensagemModal("");

    } catch (error) {
        console.error(error);
        mostrarMensagemModal(error.message || "Erro ao carregar participantes.", true);
    }

    btn.classList.remove("loading");
    btn.disabled = false;
}

function fecharModal() {
    const modal = document.getElementById("modal");
    const conteudo = document.querySelector(".modal-content");
    const btn = document.getElementById("btnEditarModo");

    if (modoEdicaoAtivo && listaAtual().join("\u0000") !== participantesOriginais.join("\u0000")) {
        if (!window.confirm("Existem alterações não salvas. Deseja sair mesmo assim?")) return;
    }

    modoEdicaoAtivo = false;
    modal.hidden = true;
    modal.style.display = "none";

    conteudo.classList.remove("modo-edicao");
    btn.innerText = "Editar";
    document.getElementById("btnCancelarEdicao").hidden = true;
    mostrarMensagemModal("");
    ultimoElementoComFoco?.focus();
}

function mostrarMensagemModal(mensagem, erro = false) {
    const elemento = document.getElementById("modalMensagem");
    elemento.innerText = mensagem;
    elemento.classList.toggle("erro", erro);
}

function listaAtual() {
    return Array.from(document.querySelectorAll(".nome-editavel"))
        .map(input => input.value.trim())
        .filter(Boolean);
}

function renderParticipantes(lista) {
    const container = document.getElementById("participantes");
    container.replaceChildren();

    if (!lista.length) {
        const aviso = document.createElement("p");
        aviso.textContent = "Nenhum participante ainda";
        container.appendChild(aviso);
        return;
    }

    lista.forEach(nome => {
        container.appendChild(criarElementoParticipante(nome));
    });
}

function criarElementoParticipante(nome) {
    const div = document.createElement("div");
    div.className = "participante";

    const input = document.createElement("input");
    input.type = "text";
    input.value = nome;
    input.className = "nome-editavel";
    input.disabled = true;
    const acoes = document.createElement("div");
    acoes.className = "acoes-item";
    const editar = document.createElement("button");
    editar.type = "button";
    editar.className = "btn-editar";
    editar.textContent = "✏️";
    editar.setAttribute("aria-label", `Editar ${nome}`);
    editar.addEventListener("click", (event) => { event.stopPropagation(); habilitarEdicao(event); });
    const remover = document.createElement("button");
    remover.type = "button";
    remover.className = "btn-remover";
    remover.textContent = "❌";
    remover.setAttribute("aria-label", `Remover ${nome}`);
    remover.addEventListener("click", (event) => { event.stopPropagation(); removerParticipante(event); });
    acoes.append(editar, remover);
    div.append(input, acoes);

    div.addEventListener("click", () => {

        const modal = document.querySelector(".modal-content");

        if (modal.classList.contains("modo-edicao")) {
            return;
        }

        div.classList.toggle("selecionado");
    });

    return div;
}

function adicionarParticipante() {
    const input = document.getElementById("novoParticipante");
    const nome = input.value.trim();

    if (!nome) {
        mostrarMensagemModal("Informe um nome válido.", true);
        input.focus();
        return;
    }

    if (listaAtual().some(atual => atual.toLocaleLowerCase() === nome.toLocaleLowerCase())) {
        mostrarMensagemModal("Esse participante já está na lista.", true);
        input.select();
        return;
    }

    const container = document.getElementById("participantes");
    container.appendChild(criarElementoParticipante(nome));

    input.value = "";
    mostrarMensagemModal("");
    input.focus();
}

function removerParticipante(event) {
    event.target.closest(".participante")?.remove();
    mostrarMensagemModal("");
}

function adicionarAoSorteio() {
    const selecionados = Array.from(
        document.querySelectorAll(".participante.selecionado")
    ).map(p => p.querySelector(".nome-editavel").value.trim());

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
    const lista = listaAtual();

    if (!lista.length) {
        mostrarMensagemModal("Mantenha pelo menos um participante na lista.", true);
        return false;
    }

    const botao = document.getElementById("btnEditarModo");
    botao.disabled = true;
    mostrarMensagemModal("Salvando...");

    try {
        const response = await fetch(`${API_URL}/participantes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nomes: lista })
        });

        await lerResposta(response);
        participantesOriginais = [...lista];
        mostrarMensagemModal("Lista salva com sucesso.");
        return true;

    } catch (error) {
        console.error(error);
        mostrarMensagemModal(error.message || "Erro ao salvar lista.", true);
        return false;
    } finally {
        botao.disabled = false;
    }
}

function habilitarEdicao(event) {
    const item = event.target.closest(".participante");
    const input = item.querySelector(".nome-editavel");

    input.disabled = false;
    input.style.pointerEvents = "auto";

    input.focus();
    input.selectionStart = input.value.length;

    input.addEventListener("blur", () => {
        let novoValor = input.value.trim();

        input.value = novoValor;

        input.disabled = true;
        input.style.pointerEvents = "none";
        if (!novoValor) {
            item.remove();
        }
    }, { once: true });
}

document.addEventListener("blur", function (e) {
    if (e.target.classList.contains("nome-editavel")) {
        e.target.disabled = true;
    }
}, true);

function toggleModoEdicao() {
    const modal = document.querySelector(".modal-content");
    const botao = document.getElementById("btnEditarModo");

    const estaEditando = modoEdicaoAtivo;

    if (estaEditando) {
        salvarParticipantes().then(salvo => {
            if (!salvo) return;
            modoEdicaoAtivo = false;
            modal.classList.remove("modo-edicao");
            botao.innerText = "Editar";
            document.getElementById("btnCancelarEdicao").hidden = true;
        });
    } else {
        modoEdicaoAtivo = true;
        modal.classList.add("modo-edicao");
        botao.innerText = "Salvar";
        document.getElementById("btnCancelarEdicao").hidden = false;
        mostrarMensagemModal("");
    }
}

function cancelarEdicao() {
    renderParticipantes(participantesOriginais);
    modoEdicaoAtivo = false;
    document.querySelector(".modal-content").classList.remove("modo-edicao");
    document.getElementById("btnEditarModo").innerText = "Editar";
    document.getElementById("btnCancelarEdicao").hidden = true;
    mostrarMensagemModal("Alterações descartadas.");
}

document.getElementById("btnSortear").addEventListener("click", sortear);
document.getElementById("btnListas").addEventListener("click", abrirModal);
document.getElementById("btnLimpar").addEventListener("click", limparNomes);
document.getElementById("btnEditarModo").addEventListener("click", toggleModoEdicao);
document.getElementById("btnAdicionarParticipante").addEventListener("click", adicionarParticipante);
document.getElementById("btnAdicionarAoSorteio").addEventListener("click", adicionarAoSorteio);
document.getElementById("btnCancelarEdicao").addEventListener("click", cancelarEdicao);
document.getElementById("btnFecharModal").addEventListener("click", fecharModal);
document.getElementById("novoParticipante").addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        adicionarParticipante();
    }
});

document.getElementById("modal").addEventListener("click", event => {
    if (event.target.id === "modal") fecharModal();
});

document.getElementById("modal").addEventListener("keydown", event => {
    if (event.key === "Escape") {
        event.preventDefault();
        fecharModal();
        return;
    }

    if (event.key !== "Tab") return;

    const modal = document.getElementById("modal");
    const focaveis = modal.querySelectorAll("button:not([disabled]), input:not([disabled])");
    if (!focaveis.length) return;

    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    if (event.shiftKey && document.activeElement === primeiro) {
        event.preventDefault();
        ultimo.focus();
    } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primeiro.focus();
    }
});

autoResize(document.getElementById("nomes"));
atualizarContador();
