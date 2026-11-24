import { renderHome } from './views/home.js';
import { renderForm } from './views/form.js';
import { renderList } from './views/list.js';
import { setActiveLink } from './components/navbar.js';
import { getById } from './services/storage.js';
import { showToast } from './components/toast.js';

export const routes = {
  '#/': renderHome,
  '#/recursos': renderList,
  '#/nuevo': renderForm
};

export function initRouter(app) {
  const getAppContainer = () => (typeof app === 'string' ? document.querySelector(app) : app);

  const handleRoute = () => {
    const container = getAppContainer();
    const hash = window.location.hash;

    const editMatch = hash.match(/^#\/editar\/(.+)$/);
    if (editMatch) {
      const id = editMatch[1];
      const recurso = getById(id);
      if (recurso) {
        renderForm(container, recurso);
        setActiveLink('#/recursos');
      } else {
        showToast('Recurso no encontrado', 'error');
        window.location.hash = '#/recursos';
      }
      return;
    }

    const currentHash = routes[hash] ? hash : '#/';
    routes[currentHash](container);
    setActiveLink(currentHash);
  };

  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('load', handleRoute);

  handleRoute();
}
