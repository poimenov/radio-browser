import { TagSelector } from "../components/TagSelector";
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

export const Tags: React.FC = () => {
  const { state } = useAppState();
  const styles = useStyles();

  return (
    <div
      className={
        state.selectedStation ? styles.containerWithPlayer : styles.container
      }
    >
      <div className={styles.header}>
        <h2>Select the tag</h2>
      </div>
      <TagSelector />
    </div>
  );
};
