import React, { useCallback, useState } from "react";
import { Station } from "../types/services.types";
import { Link } from "react-router-dom";
import {
  makeStyles,
  tokens,
  Button,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Slider,
} from "@fluentui/react-components";
import {
  Heart16Filled,
  Heart16Regular,
  Play48Regular,
  Square48Regular,
  Heart48Regular,
  Heart48Filled,
  Speaker248Regular,
} from "@fluentui/react-icons";
import { useAppState } from "../contexts/AppStateContext";
import { useServices } from "../contexts/ServicesContext";
import { StationImage } from "./StationImage";

interface PlayerProps {
  station: Station;
}

export const Player: React.FC<PlayerProps> = ({ station }) => {
  const { state, togglePlayback, setSelectedStationIsFavorite, setVolume } =
    useAppState();
  const { stationsService } = useServices();
  const styles = useStyles();

  const [isVolumePopoverOpen, setIsVolumePopoverOpen] = useState(false);

  const getPlaybackIcon = () => {
    return state.isPlaying ? <Square48Regular /> : <Play48Regular />;
  };

  const getFavoriteIcon = () => {
    return station.isFavorite ? <Heart48Filled /> : <Heart48Regular />;
  };

  const handleFavoriteToggle = useCallback(
    async (updatedStation: Station) => {
      try {
        if (updatedStation.isFavorite) {
          await stationsService
            .getFavoritesDataAccess()
            .remove(updatedStation.id);
          updatedStation.isFavorite = false;
          setSelectedStationIsFavorite(false);
        } else {
          await stationsService.getFavoritesDataAccess().add(updatedStation);
          updatedStation.isFavorite = true;
          setSelectedStationIsFavorite(true);
        }
      } catch (err) {
        console.error("Error toggling favorite:", err);
      }
    },
    [stationsService, setSelectedStationIsFavorite],
  );

  const handleVolumeChange = useCallback(
    (_event: any, data: { value: number }) => {
      setVolume(data.value);
    },
    [setVolume],
  );

  return (
    <div className={styles.card}>
      <StationImage
        src={station.favicon}
        alt={station.name}
        className={styles.favicon}
      />
      <div className={styles.info}>
        <h3 className={styles.name} title={station.name}>
          {station.countryCode?.trim() && (
            <Link to={`/stationsByCountry/${station.countryCode}`} className={styles.flagicon} title={station.country}>
              <img
                className={styles.flagicon}
                title={station.country}
                src={`/images/flags/${station.countryCode.toLowerCase()}.svg`}
                loading="lazy"
                alt={station.country}
              />
            </Link>
          )}
          <a target="_blank" href={station.homepage} rel="noopener noreferrer" className={styles.homepage}>
            {station.name}
          </a>
        </h3>
        <div className={styles.details}>
          {station.isFavorite ? <Heart16Filled /> : <Heart16Regular />}
          {station.bitrate > 0 && <span>{station.bitrate} kbps</span>}
        </div>
        {station.tags && (
          <div
            className={styles.tags}
            title={station.tags.replace(/,/g, " • ")}
          >
            {station.tags.split(/,/g).map((tag, index) => (
              <span key={tag.trim()}>
                {index > 0 && <span className={styles.separator}> • </span>}
                <Link to={`/stationsByTag/${tag.trim()}`} className={styles.homepage}>
                  {tag.trim()}
                </Link>
              </span>
            ))}
          </div>
        )}
      </div>
      <div className={styles.buttons}>
        <Button
          className={styles.button}
          color="primary"
          onClick={() => handleFavoriteToggle(station)}
          icon={getFavoriteIcon()}
        />

        <Popover
          open={isVolumePopoverOpen}
          onOpenChange={(_, data) => setIsVolumePopoverOpen(data.open)}
          positioning="above"
          withArrow={false}
        >
          <PopoverTrigger disableButtonEnhancement>
            <Button
              className={styles.button}
              color="primary"
              icon={<Speaker248Regular />}
            />
          </PopoverTrigger>

          <PopoverSurface className={styles.volumePopoverSurface}>
            <div className={styles.volumeSliderContainer}>
              <Slider
                className={styles.volumeSlider}
                vertical
                min={0}
                max={1}
                step={0.01}
                value={state.volume}
                onChange={handleVolumeChange}
                aria-label="Volume control"
              />
            </div>
          </PopoverSurface>
        </Popover>

        <Button
          className={styles.button}
          color="primary"
          onClick={togglePlayback}
          icon={getPlaybackIcon()}
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  card: {
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: "4px",
    backgroundColor: tokens.colorNeutralBackground1,
    transition: "box-shadow 0.2s, border-color 0.2s",
    display: "flex",
    gap: "4px",
    width: "100%",
    alignItems: "flex-start",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      alignItems: "stretch",
      padding: "8px",
    },
  },
  favicon: {
    width: "64px",
    height: "64px",
    objectFit: "contain",
    borderRadius: tokens.borderRadiusMedium,
    "@media (max-width: 768px)": {
      width: "100%",
      height: "auto",
    },
  },
  flagicon: {
    width: "20px",
    aspectRatio: "4/3",
    marginRight: "4px",
    borderRadius: tokens.borderRadiusSmall,
  },
  info: {
    flex: 1,
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  name: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightBold,
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  homepage: {
    color: tokens.colorNeutralForeground1,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  details: {
    fontSize: tokens.fontSizeBase200,
    marginTop: "2px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "4px",
  },
  tags: {
    fontSize: tokens.fontSizeBase200,
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  buttons: {
    display: "flex",
    gap: "4px",
    paddingRight: "8px",
    alignItems: "center",
    "@media (max-width: 768px)": {
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingRight: "0",
    },
  },
  button: {
    maxWidth: "60px",
    maxHeight: "60px",
    width: "60px",
    height: "60px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& span": {
      width: "48px",
      height: "48px",
    },
    "& svg": {
      color: tokens.colorNeutralForeground2,
      transition: "color 0.2s ease",
    },
    "&:hover svg": {
      color: tokens.colorBrandForeground1,
    },
  },
  volumePopoverSurface: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "12px 8px",
    width: "60px",
    height: "200px",
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow16,
  },
  volumeSliderContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  volumeSlider: {
    height: "100%",
    width: "20px",
  },
  separator: {
    color: tokens.colorNeutralForeground3,
  },
});
