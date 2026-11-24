import { TIPOS, TEMAS, NIVELES } from '../data/options.js';
import { getAll } from '../services/storage.js';

function getLabel(lista, value) {
  const item = lista.find((option) => option.value === value);
  return item ? item.label : value;
}

export function renderList(app) {
  const container = typeof app === 'string' ? document.querySelector(app) : app;
  if (!container) return;

  const rawResources = typeof getAll === 'function' ? getAll() : [];
  const recursos = Array.isArray(rawResources) ? rawResources : [];
  const sortedResources = [...recursos].sort(
    (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
  );

  const renderContent = () => {
    container.innerHTML = `
      <div class="list-view">
        <div class="list-header">
          <h1 class="list-title">Mis recursos</h1>
          <a href="#/nuevo" class="btn btn-primary">+ Nuevo recurso</a>
        </div>

        ${
          sortedResources.length === 0
            ? `
          <div class="card empty-state">
            <p class="empty-state__text">Aún no tienes recursos</p>
            <a href="#/nuevo" class="btn btn-primary">Agregar el primero</a>
          </div>
        `
            : `
          <div class="resources-grid">
            ${sortedResources
              .map((recurso) => {
                let hostname = '';
                try {
                  hostname = new URL(recurso.url).hostname;
                } catch {
                  hostname = recurso.url || '';
                }

                const formattedDate = recurso.fechaCreacion
                  ? new Date(recurso.fechaCreacion).toLocaleDateString('es-SV')
                  : '';

                return `
                  <article class="card resource-card">
                    <div class="resource-card__header">
                      <span class="badge badge--${recurso.tipo}">
                        ${getLabel(TIPOS, recurso.tipo)}
                      </span>
                      ${recurso.favorito ? '<span class="favorite-star">★</span>' : ''}
                    </div>

                    <div class="resource-card__body">
                      <h2 class="resource-card__title">
                        <a href="${recurso.url}" target="_blank" rel="noopener">
                          ${recurso.titulo}
                        </a>
                      </h2>
                      <code class="resource-card__domain">${hostname}</code>
                    </div>

                    <div class="resource-card__meta">
                      <span class="resource-meta-tag">${getLabel(TEMAS, recurso.tema)}</span>
                      <span class="resource-meta-separator">•</span>
                      <span class="resource-meta-tag">${getLabel(NIVELES, recurso.nivel)}</span>
                    </div>

                    <div class="resource-card__footer">
                      <span class="resource-card__date">${formattedDate}</span>
                      <a href="#/editar/${recurso.id}" class="btn btn-secondary">Editar</a>
                    </div>
                  </article>
                `;
              })
              .join('')}
          </div>
        `
        }
      </div>
    `;
  };

  renderContent();
}
