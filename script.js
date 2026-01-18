const form = document.getElementById("form-gasto");
const lista = document.getElementById("lista-gastos");
const saldoSpan = document.getElementById("saldo");

let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

function salvarDados() {
    localStorage.setItem("gastos", JSON.stringify(gastos));
}

function calcularSaldo() {
    let saldo = 0;
    gastos.forEach(g => {
        saldo += g.tipo === "entrada" ? g.valor : -g.valor;
    });
    saldoSpan.textContent = saldo.toFixed(2);
}

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
}

function remover(index) {
    gastos.splice(index, 1);
    salvarDados();
    renderizar();
}

form.addEventListener("submit", e => {
    e.preventDefault();

    const descricao = document.getElementById("descricao").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const tipo = document.getElementById("tipo").value;

    gastos.push({ descricao, valor, tipo });

    salvarDados();
    renderizar();
    form.reset();
});

renderizar();
