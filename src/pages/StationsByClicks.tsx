import { StationsList } from "../components/StationsList";
import { SearchMode } from "../types/services.types";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useAppState } from "../contexts/AppStateContext";

const mode: SearchMode = {
  type: "byClicks",
};

const useStyles = makeStyles({
  container: {
    height: "calc(100% - 20px)",
  },
  containerWithPlayer: {
    height: "calc(100% - 94px)",
  },
  header: {
    height: "30px",
    paddingBottom: "10px",
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
  },
  title: {
    margin: 0,
    fontSize: tokens.fontSizeHero900,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
  },
});

export const StationsByClicks: React.FC = () => {
  const { state } = useAppState();
  const styles = useStyles();
  return (
    <div
      className={
        state.selectedStation ? styles.containerWithPlayer : styles.container
      }
    >
      <div className={styles.header}>
        <h2>Top Clicked Stations</h2>
      </div>
      <StationsList mode={mode} />
    </div>
  );
};
