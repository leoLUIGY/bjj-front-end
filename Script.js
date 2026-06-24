// ===================
// ESTADO
// ===================

let times = []
let timeSelecionado = null;
let editando = false;
const URL = "http://127.0.0.1:5000/";

// ===================
// ELEMENTOS
// ===================

const detalhes = document.getElementById("detalhes");
const cadastroModal = document.getElementById("cadastro-modal");
const form = document.querySelector(".form-time");
const btnOpenCreate = document.getElementById("openCreate");
const btnCancelCreate = document.getElementById("cancelCreate");
const btnFecharModal = document.getElementById("fecharModal");
const btnEdit = document.getElementById("editBtn");
const btnDelete = document.getElementById("deleteBtn");
const searchInput = document.getElementById("searchInput");

// ===================
// INICIALIZAÇÃO
// ===================

window.onload = () => {
    configurarEventos();
    try {
        carregarTimes();
    } catch {
        console.log("Sem Conexão")
    }
}

// ===================
// EVENTOS
// ===================

function configurarEventos(){
    btnOpenCreate.addEventListener("click", abrirCadastro);
    btnCancelCreate.addEventListener("click", fecharCadastro);
    btnFecharModal.addEventListener("click", fecharDetalhes);
    btnEdit.addEventListener("click", editarTime);
    btnDelete.addEventListener("click", excluirTime);
    searchInput.addEventListener("input", filtrarTimes);
    form.addEventListener("submit", salvarTime);
    // detalhes.addEventListener("click", FecharDetalhesAoClicarFora);
    // cadastroModal.addEventListener("click", fecharCadastroAoClicarFora);
}


// ===================
// API
// ===================

async function carregarTimes() {
    const response = await fetch(`${URL}/times`)
    times = await response.json();

    renderizarTimes();
}

async function criarTime(dados) {
    return await fetch(`${URL}/time`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
}

async function atualizarTime(dados) {
    return await fetch(`${URL}/time`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
}

async function deletarTime(id) {
    return await fetch(`${URL}/time?id=${id}`, {
        method: "DELETE"
    })
}

// ===================
// MODAL DETALHES 
// ===================

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

function fecharDetalhes() {
    detalhes.classList.remove("active");
}


// =================
// MODAL CADASTRO
// =================

function abrirCadastro() {
    cadastroModal.classList.add("active");
}

function fecharCadastro() {
    cadastroModal.classList.remove("active");
}

function editarTime() {
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

// =================
// CRUD
// =================

async function salvarTime(e) {
    e.preventDefault();

    const novoTime = {
        nome: document.getElementById("nome").value,
        pais: document.getElementById("pais").value,
        data_fundacao: document.getElementById("fundacao").value,
        nome_fundador: document.getElementById("fundador").value,
        descricao: document.getElementById("descricao").value,
        logo_url: document.getElementById("logo").value
    }
    try {
       

        if (editando) {
           await atualizarTime(novoTime)
        } else {
            await criarTime(novoTime)
        }   
        editando = false;

        cadastroModal.classList.remove("active");
        carregarTimes();
    } catch(erro){
        console.error(erro)
    }
}

async function excluirTime() {
    if (!timeSelecionado) return;

    const confirmar = confirm(`Deseja excluir ${timeSelecionado.nome}`);

    if (!confirmar) return;

    try {
        excluirTime(timeSelecionado.id);
        detalhes.classList.remove("active");
        carregarTimes()
    } catch(erro) {
        console.error(erro)
        alert("erro ao excluir time")
    } 
}

// ==================
// RENDERIZAÇÃO
// ==================

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

function filtrarTimes() {
    const texto = document.getElementById("searchInput").value.toLowerCase();

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        const nome = card.querySelector("h3").textContent.toLowerCase()

        card.style.display = 
            nome.includes(texto)
            ? "block"
            : "none"
    })
}
