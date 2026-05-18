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
  limitCount: number;
  hideBroken: boolean;
  defaultOrder: string;
  reverseOrder: boolean;
  codec: string; // Изменено с string | null на string
  language: string; // Изменено с string | null на string
}

// Значения по умолчанию
export const defaultAppSettings: AppSettings = {
  applicationName: 'RadioBrowser',
  isDarkMode: false,
  isCollapsed: false,
  accentColor: 'Windows',
  limitCount: 20,
  hideBroken: true,
  defaultOrder: 'votes',
  reverseOrder: true,
  codec: '', // Пустая строка вместо null
  language: '' // Пустая строка вместо null
};