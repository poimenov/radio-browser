import React from "react";

interface StationImageProps {
  src: string | undefined;
  alt: string;
  className?: string;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const StationImage: React.FC<StationImageProps> = ({
  src,
  alt,
  className,
  onLoad,
}) => {
  const defaultImageSrc = "/images/radio.svg";
  const [imgSrc, setImgSrc] = React.useState(defaultImageSrc);
  const [loadFailed, setLoadFailed] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (src?.trim() && !loadFailed) {
      setImgSrc(src);
    } else {
      setImgSrc(defaultImageSrc);
    }
    setLoadFailed(false);
  }, [src, defaultImageSrc]);

  const validateImage = React.useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.naturalWidth <= 1 && img.naturalHeight <= 1) {
      if (!loadFailed && imgSrc !== defaultImageSrc) {
        setLoadFailed(true);
        setImgSrc(defaultImageSrc);
      }
    } else {
      // Картинка успешно загрузилась
      onLoad?.({
        currentTarget: img,
        target: img,
        type: "load",
        nativeEvent: new Event("load"),
        bubbles: false,
        cancelable: false,
        defaultPrevented: false,
        eventPhase: 2,
        isTrusted: true,
        preventDefault: () => {},
        isDefaultPrevented: () => false,
        stopPropagation: () => {},
        isPropagationStopped: () => false,
        persist: () => {},
        timeStamp: Date.now(),
      });
    }
  }, [imgSrc, defaultImageSrc, onLoad]);

  const handleError = () => {
    if (!loadFailed && imgSrc !== defaultImageSrc) {
      setLoadFailed(true);
      setImgSrc(defaultImageSrc);
    }
  };

  return (
    <img
      ref={imgRef}
      src={imgSrc}
      className={className}
      loading="lazy"
      onError={handleError}
      onLoad={validateImage}
      alt={alt}
    />
  );
};
