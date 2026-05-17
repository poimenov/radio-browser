import { CountrySelector } from "../components/CountrySelector";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useAppState } from "../contexts/AppStateContext";
import {
  Flag24Regular,
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
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    height: "50px",
    padding: tokens.spacingHorizontalL,
  },
});

export const Countries: React.FC = () => {
  const { state } = useAppState();
  const styles = useStyles();
  return (
    <div
      className={
        state.selectedStation ? styles.containerWithPlayer : styles.container
      }
    >
      <div className={styles.header}>
        <Flag24Regular />
        <h2>Select the country</h2>
      </div>
      <CountrySelector />
    </div>
  );
};
