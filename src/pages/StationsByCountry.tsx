import { StationsList } from "../components/StationsList";
import { Country, FilterMode, SearchMode } from "../types/services.types";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useAppState } from "../contexts/AppStateContext";
import { useCountries } from "../hooks/useCountries";
import { useParams } from "react-router-dom";
import {
  Flag24Regular,
} from "@fluentui/react-icons";

const mode: SearchMode = {
  type: "search",
  params: { countryCode: "" },
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
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
  },
});

export const StationsByCountry: React.FC = () => {
  const { state } = useAppState();
  const { countries } = useCountries();
  const styles = useStyles();
  const { code } = useParams<{ code: string }>();
  const countryCode =
    navigator.language.indexOf("-") !== -1
      ? navigator.language.split("-")[1]
      : navigator.language;
  mode.params.countryCode = code ?? countryCode;
  mode.params.tag = undefined;
  mode.params.name = undefined;
  const filteredCountry = (countries: Country[], code: string) => {
    return countries.filter((c) => c.iso_3166_1 === code.toUpperCase())[0]?.name || code;
  };
  const countryName = (code: string): string => {
    try {
      if (state.countries) {
        return filteredCountry(state.countries, code);
      } else if (countries) {
        return filteredCountry(countries, code);
      } else {
        return code;
      }
    } catch {
      return code;
    }
  }
  const filterMode: FilterMode = { type: "country" };

  return (
    <div
      className={
        state.selectedStation ? styles.containerWithPlayer : styles.container
      }
    >
      <div className={styles.header}>
        <Flag24Regular />
        <span>Stations By Country:</span>
        <img style={{ height: "16px" }} src={`./images/flags/${mode.params.countryCode.toLowerCase()}.svg`} alt={countryName(mode.params.countryCode)} />
        <span>{countryName(mode.params.countryCode)}</span>
      </div>
      <StationsList key={mode.params.countryCode} mode={mode} filter={filterMode} />
    </div>
  );
};
