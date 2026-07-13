const PECAS_PADRAO = [
    { codigo: "1868357", descricao: "COLETOR DE OLEO", fabrica: "AEN", cc: "3308", pecasPorMU: 200 },
    { codigo: "2863382", descricao: "MOLA EM FOLHA", fabrica: "ATN", cc: "3519", pecasPorMU: 12 },
    { codigo: "2797756", descricao: "VIRABREQUIM", fabrica: "AMN", cc: "3463", pecasPorMU: 6 },
    { codigo: "2815255", descricao: "VALVULA SOLENOIDE", fabrica: "AEN", cc: "3308", pecasPorMU: 80 },
    { codigo: "2815256", descricao: "VALVULA SOLENOIDE", fabrica: "AEN", cc: "3308", pecasPorMU: 80 },
    { codigo: "2104581", descricao: "PAINEL DO TETO", fabrica: "AVN", cc: "", pecasPorMU: 7 },
    { codigo: "2104582", descricao: "PAINEL DO TETO", fabrica: "AVN", cc: "", pecasPorMU: 7 },
    { codigo: "2291208", descricao: "CONSOLE DE TETO", fabrica: "ACN", cc: "3605", pecasPorMU: 4 },
    { codigo: "2378715", descricao: "TAMBOR DE FREIO", fabrica: "AEN", cc: "", pecasPorMU: 18 },
    { codigo: "2378716", descricao: "TAMBOR DE FREIO", fabrica: "AEN", cc: "", pecasPorMU: 15 },
    { codigo: "2188246", descricao: "CARCACA DO EIXO TRASEIRO", fabrica: "AEN", cc: "3308", pecasPorMU: 2 },
    { codigo: "2188247", descricao: "CARCACA DO EIXO TRASEIRO", fabrica: "AEN", cc: "3308", pecasPorMU: 2 },
    { codigo: "2722701", descricao: "DOSADOR", fabrica: "ATN", cc: "3519", pecasPorMU: 96 },
    { codigo: "2564093", descricao: "COMPRESSOR AC", fabrica: "AMN", cc: "3308", pecasPorMU: 48 },
    { codigo: "3068793", descricao: "CAPA DO MANCAL", fabrica: "AMN", cc: "3408", pecasPorMU: 180 },
    { codigo: "3068792", descricao: "CAPA DO MANCAL", fabrica: "AMN", cc: "3408", pecasPorMU: 60 },
    { codigo: "2428092", descricao: "ECU", fabrica: "AMN", cc: "3066", pecasPorMU: 48 },
    { codigo: "2994087", descricao: "ECU", fabrica: "AMN", cc: "3308", pecasPorMU: 48 },
    { codigo: "2195002", descricao: "CABECOTE DO CILINDRO", fabrica: "AMN", cc: "3489", pecasPorMU: 51 },
    { codigo: "3156427", descricao: "BRACO DE BALANCIM", fabrica: "AMN", cc: "3308", pecasPorMU: 192 },
    { codigo: "3214884", descricao: "ARVORE DE MANIVELAS", fabrica: "AMN", cc: "3463", pecasPorMU: 6 }
];

function lerJSON(chave, fallback) {
    try {
        return JSON.parse(localStorage.getItem(chave)) || fallback;
    } catch {
        return fallback;
    }
}

function salvarJSON(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
}

function obterPecas() {
    const salvas = lerJSON("pecasRetrabalho", null);

    if (!salvas) {
        salvarJSON("pecasRetrabalho", PECAS_PADRAO);
        return [...PECAS_PADRAO];
    }

    return salvas;
}

function salvarPecas(lista) {
    salvarJSON("pecasRetrabalho", lista);
}

function normalizarTexto(texto) {
    return String(texto || "").trim().toUpperCase();
}

function encontrarPeca(codigo) {
    return obterPecas().find(item => item.codigo === String(codigo || "").trim());
}

function normalizarLancamento(item, index) {
    const quantidadeSalva = Number(item.quantidadePecas || 0);
    const pecasPorMU = Number(item.pecasPorMU || quantidadeSalva);

    return {
        ...item,
        id: item.id || `legado-${index}`,
        turno: item.turno || "",
        numeroMU: String(item.numeroMU || ""),
        pecasPorMU,
        quantidadePecas: item.pecasPorMU ? quantidadeSalva : quantidadeSalva
    };
}

function obterLancamentosBase() {
    return lerJSON("lancamentos", []).map(normalizarLancamento);
}

const pecas = obterPecas();

window.PECAS_PADRAO = PECAS_PADRAO;
window.obterPecas = obterPecas;
window.salvarPecas = salvarPecas;
window.encontrarPeca = encontrarPeca;
window.normalizarTexto = normalizarTexto;
window.obterLancamentosBase = obterLancamentosBase;
