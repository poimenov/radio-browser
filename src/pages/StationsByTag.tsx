import { StationsList } from "../components/StationsList";
import { SearchMode } from "../types/services.types";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useAppState } from "../contexts/AppStateContext";
import { useParams } from "react-router-dom";

const mode: SearchMode = {
  type: "search",
  params: { tag: "" },
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

export const StationsByTag: React.FC = () => {
  const { state } = useAppState();
  const styles = useStyles();
  const { tag } = useParams<{ tag: string }>();

  // Декодируем tag из URL (так как он может содержать спецсимволы)
  const decodedTag = tag ? decodeURIComponent(tag) : "";
  mode.params.tag = decodedTag;

  return (
    <div
      className={
        state.selectedStation ? styles.containerWithPlayer : styles.container
      }
    >
      <div className={styles.header}>
        <h2>Stations By Tag: {decodedTag}</h2>
      </div>
      <StationsList key={decodedTag} mode={mode} />
    </div>
  );
};
