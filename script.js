const form = document.getElementById("form-gasto");
const lista = document.getElementById("lista-gastos");
const saldoSpan = document.getElementById("saldo");
const ctx = document.getElementById("grafico");

let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
let grafico = null;

// salvar no localStorage
function salvarDados() {
    localStorage.setItem("gastos", JSON.stringify(gastos));
}

// calcular saldo
function calcularSaldo() {
    let saldo = 0;
    gastos.forEach(g => {
        saldo += g.tipo === "entrada" ? g.valor : -g.valor;
    });
    saldoSpan.textContent = saldo.toFixed(2);
}

// atualizar gráfico
function atualizarGrafico() {
    let entradas = 0;
    let saidas = 0;

    gastos.forEach(g => {
        if (g.tipo === "entrada") entradas += g.valor;
        else saidas += g.valor;
    });

    if (grafico) {
        grafico.destroy();
    }

    grafico = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Entradas", "Saídas"],
            datasets: [{
                data: [entradas, saidas],
                backgroundColor: ["#2ecc71", "#e74c3c"]
            }]
        }
    });
}

// renderizar lista
function renderizar() {
    lista.innerHTML = "";

    gastos.forEach((gasto, index) => {
        const li = document.createElement("li");
        li.className = gasto.tipo;
        li.innerHTML = `
            ${gasto.descricao} - R$ ${gasto.valor.toFixed(2)}
            <button onclick="remover(${index})">❌</button>
        `;
        lista.appendChild(li);
    });

    calcularSaldo();
    atualizarGrafico();
}

// remover gasto
function remover(index) {
    gastos.splice(index, 1);
    salvarDados();
    renderizar();
}

// adicionar gasto
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const descricao = document.getElementById("descricao").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const tipo = document.getElementById("tipo").value;

    gastos.push({ descricao, valor, tipo });

    salvarDados();
    renderizar();
    form.reset();
});

// inicializar
renderizar();
