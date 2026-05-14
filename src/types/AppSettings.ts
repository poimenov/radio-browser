export type OfficeColor = 
  | 'Default' 
  | 'Windows' 
  | 'Word' 
  | 'Excel' 
  | 'PowerPoint' 
  | 'PowerBI' 
  | 'OneNote';

export interface AppSettings {
  applicationName: string;
  isDarkMode: boolean;
  isCollapsed: boolean;
  accentColor: OfficeColor;
  cultureName: string;
  limitCount: number;
  hideBroken: boolean;
  defaultOrder: string;
  reverseOrder: boolean;
  getTitleDelay: number;
  historyTruncateCount: number;
  trackSearchUrl: string;
  codec: string; // Изменено с string | null на string
  language: string; // Изменено с string | null на string
}

// Значения по умолчанию
export const defaultAppSettings: AppSettings = {
  applicationName: 'RadioBrowser',
  isDarkMode: false,
  isCollapsed: false,
  accentColor: 'Windows',
  cultureName: 'en-US',
  limitCount: 20,
  hideBroken: true,
  defaultOrder: 'votes',
  reverseOrder: true,
  getTitleDelay: 5000,
  historyTruncateCount: 100,
  trackSearchUrl: 'https://www.youtube.com/results?search_query={0}',
  codec: '', // Пустая строка вместо null
  language: '' // Пустая строка вместо null
};