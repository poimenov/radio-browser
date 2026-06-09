import { IDBPDatabase } from 'idb';
import Database from '../services/RadioBrowserDB';
import { RadioBrowserDB } from '../services/RadioBrowserDB';
import { HistoryRecord, Result } from '../types/services.types';
import { AppSettings } from '../types/AppSettings';

const HISTORY_STORE_NAME = 'history';

export class HistoryDataAccess {
  private dbPromise: Promise<IDBPDatabase<RadioBrowserDB>>;
  private settings: AppSettings;

  constructor(settings: AppSettings) {
    this.settings = settings;
    this.dbPromise = Database.getDb();
  }

  private async ensureDb(): Promise<IDBPDatabase<RadioBrowserDB>> {
    return await this.dbPromise;
  }

  private getKeyFromDate(date: Date): string {
    return date.toISOString();
  }

  async add(record: HistoryRecord): Promise<void> {
    try {
      const db = await this.ensureDb();
      const key = this.getKeyFromDate(record.startTime);
      
      // Проверяем, существует ли уже запись с таким временем
      const existing = await db.get(HISTORY_STORE_NAME, key);
      
      if (!existing) {
        await db.add(HISTORY_STORE_NAME, record, key);
        // После добавления проверяем и усекаем историю
        this.truncateHistory().catch(console.error);
      }
    } catch (error) {
      console.error('Error while adding history record', error);
      throw error;
    }
  }

  private async truncateHistory(): Promise<void> {
    try {
      const allRecords = await this.getAllHistoryRecords();
      
      if (allRecords.length > this.settings.historyTruncateCount) {
        // Сортируем по времени (новые сверху)
        const sorted = allRecords.sort((a, b) => 
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
        
        // Оставляем только последние N записей
        const toDelete = sorted.slice(this.settings.historyTruncateCount);
        
        const db = await this.ensureDb();
        const tx = db.transaction(HISTORY_STORE_NAME, 'readwrite');
        
        for (const record of toDelete) {
          const key = this.getKeyFromDate(record.startTime);
          await tx.store.delete(key);
        }
        
        await tx.done;
      }
    } catch (error) {
      console.error('Error truncating history', error);
    }
  }

  private async getAllHistoryRecords(): Promise<HistoryRecord[]> {
    const db = await this.ensureDb();
    const records = await db.getAll(HISTORY_STORE_NAME);
    return records || [];
  }

  async getHistory(): Promise<Result<HistoryRecord[], string>> {
    try {
      const db = await this.ensureDb();
      const tx = db.transaction(HISTORY_STORE_NAME, 'readonly');
      const index = tx.store.index('startTime');
      const records = await index.getAll();
      
      // Сортируем по времени (от новых к старым)
      const sortedRecords = (records || []).sort((a, b) => 
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
      
      return { ok: true, value: sortedRecords };
    } catch (error) {
      console.error('Error while getting history', error);
      return { 
        ok: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async getHistoryByStation(stationName: string): Promise<Result<HistoryRecord[], string>> {
    try {
      const db = await this.ensureDb();
      const tx = db.transaction(HISTORY_STORE_NAME, 'readonly');
      const index = tx.store.index('stationName');
      const records = await index.getAll(stationName);
      
      const sortedRecords = (records || []).sort((a, b) => 
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
      
      return { ok: true, value: sortedRecords };
    } catch (error) {
      return { 
        ok: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async clearHistory(): Promise<void> {
    const db = await this.ensureDb();
    await db.clear(HISTORY_STORE_NAME);
  }

  async getHistoryCount(): Promise<number> {
    const records = await this.getAllHistoryRecords();
    return records.length;
  }
}