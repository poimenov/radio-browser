import { StationsList } from "../components/StationsList";
import { FilterMode, SearchMode } from "../types/services.types";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useAppState } from "../contexts/AppStateContext";
import {
  Home24Regular,
} from "@fluentui/react-icons";

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

export const Home: React.FC = () => {
  const currentCountryCode =
    navigator.language.indexOf("-") !== -1
      ? navigator.language.split("-")[1]
      : navigator.language;

  const { state } = useAppState();
  const styles = useStyles();

  const mode: SearchMode = {
    type: "search",
    params: {
      countryCode: currentCountryCode,
      tag: undefined,
      name: undefined,
    },
  };
  const filterMode: FilterMode = { type: "country" };

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
      <StationsList key={mode.params.countryCode} mode={mode} filter={filterMode} />
    </div>
  );
};
