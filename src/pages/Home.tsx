import { StationsList } from "../components/StationsList";
import { SearchMode } from "../types/services.types";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useAppState } from "../contexts/AppStateContext";
import {
  Home24Regular,
} from "@fluentui/react-icons";

const useStyles = makeStyles({
  container: {
    height: "calc(100% - 20px)",
  },
  containerWithPlayer: {
    height: "calc(100% - 90px)",
    marginBottom: "16px",
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

export const Home: React.FC = () => {
  const currentCountryCode =
    navigator.language.indexOf("-") !== -1
      ? navigator.language.split("-")[1]
      : navigator.language;
  const mode: SearchMode = {
    type: "search",
    params: { countryCode: currentCountryCode },
  };
  const { state } = useAppState();
  const styles = useStyles();
  mode.params.countryCode = currentCountryCode;

  return (
    <div
      className={
        state.selectedStation ? styles.containerWithPlayer : styles.container
      }
    >
      <div className={styles.header}>
        <Home24Regular />
        <h2>Home</h2>
      </div>
      <StationsList mode={mode} />
    </div>
  );
};
