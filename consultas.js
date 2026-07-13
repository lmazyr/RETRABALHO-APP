let resultadoAtual = [];

function obterLancamentosConsulta() {
    return obterLancamentosBase();
}

function pesquisarConsultas() {
    const dados = obterLancamentosConsulta();
    const dataInicial = document.getElementById("dataInicial").value;
    const dataFinal = document.getElementById("dataFinal").value;
    const texto = normalizarTexto(document.getElementById("filtroPeca").value);
    const mu = document.getElementById("filtroMU").value.trim();
    const fabrica = document.getElementById("filtroFabrica").value;

    resultadoAtual = dados.filter(item => {
        const filtroDataInicial = !dataInicial || item.data >= dataInicial;
        const filtroDataFinal = !dataFinal || item.data <= dataFinal;
        const filtroTexto = !texto ||
            String(item.codigo).includes(texto) ||
            normalizarTexto(item.descricao).includes(texto);
        const filtroMU = !mu || String(item.numeroMU).includes(mu);
        const filtroFabrica = !fabrica || item.fabrica === fabrica;

        return filtroDataInicial && filtroDataFinal && filtroTexto && filtroMU && filtroFabrica;
    });

    renderizarTabela(resultadoAtual);
}

function renderizarTabela(dados) {
    const tbody = document.getElementById("resultadoConsulta");
    const total = document.getElementById("totalResultados");

    total.textContent = `${dados.length} registros`;

    if (dados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="sem-registros">Nenhum lancamento encontrado.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = dados.map(item => `
        <tr>
            <td>${formatarData(item.data)}</td>
            <td>${item.turno || "-"}</td>
            <td>${item.responsavel}</td>
            <td><span class="tag">${item.fabrica}</span></td>
            <td>${item.codigo}</td>
            <td>${item.descricao}</td>
            <td>${item.numeroMU}</td>
            <td>${item.quantidadePecas}</td>
            <td>${item.cc || "<span class='tag alerta'>SEM CC</span>"}</td>
            <td>${item.obs || "-"}</td>
        </tr>
    `).join("");
}

function exportarExcel() {
    const dados = resultadoAtual;

    if (dados.length === 0) {
        alert("Nenhum lancamento encontrado.");
        return;
    }

    const cabecalho = [
        "Data",
        "Turno",
        "Responsavel",
        "Fabrica",
        "Codigo",
        "Descricao",
        "Numero MU",
        "Pecas",
        "CC",
        "Observacao"
    ];

    const linhas = dados.map(item => [
        item.data,
        item.turno || "",
        item.responsavel,
        item.fabrica,
        item.codigo,
        item.descricao,
        item.numeroMU,
        item.quantidadePecas,
        item.cc || "",
        item.obs || ""
    ].map(valor => `"${String(valor).replaceAll('"', '""')}"`).join(";"));

    const csv = [cabecalho.join(";"), ...linhas].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_retrabalho_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
}

function limparFiltros() {
    document.getElementById("dataInicial").value = "";
    document.getElementById("dataFinal").value = "";
    document.getElementById("filtroPeca").value = "";
    document.getElementById("filtroMU").value = "";
    document.getElementById("filtroFabrica").value = "";
    pesquisarConsultas();
}

function formatarData(data) {
    if (!data) return "-";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

window.pesquisarConsultas = pesquisarConsultas;
window.exportarExcel = exportarExcel;
window.limparFiltros = limparFiltros;

pesquisarConsultas();
