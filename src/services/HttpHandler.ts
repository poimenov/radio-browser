import { ApiUrlProvider } from './ApiUrlProvider';
import { Result } from '../types/services.types';

export class HttpHandler {
  private apiUrlProvider: ApiUrlProvider;
  private maxRetries: number = 3;
  private baseDelay: number = 1000;

  constructor(apiUrlProvider: ApiUrlProvider) {
    this.apiUrlProvider = apiUrlProvider;
  }

  private async buildUri(url: string, parameters: [string, string][]): Promise<URL> {
    const baseUrl = `${await this.apiUrlProvider.getUrl()}/json/${url}`;
    const uri = new URL(baseUrl);
    
    parameters.forEach(([key, value]) => {
      uri.searchParams.append(encodeURIComponent(key), encodeURIComponent(value));
    });
    
    return uri;
  }

  private async fetchWithRetry(
    url: string, 
    parameters: [string, string][], 
    retries: number = this.maxRetries,
    delay: number = this.baseDelay
  ): Promise<Result<string, string>> {
    try {
      const uri = await this.buildUri(url, parameters);
      const response = await fetch(uri.toString(), {
        headers: {
          'User-Agent': 'React-RadioBrowser-App/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const text = await response.text();
      return { ok: true, value: text };
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return await this.fetchWithRetry(url, parameters, retries - 1, delay * 2);
      }
      
      return { 
        ok: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async getJsonStringAsync(
    url: string, 
    parameters: [string, string][] = []
  ): Promise<Result<string, string>> {
    return await this.fetchWithRetry(url, parameters);
  }
}