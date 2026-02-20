// ==================== MEMECRAFT AI — SHARED API CONFIG ====================
// ==================== MEMECRAFT AI — SHARED API CONFIG ====================
const MEMECRAFT_CONFIG = (() => {
    const isLocal = window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1';

    // Replace this with your actual Render service URL
    const RENDER_URL = 'https://memecraft-backend.onrender.com';

    const BASE = isLocal ? 'http://127.0.0.1:8000' : RENDER_URL;

    return {
        generateURL: `${BASE}/api/generate/`,
        isLocal,
        BASE
    };
})();

// ==================== INDEXED DB SHARED SETUP ====================
const MemecraftDB = (() => {
    const DB_NAME = 'MemeCraftDB';
    const STORE_NAME = 'generatedImages';
    let db = null;

    function open() {
        return new Promise((resolve, reject) => {
            if (db) return resolve(db);
            const request = indexedDB.open(DB_NAME, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => { db = request.result; resolve(db); };
            request.onupgradeneeded = (ev) => {
                const d = ev.target.result;
                if (!d.objectStoreNames.contains(STORE_NAME)) {
                    const store = d.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                    store.createIndex('timestamp', 'timestamp');
                    store.createIndex('mode', 'mode');
                }
            };
        });
    }

    async function save(imageBase64, mode, prompt) {
        try {
            const d = await open();
            const tx = d.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            return new Promise((resolve, reject) => {
                const req = store.add({ imageBase64, mode, prompt, timestamp: Date.now() });
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            });
        } catch (e) { console.warn('DB save failed', e); }
    }

    async function getAll() {
        try {
            const d = await open();
            const tx = d.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            return new Promise((resolve, reject) => {
                const req = store.getAll();
                req.onsuccess = () => resolve(req.result.reverse()); // newest first
                req.onerror = () => reject(req.error);
            });
        } catch (e) { console.warn('DB getAll failed', e); return []; }
    }

    async function remove(id) {
        try {
            const d = await open();
            const tx = d.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            return new Promise((resolve, reject) => {
                const req = store.delete(id);
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            });
        } catch (e) { console.warn('DB delete failed', e); }
    }

    async function clear() {
        try {
            const d = await open();
            const tx = d.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).clear();
        } catch (e) { console.warn('DB clear failed', e); }
    }

    return { save, getAll, remove, clear };
})();