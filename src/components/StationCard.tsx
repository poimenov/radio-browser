import React from "react";
import { Station } from "../types/services.types";
import { makeStyles, tokens } from "@fluentui/react-components";
import { Heart16Filled, Heart16Regular } from "@fluentui/react-icons";
import { useAppState } from "../contexts/AppStateContext";
import { StationImage } from "./StationImage";

interface StationCardProps {
  station: Station;
}

export const StationCard: React.FC<StationCardProps> = ({ station }) => {
  const { state, setSelectedStation } = useAppState();
  const styles = useStyles();

  const handleSelectStation = () => {
    setSelectedStation(station);
  };

  const isCurrentStation = state.selectedStation?.id === station.id;

  return (
    <div
      className={`${styles.card} ${isCurrentStation ? styles.cardCurrent : ""}`}
      onClick={handleSelectStation}
    >
      <StationImage
        src={station.favicon}
        alt={station.name}
        className={styles.favicon}
      />
      <div className={styles.info}>
        <h3 className={styles.name} title={station.name}>
          {station.countryCode?.trim() && (
            <img
              className={styles.flagicon}
              title={station.country}
              src={`./images/flags/${station.countryCode.toLowerCase()}.svg`}
              loading="lazy"
              alt={station.country}
            />
          )}
          {station.name}
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
            {station.tags.replace(/,/g, " • ")}
          </div>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  card: {
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
    ":hover": {
      border: `1px solid ${tokens.colorBrandForeground1}`,
    },
  },
  cardCurrent: {
    border: `1px solid ${tokens.colorBrandForeground1}`,
    backgroundColor: `${tokens.colorBrandBackground2Hover}`,
  },
  favicon: {
    width: "64px",
    height: "64px",
    objectFit: "contain",
    borderRadius: tokens.borderRadiusMedium,
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
  details: {
    fontSize: tokens.fontSizeBase200,
    marginTop: "2px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacingHorizontalSNudge,
  },
  tags: {
    fontSize: tokens.fontSizeBase200,
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
});
