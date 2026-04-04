async function sortear() {
    const nomes = document.getElementById("nomes").value;

    if (!nomes) {
        alert("Digite pelo menos um nome!");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/sortear?nomes=${nomes}`);
        const data = await response.json();

        document.getElementById("resultado").innerText =
            "Sorteado: " + data.nome;


    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao conectar com o servidor");

    }

}