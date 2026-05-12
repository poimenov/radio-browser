import { 
  Country, 
  Language, 
  NameAndCount,
  Result 
} from '../types/services.types';
import { HttpHandler } from './HttpHandler';

export class ListsService {
  private handler: HttpHandler;

  constructor(handler: HttpHandler) {
    this.handler = handler;
  }

  private async getNameAndCounts(listName: string): Promise<Result<NameAndCount[], string>> {
    const result = await this.handler.getJsonStringAsync(listName, []);
    
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    
    try {
      const parsed = JSON.parse(result.value) as NameAndCount[];
      return { ok: true, value: parsed };
    } catch (error) {
      return { 
        ok: false, 
        error: error instanceof Error ? error.message : 'Parse error' 
      };
    }
  }

  async getCountries(): Promise<Result<Country[], string>> {
    const result = await this.handler.getJsonStringAsync('countries', []);
    
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    
    try {
      const parsed = JSON.parse(result.value) as Country[];
      // Сортируем по убыванию количества станций
      const sorted = parsed.sort((a, b) => b.stationcount - a.stationcount);
      return { ok: true, value: sorted };
    } catch (error) {
      return { 
        ok: false, 
        error: error instanceof Error ? error.message : 'Parse error' 
      };
    }
  }

  async getLanguages(): Promise<Result<Language[], string>> {
    const result = await this.handler.getJsonStringAsync('languages', []);
    
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    
    try {
      const parsed = JSON.parse(result.value) as Language[];
      // Сортируем по убыванию количества станций
      const sorted = parsed.sort((a, b) => b.stationcount - a.stationcount);
      return { ok: true, value: sorted };
    } catch (error) {
      return { 
        ok: false, 
        error: error instanceof Error ? error.message : 'Parse error' 
      };
    }
  }

  async getCountryCodes(): Promise<Result<NameAndCount[], string>> {
    return this.getNameAndCounts('countrycodes');
  }

  async getCodecs(): Promise<Result<NameAndCount[], string>> {
    return this.getNameAndCounts('codecs');
  }

  async getTags(limit: number = 130, hidebroken: boolean = true): Promise<Result<NameAndCount[], string>> {
    const parameters: [string, string][] = [
      ['limit', limit.toString()],
      ['offset', '0'],
      ['order', 'stationcount'],
      ['reverse', 'true'],
      ['hidebroken', hidebroken.toString()]
    ];
    
    const result = await this.handler.getJsonStringAsync('tags', parameters);
    
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    
    try {
      const parsed = JSON.parse(result.value) as NameAndCount[];
      return { ok: true, value: parsed };
    } catch (error) {
      return { 
        ok: false, 
        error: error instanceof Error ? error.message : 'Parse error' 
      };
    }
  }

  async searchCountries(searchTerm: string): Promise<Result<Country[], string>> {
    const countriesResult = await this.getCountries();
    
    if (!countriesResult.ok) {
      return countriesResult;
    }
    
    const filtered = countriesResult.value.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return { ok: true, value: filtered };
  }

  async searchLanguages(searchTerm: string): Promise<Result<Language[], string>> {
    const languagesResult = await this.getLanguages();
    
    if (!languagesResult.ok) {
      return languagesResult;
    }
    
    const filtered = languagesResult.value.filter(language =>
      language.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return { ok: true, value: filtered };
  }

  async searchTags(searchTerm: string, limit: number = 50): Promise<Result<NameAndCount[], string>> {
    const tagsResult = await this.getTags(limit);
    
    if (!tagsResult.ok) {
      return tagsResult;
    }
    
    const filtered = tagsResult.value.filter(tag =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return { ok: true, value: filtered };
  }

  async getTopCountries(limit: number = 10): Promise<Result<Country[], string>> {
    const countriesResult = await this.getCountries();
    
    if (!countriesResult.ok) {
      return countriesResult;
    }
    
    const top = countriesResult.value.slice(0, limit);
    return { ok: true, value: top };
  }

  async getTopLanguages(limit: number = 10): Promise<Result<Language[], string>> {
    const languagesResult = await this.getLanguages();
    
    if (!languagesResult.ok) {
      return languagesResult;
    }
    
    const top = languagesResult.value.slice(0, limit);
    return { ok: true, value: top };
  }

  async getTopTags(limit: number = 20, hidebroken: boolean = true): Promise<Result<NameAndCount[], string>> {
    return this.getTags(limit, hidebroken);
  }
}