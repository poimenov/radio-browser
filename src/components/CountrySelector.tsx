import React, { useState } from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useCountries } from "../hooks/useCountries";
import { Link } from "react-router-dom";
import {
  SearchBox,
  SearchBoxChangeEvent,
  InputOnChangeData,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingVerticalS,
    height: "calc(100% - 30px)",
    overflowY: "auto",
  },
  list: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gridAutoRows: "minmax(120px, auto)",
    gridGap: tokens.spacingHorizontalS,
    justifyContent: "center",
    width: "100%",
  },
  item: {
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow4,
    padding: tokens.spacingHorizontalS,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    textDecoration: "none",
    ":hover": {
      border: `1px solid ${tokens.colorBrandForeground1}`,
    },
  },
  name: {
    height: "44px",
    display: "flex",
    justifyContent: "center",
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground1,
    textAlign: "center",
    overflow: "hidden",
  },
  flag: {
    borderRadius: tokens.borderRadiusMedium,
    width: "100%",
  },
  search: {
    width: "160px",
    margin: `${tokens.spacingHorizontalS} 0`,
  },
});

export const CountrySelector: React.FC = () => {
  const { countries, isLoading, error, reload } = useCountries();
  const [searchTerm, setSearchTerm] = useState("");
  const styles = useStyles();

  // Вычисляем отфильтрованные страны
  const filteredCountries = React.useMemo(() => {
    if (!countries) return [];
    if (!searchTerm.trim()) return countries;

    return countries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [countries, searchTerm]);

  const handleSearchChange = (
    ev: SearchBoxChangeEvent,
    data: InputOnChangeData,
  ) => {
    setSearchTerm(data.value);
  };

  if (isLoading && !countries) return <div>Loading countries...</div>;
  if (error)
    return (
      <div>
        Error: {error} <button onClick={reload}>Retry</button>
      </div>
    );
  if (!countries) return null;

  return (
    <div className={styles.container}>
      <SearchBox
        className={styles.search}
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <div className={styles.list}>
        {filteredCountries.map((country) => (
          <Link
            className={styles.item}
            key={country.iso_3166_1}
            to={`/stationsByCountry/${country.iso_3166_1}`}
          >
            <div className={styles.name}>
              {country.name} ({country.stationcount})
            </div>
            <img
              className={styles.flag}
              src={`./images/flags/${country.iso_3166_1.toLowerCase()}.svg`}
              alt={country.name}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
