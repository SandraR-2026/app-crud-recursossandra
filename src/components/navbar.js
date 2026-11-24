export function renderNavbar(container) {
  const target = typeof container === 'string' ? document.querySelector(container) : container;
  if (!target) return;

  target.innerHTML = `
    <nav class="navbar">
      <span class="logo">DevShelf</span>
      <div class="nav-links">
        <a href="#/">Inicio</a>
        <a href="#/recursos">Mis recursos</a>
        <a href="#/nuevo">Nuevo recurso</a>
      </div>
    </nav>
  `;
}

export function setActiveLink(hash) {
  const links = document.querySelectorAll('.navbar a');
  links.forEach(link => {
    if (link.getAttribute('href') === hash) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
