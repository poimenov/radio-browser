import React, { useState, useMemo } from "react";
import {
  makeStyles,
  tokens,
  SearchBox,
  SearchBoxChangeEvent,
  InputOnChangeData,
} from "@fluentui/react-components";
import { useTags } from "../hooks/useTags";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingVerticalS,
    height: "calc(100% - 30px)",
    overflowY: "auto",
  },
  searchContainer: {
    marginBottom: "10px",
  },
  searchBox: {
    width: "330px",
  },
  tagsList: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "8px",
    padding: "10px",
  },
  tagItem: {
    textDecoration: "none",
    transition: "transform 0.2s, opacity 0.2s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    padding: "4px 8px",
    "&:hover": {
      transform: "scale(1.05)",
      opacity: 0.9,
    },
  },
  tagText: {
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    letterSpacing: "0.5px",
  },
  emptyState: {
    textAlign: "center",
    color: tokens.colorNeutralForeground3,
    padding: tokens.spacingVerticalXXL,
  },
});

// Функция для генерации случайного цвета (150-255 для светлых тонов)
const getRandomColor = (): [number, number, number] => {
  const r = Math.floor(Math.random() * 105) + 150; // 150-255
  const g = Math.floor(Math.random() * 105) + 150;
  const b = Math.floor(Math.random() * 105) + 150;
  return [r, g, b];
};

// Инвертирует цвет для контрастного текста
const invertColor = ([r, g, b]: [number, number, number]): [
  number,
  number,
  number,
] => {
  return [255 - r, 255 - g, 255 - b];
};

// Преобразует RGB в CSS строку
const colorToRGBString = ([r, g, b]: [number, number, number]): string => {
  return `rgb(${r}, ${g}, ${b})`;
};

// Вычисляет размер шрифта в зависимости от количества станций
const calculateFontSize = (
  minCount: number,
  maxCount: number,
  count: number,
): number => {
  const minSize = 10;
  const maxSize = 64;

  if (minCount === maxCount) return minSize;

  return Math.round(
    minSize +
      ((maxSize - minSize) * (count - minCount)) / (maxCount - minCount),
  );
};

// Специальная сортировка: четные и нечетные индексы разделяются
const arrangeTags = <T,>(tags: T[]): T[] => {
  const ind = tags.map((tag, idx) => ({ idx, tag }));

  const odds = ind
    .filter((_, i) => i % 2 === 1)
    .map((x) => x.tag)
    .reverse();

  const evens = ind.filter((_, i) => i % 2 === 0).map((x) => x.tag);

  return [...odds, ...evens];
};

export const TagSelector: React.FC = () => {
  const { tags, isLoading, error, reload } = useTags();
  const [searchTerm, setSearchTerm] = useState("");
  const styles = useStyles();

  // Мемоизируем случайные цвета для тегов, чтобы они не менялись при ререндерах
  const tagColors = useMemo(() => {
    if (!tags) return new Map();
    const colors = new Map();
    tags.forEach((tag) => {
      colors.set(tag.name, getRandomColor());
    });
    return colors;
  }, [tags]);

  // Фильтрация и сортировка тегов
  const processedTags = useMemo(() => {
    if (!tags) return [];

    let filtered = tags;

    // Фильтрация по поисковому запросу
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = tags.filter((tag) =>
        tag.name.toLowerCase().includes(searchLower),
      );
    }

    // Применяем специальную сортировку как в F# версии
    return arrangeTags(filtered);
  }, [tags, searchTerm]);

  const handleSearchChange = (
    ev: SearchBoxChangeEvent,
    data: InputOnChangeData,
  ) => {
    setSearchTerm(data.value);
  };

  if (isLoading && !tags) {
    return <div className={styles.emptyState}>Loading tags...</div>;
  }

  if (error) {
    return (
      <div className={styles.emptyState}>
        <div style={{ color: "red" }}>Error: {error}</div>
        <button onClick={reload}>Retry</button>
      </div>
    );
  }

  if (!tags || tags.length === 0) {
    return <div className={styles.emptyState}>No tags found</div>;
  }

  // Вычисляем min/max для размеров шрифта
  const counts = processedTags.map((t) => t.stationcount);
  const minCount = Math.min(...counts);
  const maxCount = Math.max(...counts);

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <SearchBox
          className={styles.searchBox}
          placeholder="Search tags..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {processedTags.length === 0 ? (
        <div className={styles.emptyState}>No tags found</div>
      ) : (
        <div className={styles.tagsList}>
          {processedTags.map((tag) => {
            const bgColor = tagColors.get(tag.name) || getRandomColor();
            const textColor = invertColor(bgColor);
            const fontSize = calculateFontSize(
              minCount,
              maxCount,
              tag.stationcount,
            );
            const heightSize = fontSize + 2 * Math.round(fontSize / 5);

            return (
              <Link
                key={tag.name}
                to={`/stationsByTag/${encodeURIComponent(tag.name)}`}
                className={styles.tagItem}
                style={{
                  backgroundColor: colorToRGBString(bgColor),
                  fontSize: `${fontSize}px`,
                }}
                title={`${tag.name.toUpperCase()} (Stations: ${tag.stationcount})`}
              >
                <span
                  className={styles.tagText}
                  style={{
                    color: colorToRGBString(textColor),
                    height: `${heightSize}px`,
                  }}
                >
                  {tag.name.toUpperCase()}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
