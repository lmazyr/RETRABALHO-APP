const formLancamento = document.getElementById("formLancamento");
const inputPeca = document.getElementById("peca");
const descricaoInput = document.getElementById("descricao");
const fabricaInput = document.getElementById("fabrica");
const ccInput = document.getElementById("cc");
const alertaCC = document.getElementById("alertaCC");
const muInput = document.getElementById("mu");
const quantidadeTotalInput = document.getElementById("quantidadeTotal");
const lista = document.getElementById("listaLancamentos");
const totalLancamentos = document.getElementById("totalLancamentos");
const dataInput = document.getElementById("data");
const turnoInput = document.getElementById("turno");
const responsavelInput = document.getElementById("responsavel");
const obsInput = document.getElementById("obs");
const listaCodigos = document.getElementById("listaCodigos");

function obterLancamentos() {
    return obterLancamentosBase();
}

function salvarLancamentos(dados) {
    salvarJSON("lancamentos", dados);
}

function preencherCodigos() {
    listaCodigos.innerHTML = obterPecas()
        .map(item => `<option value="${item.codigo}">${item.descricao}</option>`)
        .join("");
}

function atualizarPeca() {
    const peca = encontrarPeca(inputPeca.value);

    if (!peca) {
        descricaoInput.value = "";
        fabricaInput.value = "";
        ccInput.value = "";
        quantidadeTotalInput.value = "";
        alertaCC.textContent = inputPeca.value.trim() ? "Peca nao cadastrada." : "";
        return;
    }

    descricaoInput.value = peca.descricao;
    fabricaInput.value = peca.fabrica;
    ccInput.value = peca.cc || "";
    quantidadeTotalInput.value = peca.pecasPorMU;
    alertaCC.textContent = peca.cc ? "" : "Atencao: esta peca nao possui CC cadastrado.";
}

function salvarLancamento(event) {
    event.preventDefault();

    const peca = encontrarPeca(inputPeca.value);
    const numeroMU = muInput.value.trim();

    if (!peca) {
        alert("Peca nao encontrada. Cadastre a peca antes de lancar.");
        inputPeca.focus();
        return;
    }

    if (!numeroMU) {
        alert("Informe o numero da M.U.");
        muInput.focus();
        return;
    }

    const novo = {
        id: window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : String(Date.now()),
        data: dataInput.value,
        turno: turnoInput.value,
        responsavel: responsavelInput.value.trim(),
        codigo: peca.codigo,
        descricao: peca.descricao,
        fabrica: peca.fabrica,
        cc: peca.cc || "",
        numeroMU,
        pecasPorMU: Number(peca.pecasPorMU),
        quantidadePecas: Number(peca.pecasPorMU),
        obs: obsInput.value.trim()
    };

    const dados = obterLancamentos();
    dados.unshift(novo);
    salvarLancamentos(dados);

    alert("Lancamento salvo com sucesso.");
    limparFormulario();
    carregarLista();
}

function limparFormulario() {
    formLancamento.reset();
    dataInput.valueAsDate = new Date();
    descricaoInput.value = "";
    fabricaInput.value = "";
    ccInput.value = "";
    quantidadeTotalInput.value = "";
    alertaCC.textContent = "";
    responsavelInput.focus();
}

function carregarLista() {
    const dados = obterLancamentos();
    totalLancamentos.textContent = `${dados.length} registros`;

    if (dados.length === 0) {
        lista.innerHTML = "<p class='sem-registros'>Nenhum lancamento realizado.</p>";
        return;
    }

    lista.innerHTML = dados.slice(0, 8).map(item => `
        <article class="registro">
            <div>
                <strong>${item.codigo} - ${item.descricao}</strong>
                <span>${formatarData(item.data)} | ${item.turno || "Sem turno"} | ${item.responsavel}</span>
            </div>
            <div class="registro-metricas">
                <span class="tag">${item.fabrica}</span>
                <span>${item.numeroMU} M.U</span>
                <span>${item.quantidadePecas} pecas</span>
                <button type="button" class="btn-mini perigo" onclick="excluirLancamento('${item.id}')">Excluir</button>
            </div>
        </article>
    `).join("");
}

function excluirLancamento(id) {
    if (!confirm("Deseja excluir este lancamento?")) return;

    const dados = lerJSON("lancamentos", []);
    salvarLancamentos(dados.filter((item, index) => (item.id || `legado-${index}`) !== id));
    carregarLista();
}

function formatarData(data) {
    if (!data) return "-";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

inputPeca.addEventListener("input", atualizarPeca);
formLancamento.addEventListener("submit", salvarLancamento);
document.getElementById("btnLimpar").addEventListener("click", limparFormulario);

window.excluirLancamento = excluirLancamento;
window.salvarLancamento = salvarLancamento;

preencherCodigos();
limparFormulario();
carregarLista();
