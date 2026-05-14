import { TagSelector } from "../components/TagSelector";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useAppState } from "../contexts/AppStateContext";
import {
  Tag24Regular,
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
        <Tag24Regular />
        <h2>Select the tag</h2>
      </div>
      <TagSelector />
    </div>
  );
};
