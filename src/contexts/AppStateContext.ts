import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import { Station, SearchMode, Country } from "../types/services.types";

// Типы состояния
interface AppState {
  selectedStation: Station | null;
  selectedStationIsFavorite: boolean;
  stations: Station[];
  isLoading: boolean;
  error: string | null;
  isPlaying: boolean;
  volume: number;
  currentMode: SearchMode | null;
  countries: Country[] | null;
}

// Действия
type AppAction =
  | { type: "SET_SELECTED_STATION"; payload: Station | null }
  | { type: "SET_STATIONS"; payload: Station[] }
  | { type: "SET_SELECTED_STATION_IS_FAVORITE"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_PLAYING"; payload: boolean }
  | { type: "SET_VOLUME"; payload: number }
  | { type: "SET_SEARCH_MODE"; payload: SearchMode | null }
  | { type: "SET_COUNTRIES"; payload: Country[] | null };

// Ключ для localStorage
const VOLUME_STORAGE_KEY = "playerVolume";

// Функция для получения начальной громкости из localStorage
const getInitialVolume = (): number => {
  const savedVolume = localStorage.getItem(VOLUME_STORAGE_KEY);
  if (savedVolume !== null) {
    const parsed = parseFloat(savedVolume);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
      return parsed;
    }
  }
  return 0.7; // Значение по умолчанию
};

const initialState: AppState = {
  selectedStation: null,
  selectedStationIsFavorite: false,
  stations: [],
  isLoading: false,
  error: null,
  isPlaying: false,
  volume: getInitialVolume(),
  currentMode: null,
  countries: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_SELECTED_STATION":
      return { ...state, selectedStation: action.payload, isPlaying: false };
    case "SET_SELECTED_STATION_IS_FAVORITE":
      return { ...state, selectedStationIsFavorite: action.payload };
    case "SET_STATIONS":
      return { ...state, stations: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_PLAYING":
      return { ...state, isPlaying: action.payload };
    case "SET_VOLUME":
      return { ...state, volume: action.payload };
    case "SET_SEARCH_MODE":
      return { ...state, currentMode: action.payload };
    case "SET_COUNTRIES":
      return { ...state, countries: action.payload, error: null };
    default:
      return state;
  }
};

interface AppStateContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Удобные методы-хелперы
  setSelectedStation: (station: Station | null) => void;
  setSelectedStationIsFavorite: (isFavorite: boolean) => void;
  setStations: (stations: Station[]) => void;
  setSearchMode: (mode: SearchMode | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  togglePlayback: () => void;
  setVolume: (volume: number) => void;
  setCountries: (countries: Country[] | null) => void;
  // Регистрация audio элемента из JSX
  registerAudioElement: (element: HTMLAudioElement | null) => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onErrorRef = useRef<((error: Error) => void) | null>(null);

  // Регистрация audio элемента из JSX
  const registerAudioElement = (element: HTMLAudioElement | null) => {
    audioRef.current = element;
  };

  // Применение громкости к audio элементу при её изменении
  useEffect(() => {
    localStorage.setItem(VOLUME_STORAGE_KEY, state.volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  // Управление воспроизведением
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlayback = async () => {
      if (state.isPlaying && state.selectedStation?.urlResolved) {
        // Если нужно сменить источник
        if (audio.src !== state.selectedStation.urlResolved) {
          audio.src = state.selectedStation.urlResolved;
          try {
            await audio.play();
          } catch (error) {
            console.error("Playback failed:", error);
            if (onErrorRef.current) {
              onErrorRef.current(error as Error);
            }
            dispatch({ type: "SET_PLAYING", payload: false });
          }
        } else {
          // Продолжить воспроизведение
          try {
            await audio.play();
          } catch (error) {
            console.error("Playback failed:", error);
            if (onErrorRef.current) {
              onErrorRef.current(error as Error);
            }
            dispatch({ type: "SET_PLAYING", payload: false });
          }
        }
      } else if (!state.isPlaying && audio) {
        audio.pause();
      }
    };

    handlePlayback();
  }, [state.isPlaying, state.selectedStation]);

  // Настройка обработчиков событий audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      dispatch({ type: "SET_PLAYING", payload: false });
    };

    const handleError = () => {
      if (audio.error && onErrorRef.current) {
        const error = new Error(
          audio.error.message || "Ошибка воспроизведения",
        );
        onErrorRef.current(error);
      }
      dispatch({ type: "SET_PLAYING", payload: false });
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [audioRef.current]); // Зависимость от ref

  const setSelectedStation = (station: Station | null) => {
    dispatch({ type: "SET_SELECTED_STATION", payload: station });
  };

  const setSelectedStationIsFavorite = (isFavorite: boolean) => {
    dispatch({ type: "SET_SELECTED_STATION_IS_FAVORITE", payload: isFavorite });
  };

  const setStations = (stations: Station[]) => {
    dispatch({ type: "SET_STATIONS", payload: stations });
  };

  const setSearchMode = (mode: SearchMode | null) => {
    dispatch({ type: "SET_SEARCH_MODE", payload: mode });
  };

  const setLoading = (isLoading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: isLoading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  };

  const togglePlayback = () => {
    if (!state.selectedStation) return;
    dispatch({ type: "SET_PLAYING", payload: !state.isPlaying });
  };

  const setVolume = (volume: number) => {
    const clampedVolume = Math.min(1, Math.max(0, volume));
    dispatch({ type: "SET_VOLUME", payload: clampedVolume });
  };

  const setCountries = (countries: Country[] | null) => {
    dispatch({ type: "SET_COUNTRIES", payload: countries });
  };

  const setErrorHandler = (handler: (error: Error) => void) => {
    onErrorRef.current = handler;
  };

  return React.createElement(
    AppStateContext.Provider,
    {
      value: {
        state,
        dispatch,
        setSelectedStation,
        setSelectedStationIsFavorite,
        setStations,
        setSearchMode,
        setLoading,
        setError,
        togglePlayback,
        setVolume,
        setCountries,
        registerAudioElement,
      },
    },
    children,
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
};
