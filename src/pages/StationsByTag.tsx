import { StationsList } from "../components/StationsList";
import { FilterMode, SearchMode } from "../types/services.types";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useAppState } from "../contexts/AppStateContext";
import { useParams } from "react-router-dom";
import {
  Tag24Regular,
} from "@fluentui/react-icons";

const mode: SearchMode = {
  type: "search",
  params: { tag: "" },
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

export const StationsByTag: React.FC = () => {
  const { state } = useAppState();
  const styles = useStyles();
  const { tag } = useParams<{ tag: string }>();

  // Декодируем tag из URL (так как он может содержать спецсимволы)
  const decodedTag = tag ? decodeURIComponent(tag) : "";
  mode.params.tag = decodedTag;
  mode.params.countryCode = undefined;
  mode.params.name = undefined;
  const filterMode: FilterMode = { type: "tag" };

  return (
    <div
      className={
        state.selectedStation ? styles.containerWithPlayer : styles.container
      }
    >
      <div className={styles.header}>
        <Tag24Regular />
        <h2>Stations By Tag: {decodedTag}</h2>
      </div>
      <StationsList key={decodedTag} mode={mode} filter={filterMode} />
    </div>
  );
};
