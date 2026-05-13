import { useAppState } from "../contexts/AppStateContext";
import { useServices } from "../contexts/ServicesContext";
import { useCallback, useEffect, useState, useRef } from "react";

export const useTags = () => {
  const { listsService } = useServices();
  const { state, dispatch } = useAppState();

  // Локальное состояние для загрузки и ошибок этого хука
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false); // Для предотвращения дублирования запросов

  const loadTags = useCallback(async () => {
    // Если уже есть данные в глобальном состоянии
    if (state.tags) return state.tags;

    // Предотвращаем параллельные запросы
    if (loadingRef.current) return;

    loadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const result = await listsService.getTags(); // Исправлено: было getCountries()

      if (result.ok) {
        dispatch({ type: "SET_TAGS", payload: result.value });
        return result.value;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load tags";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [state.tags, listsService, dispatch]);

  // Автоматическая загрузка при первом использовании
  useEffect(() => {
    if (!state.tags && !loadingRef.current) {
      loadTags();
    }
  }, [state.tags, loadTags]);

  return {
    tags: state.tags,
    isLoading, // локальное состояние
    error, // локальная ошибка
    reload: loadTags,
  };
};
