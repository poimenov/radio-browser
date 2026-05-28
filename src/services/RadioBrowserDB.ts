import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { Station, HistoryRecord } from '../types/services.types';

// Общий интерфейс базы данных
export interface RadioBrowserDB extends DBSchema {
  favorites: {
    key: string;
    value: Station;
    indexes: { 'id': string, 'name': string };
  };
  history: {
    key: string;
    value: HistoryRecord;
    indexes: { 'startTime': Date, 'stationName': string, 'title': string };
  };  
}

// Конфигурация базы данных
const DB_NAME = 'RadioBrowserDB';
const DB_VERSION = 1;
const FAVORITES_STORE_NAME = 'favorites';
const HISTORY_STORE_NAME = 'history';

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
        if (!db.objectStoreNames.contains(HISTORY_STORE_NAME)) {
          const historyStore = db.createObjectStore(HISTORY_STORE_NAME, { keyPath: 'startTime' });
          historyStore.createIndex('startTime', 'startTime', { unique: false });
          historyStore.createIndex('stationName', 'stationName', { unique: false });
          historyStore.createIndex('title', 'title', { unique: false });
        }
      }
    });
  }

  async getDb() {
    return this.dbPromise;
  }
}

export default new Database();