import { IDBPDatabase } from 'idb';
import Database from '../services/RadioBrowserDB';
import { RadioBrowserDB } from '../services/RadioBrowserDB';
import { Station, GetStationParameters, Result } from '../types/services.types';

const STORE_NAME = 'favorites';

export class FavoritesDataAccess {
  private dbPromise: Promise<IDBPDatabase<RadioBrowserDB>>;

  constructor() {
    this.dbPromise = Database.getDb();
  }

  private async ensureDb(): Promise<IDBPDatabase<RadioBrowserDB>> {
    return await this.dbPromise;
  }

  async add(station: Station): Promise<void> {
    const db = await this.ensureDb();
    const updatedStation = { ...station, isFavorite: true };
    await db.add(STORE_NAME, updatedStation);
  }

  async update(stations: Station[]): Promise<void> {
    const db = await this.ensureDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    for (const station of stations) {
      const existing = await store.get(station.id);
      if (existing) {
        const updatedStation = { ...station, isFavorite: true };
        await store.put(updatedStation);
      }
    }
    
    await tx.done;
  }

  async exists(id: string): Promise<boolean> {
    const db = await this.ensureDb();
    const station = await db.get(STORE_NAME, id);
    return !!station;
  }

  async getFavorites(
    name: string | undefined, 
    parameters: GetStationParameters
  ): Promise<Result<Station[], string>> {
    try {
      const db = await this.ensureDb();
      const allFavorites = await this.getAllFavorites(db);
      
      let filtered = allFavorites;
      if (name && name.trim()) {
        const searchName = name.toLowerCase();
        filtered = allFavorites.filter(station => 
          station.name.toLowerCase().includes(searchName)
        );
      }
      
      const paginated = filtered.slice(
        parameters.offset, 
        parameters.offset + parameters.limit
      );
      
      return { ok: true, value: paginated };
    } catch (error) {
      return { 
        ok: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private async getAllFavorites(db: IDBPDatabase<RadioBrowserDB>): Promise<Station[]> {
    const stations = await db.getAll(STORE_NAME);
    return stations || [];
  }

  async remove(id: string): Promise<void> {
    const db = await this.ensureDb();
    await db.delete(STORE_NAME, id);
  }

  async isFavorites(ids: string[]): Promise<Map<string, boolean>> {
    const db = await this.ensureDb();
    const allFavorites = await this.getAllFavorites(db);
    const favoriteSet = new Set(allFavorites.map(f => f.id));
    
    const result = new Map<string, boolean>();
    for (const id of ids) {
      result.set(id, favoriteSet.has(id));
    }
    
    return result;
  }

  async favoritesCount(): Promise<number> {
    const db = await this.ensureDb();
    const allFavorites = await this.getAllFavorites(db);
    return allFavorites.length;
  }
}