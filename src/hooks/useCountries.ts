import { useAppState } from "../contexts/AppStateContext";
import { useServices } from "../contexts/ServicesContext";
import { useCallback, useEffect } from "react";

export const useCountries = () => {
  const { listsService } = useServices();
  const { state, dispatch } = useAppState();

  const loadCountries = useCallback(async () => {
    // Если уже есть данные, не загружаем
    if (state.countries) return state.countries;

    // Если уже идет загрузка, не дублируем
    if (state.isLoading) return;

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const result = await listsService.getCountries();

      if (result.ok) {
        dispatch({ type: "SET_COUNTRIES", payload: result.value });
        return result.value;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load countries";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.countries, state.isLoading, listsService, dispatch]);

  // Автоматическая загрузка при первом использовании
  useEffect(() => {
    if (!state.countries && !state.isLoading && !state.error) {
      loadCountries();
    }
  }, [state.countries, state.isLoading, state.error, loadCountries]);

  return {
    countries: state.countries,
    isLoading: state.isLoading,
    error: state.error,
    reload: loadCountries, // возможность ручной перезагрузки
  };
};
