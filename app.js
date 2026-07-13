function iniciarLayoutGlobal() {
    const sidebar = document.querySelector(".sidebar");
    const container = document.querySelector(".container");

    if (!sidebar || !container) return;

    const barraTopo = document.createElement("div");
    barraTopo.className = "topbar";
    barraTopo.innerHTML = `
        <button type="button" class="btn-menu" id="btnMenu" aria-label="Abrir menu">Menu</button>
        <a href="index.html" class="btn-inicio">Inicio</a>
    `;

    document.body.insertBefore(barraTopo, document.body.firstChild);

    const overlay = document.createElement("div");
    overlay.className = "menu-overlay";
    document.body.appendChild(overlay);

    function alternarMenu() {
        sidebar.classList.toggle("aberta");
        overlay.classList.toggle("visivel");
        document.body.classList.toggle("menu-aberto");
    }

    document.getElementById("btnMenu").addEventListener("click", alternarMenu);
    overlay.addEventListener("click", alternarMenu);

    sidebar.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            sidebar.classList.remove("aberta");
            overlay.classList.remove("visivel");
            document.body.classList.remove("menu-aberto");
        });
    });
}

document.addEventListener("DOMContentLoaded", iniciarLayoutGlobal);
