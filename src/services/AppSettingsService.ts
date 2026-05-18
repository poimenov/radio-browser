import { AppSettings, defaultAppSettings } from '../types/AppSettings';

class AppSettingsService {
  private static instance: AppSettingsService;
  private settings: AppSettings = defaultAppSettings;
  private initialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): AppSettingsService {
    if (!AppSettingsService.instance) {
      AppSettingsService.instance = new AppSettingsService();
    }
    return AppSettingsService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    if (!this.initPromise) {
      this.initPromise = this.loadSettings();
    }
    
    return this.initPromise;
  }

  private async loadSettings(): Promise<void> {
    try {
      const response = await fetch('appsettings.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const loadedSettings = await response.json();
      
      // Мержим с дефолтными настройками (на случай, если в JSON не все поля)
      this.settings = { ...defaultAppSettings, ...loadedSettings };
      this.initialized = true;
      
      // Загружаем пользовательские настройки из localStorage (они переопределяют системные)
      await this.loadUserSettings();
      
      console.log('AppSettings loaded successfully');
    } catch (error) {
      console.error('Failed to load appsettings.json, using default settings:', error);
      this.settings = { ...defaultAppSettings };
      this.initialized = true;
      
      // Все равно пытаемся загрузить пользовательские настройки
      await this.loadUserSettings();
    }
  }

  getSettings(): AppSettings {
    if (!this.initialized) {
      console.warn('AppSettings not initialized yet, returning default values');
      return { ...defaultAppSettings };
    }
    return { ...this.settings };
  }

  get<K extends keyof AppSettings>(key: K): AppSettings[K] {
    if (!this.initialized) {
      console.warn(`AppSettings not initialized yet, returning default value for ${key}`);
      return defaultAppSettings[key];
    }
    return this.settings[key];
  }

  // Методы для работы с настройками, аналогичные F# версии
  getAppDataPath(): string {
    return `${localStorage.getItem('appDataPath') || this.getDefaultAppDataPath()}`;
  }

  private getDefaultAppDataPath(): string {
    // В браузере используем localStorage вместо файловой системы
    const appName = this.get('applicationName');
    return `${appName}_Data`;
  }

  getDataBasePath(): string {
    return `${this.getAppDataPath()}/${this.get('applicationName')}.db`;
  }

  // Сохранение настроек (опционально, в localStorage)
  async saveSettings(settings: Partial<AppSettings>): Promise<void> {
    // В React приложении мы не можем перезаписать appsettings.json на сервере,
    // но можем сохранить пользовательские настройки в localStorage
    const userSettings = this.getUserSettings();
    const updatedSettings = { ...userSettings, ...settings };
    localStorage.setItem('userAppSettings', JSON.stringify(updatedSettings));
    
    // Обновляем текущие настройки (пользовательские переопределяют системные)
    await this.loadUserSettings();
  }

  private async loadUserSettings(): Promise<void> {
    const userSettingsJson = localStorage.getItem('userAppSettings');
    if (userSettingsJson) {
      try {
        const userSettings = JSON.parse(userSettingsJson);
        this.settings = { ...this.settings, ...userSettings };
      } catch (error) {
        console.error('Failed to parse user settings:', error);
      }
    }
  }

  getUserSettings(): Partial<AppSettings> {
    const userSettingsJson = localStorage.getItem('userAppSettings');
    if (userSettingsJson) {
      try {
        return JSON.parse(userSettingsJson);
      } catch (error) {
        console.error('Failed to parse user settings:', error);
      }
    }
    return {};
  }

  // Сброс пользовательских настроек
  resetToDefault(): void {
    localStorage.removeItem('userAppSettings');
    this.settings = { ...defaultAppSettings };
    // Не нужно загружать заново - мы только что очистили localStorage
  }
}

// Хук для React компонентов
export const useAppSettings = () => {
  const service = AppSettingsService.getInstance();
  return {
    settings: service.getSettings(),
    getSetting: <K extends keyof AppSettings>(key: K) => service.get(key),
    saveSettings: (settings: Partial<AppSettings>) => service.saveSettings(settings),
    resetToDefault: () => service.resetToDefault(),
    getAppDataPath: () => service.getAppDataPath(),
    getDataBasePath: () => service.getDataBasePath()
  };
};

export default AppSettingsService;