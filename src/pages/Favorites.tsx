import { StationsList } from "../components/StationsList";
import { SearchMode } from "../types/services.types";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useAppState } from "../contexts/AppStateContext";
import {
  Heart24Regular,
} from "@fluentui/react-icons";

const mode: SearchMode = {
  type: "favorites",
};

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    height: "100%",
  },
  containerWithPlayer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    height: "100%",
  },
  header: {
    height: "50px",
    padding: tokens.spacingHorizontalL,
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
  },
  title: {
    margin: 0,
    fontSize: tokens.fontSizeHero900,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
  },
});

export const Favorites: React.FC = () => {
  const { state } = useAppState();
  const styles = useStyles();
  return (
    <div
      className={
        state.selectedStation ? styles.containerWithPlayer : styles.container
      }
    >
      <div className={styles.header}>
        <Heart24Regular />
        <h2>Favorites</h2>
      </div>
      <StationsList mode={mode} />
    </div>
  );
};
