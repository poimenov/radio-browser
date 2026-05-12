// hooks/useInfiniteScroll.ts

import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number; // Расстояние до конца страницы для триггера загрузки (в пикселях)
  rootMargin?: string; // Margin вокруг корневого элемента
}

export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 100,
  rootMargin = '0px 0px 200px 0px' // Увеличиваем нижний margin для более ранней загрузки
}: UseInfiniteScrollOptions) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [hasMore, isLoading, onLoadMore]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin,
      threshold: threshold / 100, // Конвертируем проценты
    });

    const currentElement = loadMoreRef.current;
    if (currentElement) {
      observerRef.current.observe(currentElement);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, rootMargin, threshold]);

  return { loadMoreRef };
};