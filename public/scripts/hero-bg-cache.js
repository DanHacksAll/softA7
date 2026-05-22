const DB_NAME = 'softa7-hero-bg-db';
const DB_VERSION = 1;
const STORE_NAME = 'images';
const IMAGE_KEY = 'hero-bg-v1';
const IMAGE_URLS = ['/images/hero/hero-bg.webp', '/images/hero/hero-bg.jpg'];

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      return reject(new Error('IndexedDB no está disponible'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getCachedBlob() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(IMAGE_KEY);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function storeBlob(blob) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(blob, IMAGE_KEY);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function fetchImage(url) {
  const response = await fetch(url, { cache: 'force-cache' });
  if (!response.ok) {
    throw new Error(`Fallo al cargar imagen: ${response.status}`);
  }
  return response.blob();
}

function applyBackground(blob, heroBg) {
  const objectUrl = URL.createObjectURL(blob);
  heroBg.style.backgroundImage = `url(${objectUrl})`;
  heroBg.classList.remove('is-loading');
}

async function loadHeroBackground() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  heroBg.classList.add('is-loading');
  let blob = null;

  try {
    blob = await getCachedBlob();
  } catch (error) {
    console.warn('No se pudo leer IndexedDB:', error);
  }

  if (blob) {
    applyBackground(blob, heroBg);
    return;
  }

  for (const url of IMAGE_URLS) {
    try {
      blob = await fetchImage(url);
      applyBackground(blob, heroBg);
      storeBlob(blob).catch((error) => {
        console.warn('No se pudo guardar la imagen en IndexedDB:', error);
      });
      return;
    } catch (error) {
      console.warn(`Intento de carga fallido para ${url}:`, error);
    }
  }

  heroBg.style.backgroundImage = `url(${heroBg.dataset.bgSrc})`;
  heroBg.classList.remove('is-loading');
}

window.addEventListener('DOMContentLoaded', () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadHeroBackground, { timeout: 1000 });
  } else {
    loadHeroBackground();
  }
});
