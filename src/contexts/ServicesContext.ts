import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { HttpHandler } from '../services/HttpHandler';
import { ApiUrlProvider } from '../services/ApiUrlProvider';
import { FavoritesDataAccess } from '../services/FavoritesDataAccess';
import { StationsService } from '../services/StationsService';
import { HistoryDataAccess } from '../services/HistoryDataAccess';
import { ListsService } from '../services/ListsService';
import AppSettingsService from '../services/AppSettingsService';
import { AppSettings } from '../types/AppSettings';

interface ServicesContextValue {
  httpHandler: HttpHandler;
  apiUrlProvider: ApiUrlProvider;
  favoritesDataAccess: FavoritesDataAccess;
  stationsService: StationsService;
  historyDataAccess: HistoryDataAccess;
  listsService: ListsService;
  appSettings: AppSettings;
  appSettingsService: AppSettingsService;
}

const ServicesContext = createContext<ServicesContextValue | null>(null);

interface ServicesProviderProps {
  children: ReactNode;
}

export const ServicesProvider: React.FC<ServicesProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [servicesValue, setServicesValue] = useState<ServicesContextValue | null>(null);
  const appSettingsService = AppSettingsService.getInstance();

  useEffect(() => {
    const initialize = async () => {
      try {
        await appSettingsService.initialize();
        const settings = appSettingsService.getSettings();
        
        // Проверяем, что settings загружены корректно
        if (!settings) {
          throw new Error('Failed to load settings');
        }
        
        const apiUrlProvider = new ApiUrlProvider();
        const httpHandler = new HttpHandler(apiUrlProvider);
        const favoritesDataAccess = new FavoritesDataAccess();
        const historyDataAccess = new HistoryDataAccess(settings);
        const stationsService = new StationsService(httpHandler, favoritesDataAccess, settings);
        const listsService = new ListsService(httpHandler);

        setServicesValue({
          httpHandler,
          apiUrlProvider,
          favoritesDataAccess,
          historyDataAccess,
          stationsService,
          listsService,
          appSettings: settings,
          appSettingsService
        });
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize services:', error);
        // Показываем ошибку пользователю
        setServicesValue(null);
        setIsInitialized(true); // Важно: устанавливаем true, чтобы не было бесконечной загрузки
      }
    };

    initialize();
  }, []);

  // Показываем загрузку
  if (!isInitialized) {
    return React.createElement('div', null, 'Loading application...');
  }
  
  // Показываем ошибку, если сервисы не инициализированы
  if (!servicesValue) {
    return React.createElement('div', null, 'Failed to initialize application. Please refresh the page.');
  }

  return React.createElement(
    ServicesContext.Provider,
    { value: servicesValue },
    children
  );
};

export const useServices = (): ServicesContextValue => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within ServicesProvider');
  }
  return context;
};