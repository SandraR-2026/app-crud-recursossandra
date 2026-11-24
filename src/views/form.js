import { TIPOS, TEMAS, NIVELES } from '../data/options.js';
import { create, update } from '../services/storage.js';
import { showToast } from '../components/toast.js';

export function renderForm(app, recurso = null) {
  const container = typeof app === 'string' ? document.querySelector(app) : app;
  if (!container) return;

  const isEdit = Boolean(recurso);

  container.innerHTML = `
    <div class="form-view">
      <h1 class="form-title">${isEdit ? 'Editar recurso' : 'Nuevo recurso'}</h1>
      <div class="card form-card">
        <form id="resource-form" class="resource-form" novalidate>
          <div class="form-group">
            <label for="titulo" class="form-label">Título</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              class="input"
              placeholder="Ej. Documentación oficial de MDN"
              value="${recurso ? (recurso.titulo || '').replace(/"/g, '&quot;') : ''}"
            />
          </div>

          <div class="form-group">
            <label for="url" class="form-label">URL</label>
            <input
              type="url"
              id="url"
              name="url"
              class="input"
              placeholder="https://developer.mozilla.org"
              value="${recurso ? (recurso.url || '').replace(/"/g, '&quot;') : ''}"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="tipo" class="form-label">Tipo</label>
              <select id="tipo" name="tipo" class="select">
                <option value="">Selecciona...</option>
                ${TIPOS.map(
                  (tipo) => `
                  <option value="${tipo.value}" ${recurso && recurso.tipo === tipo.value ? 'selected' : ''}>
                    ${tipo.label}
                  </option>
                `
                ).join('')}
              </select>
            </div>

            <div class="form-group">
              <label for="tema" class="form-label">Tema</label>
              <select id="tema" name="tema" class="select">
                <option value="">Selecciona...</option>
                ${TEMAS.map(
                  (tema) => `
                  <option value="${tema.value}" ${recurso && recurso.tema === tema.value ? 'selected' : ''}>
                    ${tema.label}
                  </option>
                `
                ).join('')}
              </select>
            </div>
          </div>

          <div class="form-group">
            <span class="form-label">Nivel</span>
            <div class="radio-group">
              ${NIVELES.map((nivel) => {
                const isChecked = recurso ? recurso.nivel === nivel.value : nivel.value === 'basico';
                return `
                  <label class="radio-label">
                    <input
                      type="radio"
                      name="nivel"
                      value="${nivel.value}"
                      ${isChecked ? 'checked' : ''}
                    />
                    <span>${nivel.label}</span>
                  </label>
                `;
              }).join('')}
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                id="favorito"
                name="favorito"
                ${recurso && recurso.favorito ? 'checked' : ''}
              />
              <span>Marcar como favorito</span>
            </label>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">${isEdit ? 'Actualizar' : 'Guardar'}</button>
            <a href="#/recursos" class="btn btn-secondary">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  `;

  const form = container.querySelector('#resource-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Limpiar errores previos
    form.querySelectorAll('.is-error').forEach((el) => {
      el.classList.remove('is-error');
      el.removeAttribute('aria-invalid');
    });
    form.querySelectorAll('.form-error').forEach((el) => el.remove());

    // Leer datos con FormData y Object.fromEntries
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Convertir favorito a booleano
    data.favorito = Boolean(data.favorito);

    // Validar campos
    const errors = {};

    const titulo = (data.titulo || '').trim();
    if (!titulo || titulo.length < 3) {
      errors.titulo = 'El título es obligatorio y debe tener al menos 3 caracteres.';
    }

    const url = (data.url || '').trim();
    let isValidUrl = false;
    if (url) {
      try {
        new URL(url);
        isValidUrl = true;
      } catch {
        isValidUrl = false;
      }
    }
    if (!isValidUrl) {
      errors.url = 'Introduce una URL válida.';
    }

    if (!data.tipo) {
      errors.tipo = 'El tipo es obligatorio.';
    }

    if (!data.tema) {
      errors.tema = 'El tema es obligatorio.';
    }

    // Mostrar errores si existen
    if (Object.keys(errors).length > 0) {
      for (const [fieldName, message] of Object.entries(errors)) {
        const field = form.elements[fieldName];
        if (field) {
          field.classList.add('is-error');
          field.setAttribute('aria-invalid', 'true');
          const errorEl = document.createElement('p');
          errorEl.className = 'form-error';
          errorEl.textContent = message;
          field.insertAdjacentElement('afterend', errorEl);
        }
      }
      return;
    }

    const payload = {
      titulo,
      url,
      tipo: data.tipo,
      tema: data.tema,
      nivel: data.nivel || 'basico',
      favorito: data.favorito,
    };

    if (isEdit) {
      update(recurso.id, payload);
      showToast('Recurso actualizado');
    } else {
      create(payload);
      showToast('Recurso guardado');
      form.reset();
    }

    window.location.hash = '#/recursos';
  });
}
