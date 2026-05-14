import { StationsList } from "../components/StationsList";
import { Country, SearchMode } from "../types/services.types";
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

  return (
    <div
      className={
        state.selectedStation ? styles.containerWithPlayer : styles.container
      }
    >
      <div className={styles.header}>
        <Flag24Regular />
        <h2>Stations By Country: {countryName(mode.params.countryCode)}</h2>
      </div>
      <StationsList mode={mode} />
    </div>
  );
};
