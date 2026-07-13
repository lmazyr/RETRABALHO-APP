function calcularIndicadoresDashboard() {
    const lancamentos = lerJSON("lancamentos", []);

    return {
        totalRegistros: lancamentos.length,
        totalMU: lancamentos.reduce((total, item) => total + Number(item.numeroMU || 0), 0),
        totalPecas: lancamentos.reduce((total, item) => total + Number(item.quantidadePecas || 0), 0),
        semCC: lancamentos.filter(item => !item.cc).length
    };
}

window.calcularIndicadoresDashboard = calcularIndicadoresDashboard;
