import { getStats } from '../services/storage.js';

function formatStat(val) {
  if (Array.isArray(val)) return val.length;
  if (typeof val === 'number') return val;
  if (typeof val === 'string' && !isNaN(Number(val))) return Number(val);
  return val ?? 0;
}

export function renderHome(app) {
  const container = typeof app === 'string' ? document.querySelector(app) : app;
  if (!container) return;

  const renderContent = (stats = {}) => {
    const totalCount = formatStat(
      stats.total ??
      stats.resources ??
      stats.recursos ??
      stats.guardados ??
      stats.recursosGuardados ??
      stats.totalResources ??
      0
    );

    const favoritesCount = formatStat(
      stats.favorites ??
      stats.favoritos ??
      stats.favs ??
      stats.totalFavorites ??
      0
    );

    const topicsCount = formatStat(
      stats.topics ??
      stats.temas ??
      stats.themes ??
      stats.totalTopics ??
      0
    );

    container.innerHTML = `
      <div class="home-view">
        <section class="hero">
          <h1 class="hero__title">Tu biblioteca de recursos para aprender a programar</h1>
          <p class="hero__subtitle">Guarda, organiza y accede a tus recursos favoritos en un solo lugar.</p>
          <a href="#/recursos" class="btn btn-primary">Empezar</a>
        </section>

        <section class="stats-section cards-grid">
          <div class="card stat-card">
            <span class="stat-card__number">${totalCount}</span>
            <h3 class="stat-card__label">Recursos guardados</h3>
          </div>
          <div class="card stat-card">
            <span class="stat-card__number">${favoritesCount}</span>
            <h3 class="stat-card__label">Favoritos</h3>
          </div>
          <div class="card stat-card">
            <span class="stat-card__number">${topicsCount}</span>
            <h3 class="stat-card__label">Temas</h3>
          </div>
        </section>

        <section class="features-section cards-grid">
          <div class="card feature-card">
            <h3 class="feature-card__title">Guardar</h3>
            <p class="feature-card__text">Almacena enlaces a videos, artículos, cursos y documentación útil.</p>
          </div>
          <div class="card feature-card">
            <h3 class="feature-card__title">Organizar</h3>
            <p class="feature-card__text">Clasifica por temas, tipos y niveles para estructurar tu aprendizaje.</p>
          </div>
          <div class="card feature-card">
            <h3 class="feature-card__title">Encontrar</h3>
            <p class="feature-card__text">Localiza y filtra rápidamente el recurso exacto cuando lo necesites.</p>
          </div>
        </section>
      </div>
    `;
  };

  try {
    const statsResult = typeof getStats === 'function' ? getStats() : {};
    if (statsResult instanceof Promise) {
      statsResult.then(renderContent).catch(() => renderContent({}));
    } else {
      renderContent(statsResult);
    }
  } catch (error) {
    console.error('Error loading stats:', error);
    renderContent({});
  }
}
