let times = []
let timeSelecionado = null;
let editando = false;
const URL = "http://127.0.0.1:5000/";

const detalhes = document.getElementById("detalhes");
const cadastroModal = document.getElementById("cadastro-modal");
const form = document.querySelector(".form-time");

document.getElementById("openModal").addEventListener("click", () => {
      detalhes.classList.add("active");
  });

document.getElementById("fecharModal").addEventListener("click", () => {
      detalhes.classList.remove("active");
  });

document.getElementById("openCreate").addEventListener("click", () =>{
    editando = false;
    timeSelecionado = null;
    form.reset();
    document.getElementById("formTitulo").textContent = "Cadastrar Time";
    cadastroModal.classList.add("active");
})

document.getElementById("cancelCreate").addEventListener("click", () => {
    cadastroModal.classList.remove("active");
})

document.getElementById("editBtn").addEventListener("click", editarTime)

document.getElementById("deleteBtn").addEventListener("click", excluirTime)

cadastroModal.addEventListener("click", (e) => {
    if (e.target === cadastroModal) {
        cadastroModal.classList.remove("active");
    }
})

form.addEventListener("submit", async(e) => {
    e.preventDefault();

    const novoTime = {
        nome: document.getElementById("nome").value,
        pais: document.getElementById("pais").value,
        data_fundacao: document.getElementById("fundacao").value,
        nome_fundador: document.getElementById("fundador").value,
        descricao: document.getElementById("descricao").value,
        logo_url: document.getElementById("logo").value
    }

    if (editando) {
        await fetch(URL + "/time", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id: timeSelecionado.id, ...novoTime})
        })
    } else {
        await fetch(URL + "/time", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoTime)
        })
    }   
    editando = false;

    cadastroModal.classList.remove("active");
    carregarTimes();
})

detalhes.addEventListener("click", (e) => {
    if (e.target === detalhes) {
        detalhes.classList.remove("active");
    }
});


function abrirDetalhe(id) {
    const time = times.find(t => t.id === id);

    timeSelecionado = time

    document.getElementById("detalheLogo").src = time.logo_url || "";

    document.getElementById("detalheNome").textContent = time.nome;

    document.getElementById("detalhePais").textContent = time.pais;

    document.getElementById("detalheFundacao").textContent = time.data_fundacao;

    document.getElementById("detalheFundador").textContent = time.nome_fundador;

    document.getElementById("detalheDescricao").textContent = time.descricao;

    detalhes.classList.add("active");
}

function editarTime(id) {
    editando = true;

    document.getElementById("formTitulo").textContent = "Editar Time";

    document.getElementById("logo").value = timeSelecionado.logo_url || "";

    document.getElementById("nome").value = timeSelecionado.nome;

    document.getElementById("pais").value = timeSelecionado.pais;

    document.getElementById("fundacao").value = timeSelecionado.data_fundacao;

    document.getElementById("fundador").value = timeSelecionado.nome_fundador;

    document.getElementById("descricao").value = timeSelecionado.descricao;

    detalhes.classList.remove("active");
    cadastroModal.classList.add("active");
}


function renderizarTimes(){
    const cards = document.getElementById("cards");
    cards.innerHTML = "";

    times.forEach(time => {
        cards.innerHTML += `
            <div class="card">
                <img src="${time.logo_url || ''}" alt="${time.nome}">
                <h3>${time.nome}</h3>
                <p>${time.pais}</p>

                <button onclick="abrirDetalhes(${time.id})">
                    Ver detalhes
                </button>
            </div>
        `
    })
}


async function carregarTimes() {
    const response = await fetch(URL + "times")
    times = await response.json();

    renderizarTimes();
}

async function excluirTime() {
    if (!timeSelecionado) return;

    const confirmar = confirm(`Deseja excluir ${timeSelecionado.nome}`);

    if (!confirmar) return;

    try {
        await fetch(URL + "time?id=" + timeSelecionado.id, {
            method: "DELETE"
        })

        detalhes.classList.remove("active");
        carregarTimes()
    } catch(erro) {
        console.error(erro)
        alert("erro ao excluir time")
    } 
}

window.onload = carregarTimes