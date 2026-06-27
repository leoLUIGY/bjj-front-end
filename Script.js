// ===================
// ESTADO
// ===================

let times = []
let timeSelecionado = null;
let editando = false;
const URL = "http://127.0.0.1:5000";
const IMAGEM_DEFAULT = 'https://static.vecteezy.com/system/resources/previews/048/910/778/large_2x/default-image-missing-placeholder-free-vector.jpg'

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


function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
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
}


// ===================
// API
// ===================
async function carregarTime(id) {
    const response = await fetch(`${URL}/time?id=${id}`, {
        method: "GET"
    })

    return await response.json();
}


async function carregarTimes() {
    times = [];
    const response = await fetch(`${URL}/times`)
    times = await response.json();

    renderizarTimes();
}

async function criarTime(dados) {
    const formData = new FormData();
    formData.append('nome', dados.nome);
    formData.append('nome_fundador', dados.nome_fundador);
    formData.append('data_fundacao', formatarData(dados.data_fundacao));
    formData.append('logo_url', dados.logo_url );
    formData.append('pais', dados.pais);
    formData.append('descricao', dados.descricao);

    return await fetch(`${URL}/time`, {
        method: "POST",
        body: formData
    }) 
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

async function atualizarTime(dados) {
    const formData = new FormData();
    formData.append('id', dados.id)
    formData.append('nome', dados.nome);
    formData.append('nome_fundador', dados.nome_fundador);
    formData.append('data_fundacao', formatarData(dados.data_fundacao));
    formData.append('logo_url', dados.logo_url);
    formData.append('pais', dados.pais);
    formData.append('descricao', dados.descricao);

    return await fetch(`${URL}/time`, {
        method: "PUT",
        body: formData
    }) 
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

async function deletarTime(id) {
    return await fetch(`${URL}/time?id=${id}`, {
        method: "DELETE"
    })
     .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

// ===================
// MODAL DETALHES 
// ===================

async function abrirDetalhe(id) {
    const time = await carregarTime(id);

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
    editando = false;
    document.getElementById("formTitulo").textContent = "Novo Time";

    document.getElementById("logo").value = "";

    document.getElementById("nome").value = "";

    document.getElementById("pais").value = "";

   
    document.getElementById("fundacao").value = "";

    document.getElementById("fundador").value = ""

    document.getElementById("descricao").value = ""

    detalhes.classList.remove("active");
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

    const [dia, mes, ano] = timeSelecionado.data_fundacao.split("/");
    document.getElementById("fundacao").value = `${ano}-${mes}-${dia}`;

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
            novoTime.id = timeSelecionado.id;
            console.log(JSON.stringify(novoTime))
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
        await deletarTime(timeSelecionado.id);
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
                <img src="${time.logo_url || IMAGEM_DEFAULT}" alt="${time.nome}">
                <h3>${time.nome}</h3>
                <p>${time.pais}</p>

                <button onclick="abrirDetalhe(${time.id})">
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
