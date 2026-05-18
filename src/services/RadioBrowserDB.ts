import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { Station } from '../types/services.types';

// Общий интерфейс базы данных
export interface RadioBrowserDB extends DBSchema {
  favorites: {
    key: string;
    value: Station;
    indexes: { 'id': string, 'name': string };
  };
}

// Конфигурация базы данных
const DB_NAME = 'RadioBrowserDB';
const DB_VERSION = 1;
const FAVORITES_STORE_NAME = 'favorites';

// Класс для управления базой данных
class Database {
  private dbPromise: Promise<IDBPDatabase<RadioBrowserDB>>;

  constructor() {
    this.dbPromise = openDB<RadioBrowserDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Миграции для версий
        if (!db.objectStoreNames.contains(FAVORITES_STORE_NAME)) {
          const favoritesStore = db.createObjectStore(FAVORITES_STORE_NAME, { keyPath: 'id' });
          favoritesStore.createIndex('id', 'id', { unique: true });
          favoritesStore.createIndex('name', 'name', { unique: false });
        }      
      }
    });
  }

  async getDb() {
    return this.dbPromise;
  }
}

export default new Database();