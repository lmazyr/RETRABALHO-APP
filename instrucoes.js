const listaInstrucoes = document.getElementById("listaInstrucoes");
const busca = document.getElementById("buscaPeca");
const filtroFabrica = document.getElementById("filtroFabrica");
const totalInstrucoes = document.getElementById("totalInstrucoes");
const formInstrucao = document.getElementById("formInstrucao");
const btnLimparInstrucao = document.getElementById("btnLimparInstrucao");
const listaCodigosInstrucao = document.getElementById("listaCodigosInstrucao");

const camposInstrucao = {
    id: document.getElementById("instrucaoId"),
    codigo: document.getElementById("codigoInstrucao"),
    fabrica: document.getElementById("fabricaInstrucao"),
    arquivo: document.getElementById("arquivoInstrucao"),
    titulo: document.getElementById("tituloInstrucao"),
    revisao: document.getElementById("revisaoInstrucao"),
    observacao: document.getElementById("observacaoInstrucao")
};

function obterInstrucoes() {
    return lerJSON("instrucoesRetrabalho", []);
}

function salvarInstrucoes(lista) {
    salvarJSON("instrucoesRetrabalho", lista);
}

function preencherCodigosInstrucao() {
    listaCodigosInstrucao.innerHTML = obterPecas()
        .map(item => `<option value="${item.codigo}">${item.descricao}</option>`)
        .join("");
}

function arquivoParaBase64(arquivo) {
    return new Promise((resolve, reject) => {
        if (!arquivo) {
            resolve(null);
            return;
        }

        if (arquivo.type !== "application/pdf") {
            reject(new Error("Selecione um arquivo PDF."));
            return;
        }

        const leitor = new FileReader();
        leitor.onload = () => resolve(leitor.result);
        leitor.onerror = () => reject(new Error("Nao foi possivel ler o PDF."));
        leitor.readAsDataURL(arquivo);
    });
}

function limparFormularioInstrucao() {
    formInstrucao.reset();
    camposInstrucao.id.value = "";
    camposInstrucao.codigo.focus();
}

async function salvarInstrucao(event) {
    event.preventDefault();

    const lista = obterInstrucoes();
    const id = camposInstrucao.id.value || (window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : String(Date.now()));
    const indice = lista.findIndex(item => item.id === id);
    const peca = encontrarPeca(camposInstrucao.codigo.value);
    const arquivoSelecionado = camposInstrucao.arquivo.files[0];

    if (!peca) {
        alert("Codigo de peca nao cadastrado.");
        camposInstrucao.codigo.focus();
        return;
    }

    if (indice < 0 && !arquivoSelecionado) {
        alert("Selecione um PDF para cadastrar a instrucao.");
        return;
    }

    try {
        const pdfBase64 = await arquivoParaBase64(arquivoSelecionado);
        const atual = indice >= 0 ? lista[indice] : {};
        const instrucao = {
            id,
            codigo: peca.codigo,
            descricao: peca.descricao,
            fabrica: camposInstrucao.fabrica.value,
            titulo: camposInstrucao.titulo.value.trim(),
            revisao: camposInstrucao.revisao.value.trim(),
            observacao: camposInstrucao.observacao.value.trim(),
            nomeArquivo: arquivoSelecionado ? arquivoSelecionado.name : atual.nomeArquivo,
            pdf: pdfBase64 || atual.pdf,
            atualizadoEm: new Date().toISOString()
        };

        if (indice >= 0) {
            lista[indice] = instrucao;
        } else {
            lista.unshift(instrucao);
        }

        salvarInstrucoes(lista);
        limparFormularioInstrucao();
        renderizarInstrucoes();
        alert("Instrucao salva com sucesso.");
    } catch (erro) {
        alert(erro.message);
    }
}

function editarInstrucao(id) {
    const item = obterInstrucoes().find(instrucao => instrucao.id === id);

    if (!item) return;

    camposInstrucao.id.value = item.id;
    camposInstrucao.codigo.value = item.codigo;
    camposInstrucao.fabrica.value = item.fabrica;
    camposInstrucao.titulo.value = item.titulo;
    camposInstrucao.revisao.value = item.revisao || "";
    camposInstrucao.observacao.value = item.observacao || "";
    camposInstrucao.titulo.focus();
}

function excluirInstrucao(id) {
    if (!confirm("Deseja excluir esta instrucao?")) return;

    salvarInstrucoes(obterInstrucoes().filter(item => item.id !== id));
    renderizarInstrucoes();
}

function abrirInstrucao(id) {
    const item = obterInstrucoes().find(instrucao => instrucao.id === id);

    if (!item || !item.pdf) {
        alert("PDF nao encontrado.");
        return;
    }

    const janela = window.open();
    if (!janela) {
        alert("O navegador bloqueou a abertura do PDF. Permita pop-ups para visualizar.");
        return;
    }

    janela.document.write(`
        <iframe title="${item.titulo}" src="${item.pdf}" style="border:0;width:100%;height:100vh"></iframe>
    `);
}

function renderizarInstrucoes() {
    const texto = normalizarTexto(busca.value);
    const fabricaSelecionada = filtroFabrica.value;

    const resultado = obterInstrucoes().filter(item => {
        const correspondeTexto =
            !texto ||
            item.codigo.includes(texto) ||
            normalizarTexto(item.descricao).includes(texto) ||
            normalizarTexto(item.titulo).includes(texto);

        const correspondeFabrica = !fabricaSelecionada || item.fabrica === fabricaSelecionada;

        return correspondeTexto && correspondeFabrica;
    });

    totalInstrucoes.textContent = `${resultado.length} registros`;

    if (resultado.length === 0) {
        listaInstrucoes.innerHTML = "<p class='sem-registros'>Nenhuma instrucao encontrada.</p>";
        return;
    }

    listaInstrucoes.innerHTML = resultado.map(item => `
        <article class="registro">
            <div>
                <strong>${item.codigo} - ${item.titulo}</strong>
                <span>${item.descricao} | Fabrica ${item.fabrica} | ${item.revisao || "Sem revisao"}</span>
                <span>${item.nomeArquivo || "PDF cadastrado"}</span>
            </div>
            <div class="registro-metricas">
                <span class="tag">${item.fabrica}</span>
                <button type="button" class="btn-mini" onclick="abrirInstrucao('${item.id}')">Visualizar</button>
                <button type="button" class="btn-mini" onclick="editarInstrucao('${item.id}')">Editar</button>
                <button type="button" class="btn-mini perigo" onclick="excluirInstrucao('${item.id}')">Excluir</button>
            </div>
        </article>
    `).join("");
}

formInstrucao.addEventListener("submit", salvarInstrucao);
btnLimparInstrucao.addEventListener("click", limparFormularioInstrucao);
busca.addEventListener("input", renderizarInstrucoes);
filtroFabrica.addEventListener("change", renderizarInstrucoes);

window.abrirInstrucao = abrirInstrucao;
window.editarInstrucao = editarInstrucao;
window.excluirInstrucao = excluirInstrucao;

preencherCodigosInstrucao();
renderizarInstrucoes();
