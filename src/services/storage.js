import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'devshelf:recursos';

// Obtiene todos los recursos almacenados o un arreglo vacío si hay error o no existen
export function getAll() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Devuelve el recurso con ese id usando find, o null si no existe
export function getById(id) {
  const resources = getAll();
  const resource = resources.find((item) => item.id === id);
  return resource || null;
}

// Crea y persiste un nuevo recurso asignándole id y fecha de creación
export function create(data) {
  const resources = getAll();
  const newResource = {
    ...data,
    id: uuidv4(),
    fechaCreacion: new Date().toISOString(),
  };
  resources.push(newResource);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
  return newResource;
}

// Actualiza un recurso existente conservando id y fechaCreacion, o devuelve null si no existe
export function update(id, data) {
  const resources = getAll();
  const index = resources.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const currentResource = resources[index];
  const updatedResource = {
    ...currentResource,
    ...data,
    id: currentResource.id,
    fechaCreacion: currentResource.fechaCreacion,
  };

  resources[index] = updatedResource;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
  return updatedResource;
}

// Elimina un recurso por id; devuelve true si se eliminó o false si no existía
export function remove(id) {
  const resources = getAll();
  const filteredResources = resources.filter((item) => item.id !== id);
  const removed = filteredResources.length < resources.length;
  if (removed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredResources));
  }
  return removed;
}

// Calcula estadísticas: total de recursos, total de favoritos y cantidad de temas únicos
export function getStats() {
  const resources = getAll();
  const total = resources.length;
  const favoritos = resources.filter((item) => item.favorito).length;
  const temas = new Set(resources.map((item) => item.tema).filter(Boolean)).size;

  return { total, favoritos, temas };
}
