import { CountrySelector } from "../components/CountrySelector";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useAppState } from "../contexts/AppStateContext";

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
        <h2>Select the country</h2>
      </div>
      <CountrySelector />
    </div>
  );
};
