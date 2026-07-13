const formPeca = document.getElementById("formPeca");
const tabelaPecas = document.getElementById("tabelaPecas");
const buscaPeca = document.getElementById("buscaPeca");
const btnLimpar = document.getElementById("btnLimpar");
const SENHA_ADMIN = "1234";

const campos = {
    indice: document.getElementById("indiceEdicao"),
    codigo: document.getElementById("codigo"),
    descricao: document.getElementById("descricao"),
    fabrica: document.getElementById("fabrica"),
    cc: document.getElementById("cc"),
    pecasPorMU: document.getElementById("pecasPorMU")
};

function limparFormularioPeca() {
    formPeca.reset();
    campos.indice.value = "";
    campos.codigo.disabled = false;
    campos.codigo.focus();
}

function validarAdmin() {
    return prompt("Informe a senha de administrador:") === SENHA_ADMIN;
}

function renderizarPecas() {
    const termo = normalizarTexto(buscaPeca.value);
    const lista = obterPecas().filter(item => {
        return item.codigo.includes(termo) || normalizarTexto(item.descricao).includes(termo);
    });

    if (lista.length === 0) {
        tabelaPecas.innerHTML = `
            <tr>
                <td colspan="6" class="sem-registros">Nenhuma peca encontrada.</td>
            </tr>
        `;
        return;
    }

    tabelaPecas.innerHTML = lista.map(item => `
        <tr>
            <td>${item.codigo}</td>
            <td>${item.descricao}</td>
            <td><span class="tag">${item.fabrica}</span></td>
            <td>${item.cc || "<span class='tag alerta'>SEM CC</span>"}</td>
            <td>${item.pecasPorMU}</td>
            <td class="acoes-tabela">
                <button type="button" class="btn-mini" onclick="editarPeca('${item.codigo}')">Editar</button>
                <button type="button" class="btn-mini perigo" onclick="excluirPeca('${item.codigo}')">Excluir</button>
            </td>
        </tr>
    `).join("");
}

function salvarPeca(event) {
    event.preventDefault();

    const lista = obterPecas();
    const codigo = campos.codigo.value.trim();
    const existente = lista.findIndex(item => item.codigo === codigo);
    const indiceEdicao = campos.indice.value === "" ? -1 : Number(campos.indice.value);

    if (existente >= 0 && existente !== indiceEdicao) {
        alert("Ja existe uma peca com este codigo.");
        return;
    }

    const peca = {
        codigo,
        descricao: normalizarTexto(campos.descricao.value),
        fabrica: campos.fabrica.value,
        cc: campos.cc.value.trim(),
        pecasPorMU: Number(campos.pecasPorMU.value)
    };

    if (indiceEdicao >= 0) {
        lista[indiceEdicao] = peca;
    } else {
        lista.push(peca);
    }

    salvarPecas(lista);
    limparFormularioPeca();
    renderizarPecas();
}

function editarPeca(codigo) {
    if (!validarAdmin()) {
        alert("Senha incorreta.");
        return;
    }

    const lista = obterPecas();
    const indice = lista.findIndex(item => item.codigo === codigo);

    if (indice < 0) return;

    const peca = lista[indice];
    campos.indice.value = indice;
    campos.codigo.value = peca.codigo;
    campos.codigo.disabled = true;
    campos.descricao.value = peca.descricao;
    campos.fabrica.value = peca.fabrica;
    campos.cc.value = peca.cc || "";
    campos.pecasPorMU.value = peca.pecasPorMU;
    campos.descricao.focus();
}

function excluirPeca(codigo) {
    if (!validarAdmin()) {
        alert("Senha incorreta.");
        return;
    }

    if (!confirm("Deseja excluir esta peca do cadastro?")) return;

    const lista = obterPecas().filter(item => item.codigo !== codigo);
    salvarPecas(lista);
    renderizarPecas();
}

formPeca.addEventListener("submit", salvarPeca);
buscaPeca.addEventListener("input", renderizarPecas);
btnLimpar.addEventListener("click", limparFormularioPeca);

window.editarPeca = editarPeca;
window.excluirPeca = excluirPeca;

renderizarPecas();
