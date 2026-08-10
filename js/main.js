// js/main.js
document.addEventListener("DOMContentLoaded", () => {
    // Carregar Header
    fetch('/components/header.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        });

    // Carregar Footer
    fetch('/components/footer.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
});

// Função para abrir Pop-up da 3cket
function open3cketModal(eventUrl) {
    const modal = document.getElementById('ticket-modal');
    const iframe = document.getElementById('ticket-iframe');
    iframe.src = eventUrl;
    modal.style.display = 'flex';
}

function close3cketModal() {
    const modal = document.getElementById('ticket-modal');
    const iframe = document.getElementById('ticket-iframe');
    iframe.src = '';
    modal.style.display = 'none';
}
