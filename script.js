// ==============================
// CONTROLE FINANCEIRO - SCRIPT
// ==============================

// Elementos
const form = document.getElementById("form-gasto");
const lista = document.getElementById("lista-gastos");
const saldoEl = document.getElementById("saldo");
const entradasEl = document.getElementById("total-entradas");
const saidasEl = document.getElementById("total-saidas");
const graficoCanvas = document.getElementById("grafico");

// Estado
let movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || [];
let grafico = null;

// ==============================
// FUNÇÕES DE UTILIDADE
// ==============================
function salvar() {
    localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
}

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// ==============================
// CÁLCULOS
// ==============================
function calcularResumo() {
    let entradas = 0;
    let saidas = 0;

    movimentacoes.forEach(m => {
        if (m.tipo === "entrada") entradas += m.valor;
        else saidas += m.valor;
    });

    saldoEl.textContent = formatarMoeda(entradas - saidas);
    entradasEl.textContent = formatarMoeda(entradas);
    saidasEl.textContent = formatarMoeda(saidas);

    atualizarGrafico(entradas, saidas);
}

// ==============================
// GRÁFICO
// ==============================
function atualizarGrafico(entradas, saidas) {
    if (grafico) grafico.destroy();

    grafico = new Chart(graficoCanvas, {
        type: "doughnut",
        data: {
            labels: ["Entradas", "Saídas"],
            datasets: [{
                data: [entradas, saidas],
                backgroundColor: ["#2ecc71", "#e74c3c"]
            }]
        }
    });
}

// ==============================
// RENDERIZAÇÃO
// ==============================
function renderizarLista() {
    lista.innerHTML = "";

    movimentacoes.forEach((m, index) => {
        const li = document.createElement("li");
        li.className = m.tipo;
        li.innerHTML = `
            <span>${m.descricao}</span>
            <span>${formatarMoeda(m.valor)}</span>
            <button onclick="remover(${index})">🗑️</button>
        `;
        lista.appendChild(li);
    });

    calcularResumo();
}

// ==============================
// EVENTOS
// ==============================
form.addEventListener("submit", e => {
    e.preventDefault();

    const descricao = document.getElementById("descricao").value.trim();
    const valor = Number(document.getElementById("valor").value);
    const tipo = document.getElementById("tipo").value;

    movimentacoes.push({ descricao, valor, tipo });

    salvar();
    renderizarLista();
    form.reset();
});

function remover(index) {
    movimentacoes.splice(index, 1);
    salvar();
    renderizarLista();
}

// ==============================
// INICIALIZAÇÃO
// ==============================
renderizarLista();
