import React, { useState, useEffect, useCallback, useRef } from "react";
import { makeStyles, tokens, SearchBox, SearchBoxChangeEvent, InputOnChangeData } from "@fluentui/react-components";
import { useServices } from "../contexts/ServicesContext";
import {
  Station,
  GetStationParameters,
  SearchMode,
  FilterMode,
} from "../types/services.types";
import { StationCard } from "./StationCard";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { CountryFilter } from "./CountryFilter";
import { TagFilter } from "./TagFilter";

interface StationListProps {
  mode: SearchMode;
  filter?: FilterMode;
}

const useStyles = makeStyles({
  container: {
    height: "calc(100% - 34px)",
    overflowY: "auto",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
  },
  filters: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: tokens.spacingVerticalM,
    justifyContent: "center",
    marginBottom: tokens.spacingVerticalM,
  },
  list: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gridAutoRows: "74px",
    gap: tokens.spacingVerticalM,
    justifyContent: "center",
  },
  loadMoreTrigger: {
    textAlign: "center",
    padding: tokens.spacingVerticalXXL,
  },
  loadingMore: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacingHorizontalS,
    color: tokens.colorNeutralForeground2,
  },
  loadingMoreSpinner: {
    width: "20px",
    height: "20px",
    border: `2px solid ${tokens.colorNeutralStroke2}`,
    borderTop: `2px solid ${tokens.colorBrandForeground1}`,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  endMessage: {
    textAlign: "center",
    color: tokens.colorNeutralForeground3,
    padding: tokens.spacingVerticalXXL,
    fontSize: tokens.fontSizeBase300,
  },
  error: {
    textAlign: "center",
    padding: tokens.spacingVerticalXXL,
    color: tokens.colorPaletteRedForeground1,
  },
  retryButton: {
    padding: `${tokens.spacingVerticalSNudge} ${tokens.spacingHorizontalM}`,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    border: "none",
    borderRadius: tokens.borderRadiusMedium,
    cursor: "pointer",
    marginTop: tokens.spacingVerticalM,
    fontSize: tokens.fontSizeBase300,
    ":hover": {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
  },
  // Скелетон карточки
  skeletonCard: {
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusLarge,
    padding: "4px",
    backgroundColor: "transparent",
    transition: "box-shadow 0.2s, border-color 0.2s",
    cursor: "pointer",
    display: "flex",
    gap: "4px",
    width: "100%",
    height: "74px",
  },
  skeletonImage: {
    width: "64px",
    height: "64px",
    objectFit: "contain",
    borderRadius: tokens.borderRadiusMedium,
  },
  skeletonInfo: {
    flex: 1,
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  skeletonTitle: {
    height: "20px",
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    width: "70%",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  skeletonFavorite: {
    height: "16px",
    width: "16px",
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    animation: "pulse 1.5s ease-in-out infinite",
  },
  skeletonDetails: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacingHorizontalSNudge,
  },
  skeletonBitrate: {
    height: "14px",
    width: "60px",
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    animation: "pulse 1.5s ease-in-out infinite",
  },
  skeletonTags: {
    height: "14px",
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    width: "50%",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  skeletonButtons: {
    display: "flex",
    gap: tokens.spacingHorizontalSNudge,
    alignItems: "center",
    marginTop: tokens.spacingVerticalSNudge,
  },
  skeletonButton: {
    width: "32px",
    height: "32px",
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
    animation: "pulse 1.5s ease-in-out infinite",
  },
});

export const StationsList: React.FC<StationListProps> = ({ mode, filter }) => {
  const { stationsService } = useServices();
  const styles = useStyles();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [currentMode, setCurrentMode] = useState<SearchMode>(mode);
  const pageSize = 40; // Количество станций за одну загрузку
  const abortControllerRef = useRef<AbortController | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  async function fetchStations(mode: SearchMode, params: GetStationParameters) {
    switch (mode.type) {
      case "byClicks":
        return await stationsService.getStationsByClicks(params);
      case "byVotes":
        return await stationsService.getStationsByVotes(params);
      case "favorites":
        return await stationsService.getFavoriteStations(mode.name, params);
      case "search":
        return await stationsService.searchStations(mode.params, params);
      default:
        return await stationsService.getStationsByVotes(params);
    }
  }

  // Загрузка первой порции
  const loadInitialStations = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);
    setOffset(0);
    setStations([]);
    setHasMore(true);

    // Отменяем предыдущий запрос, если он был
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const params: GetStationParameters = {
        offset: 0,
        limit: pageSize,
        hidebroken: true,
      };

      const result = await fetchStations(currentMode, params);

      if (result.ok) {
        setStations(result.value);
        setHasMore(result.value.length === pageSize);
        setOffset(pageSize);
      } else {
        setError(result.error);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [stationsService, currentMode, pageSize]);

  const setMode = useCallback(
    (mode: SearchMode) => {
      setCurrentMode(mode);
    },
    []
  );

  // Загрузка следующей порции
  const loadMoreStations = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    try {
      const params: GetStationParameters = {
        offset: offset,
        limit: pageSize,
        hidebroken: true,
      };

      const result = await fetchStations(currentMode, params);

      if (result.ok) {
        if (result.value.length === 0) {
          setHasMore(false);
        } else {
          setStations((prev) => [...prev, ...result.value]);
          setOffset((prev) => prev + pageSize);
          setHasMore(result.value.length === pageSize);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Error loading more stations:", err);
      setError("Failed to load more stations");
    } finally {
      setLoadingMore(false);
    }
  }, [stationsService, currentMode, offset, pageSize, hasMore, loadingMore]);

  // Настройка бесконечной прокрутки
  const { loadMoreRef } = useInfiniteScroll({
    hasMore,
    isLoading: loadingMore,
    onLoadMore: loadMoreStations,
    threshold: 100,
    rootMargin: "0px 0px 200px 0px",
  });

  // Загружаем станции при изменении сортировки
  useEffect(() => {
    loadInitialStations();

    // Очистка при размонтировании
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentMode, loadInitialStations]);

  const handleSearchChange = (
    _ev: SearchBoxChangeEvent,
    data: InputOnChangeData,
  ) => {
    setSearchTerm(data.value);
  }

  const handleKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      if (mode.type === "search") {
        mode.params.name = searchTerm.trim();
        setMode({ ...mode });
      }
    }
  };

  const renderSkeleton = () => {
    return Array.from({ length: pageSize }).map((_, index) => (
      <div key={`skeleton-${index}`} className={styles.skeletonCard}>
        <div className={styles.skeletonImage} />
        <div className={styles.skeletonInfo}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonDetails}>
            <div className={styles.skeletonFavorite} />
            <div className={styles.skeletonBitrate} />
          </div>
          <div className={styles.skeletonTags} />
        </div>
      </div>
    ));
  };

  if (loading && stations.length === 0) {
    return <div className={styles.container}><div className={styles.list}>{renderSkeleton()}</div></div>;
  }

  if (error && stations.length === 0) {
    return (
      <div className={styles.error}>
        <p>Error: {error}</p>
        <button onClick={loadInitialStations} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {mode.type === "search" && filter && (
        <div className={styles.filters}>
          <SearchBox
            placeholder="Station name..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          {filter.type === "country" && <TagFilter mode={mode} setMode={setMode} />}
          {filter.type === "tag" && <CountryFilter mode={mode} setMode={setMode} />}
        </div>
      )}
      <div className={styles.list}>
        {stations.map((station, index) => (
          <StationCard key={`${station.id}-${index}`} station={station} />
        ))}
        {/* Элемент-наблюдатель для бесконечной прокрутки */}
        <div ref={loadMoreRef} className={styles.loadMoreTrigger}>
          {loadingMore && (
            <div className={styles.loadingMore}>
              <div className={styles.loadingMoreSpinner} />
              <span>Loading more stations...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);
