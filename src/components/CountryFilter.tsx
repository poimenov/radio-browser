import * as React from "react";
import { Combobox, Image, Option, OptionOnSelectData, SelectionEvents, useId } from "@fluentui/react-components";
import { Country, SearchMode } from "../types/services.types";
import { useCountries } from "../hooks/useCountries";

interface CountryFilterProps {
    mode: SearchMode;
    setMode: (mode: SearchMode) => void;
}

export const CountryFilter = ({ mode, setMode }: CountryFilterProps) => {
    const comboId = useId("country-filter");
    const { countries } = useCountries();
    const [matchingOptions, setMatchingOptions] = React.useState<Country[]>([]);
    const [value, setValue] = React.useState("");

    React.useEffect(() => {
        if (countries) {
            setMatchingOptions(countries.slice(0, 10));
            if (mode.type === "search") {
                const selected = countries.find((c) => c.iso_3166_1 === mode.params.countryCode);
                setValue(selected?.name || "");
            }
        }
    }, [countries, mode]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        if (countries && value) {
            setMatchingOptions(
                countries.filter((option) =>
                    option.name.toLowerCase().includes(value.toLowerCase()),
                ).slice(0, 10),
            );
        }
        else if (countries) {
            setMatchingOptions(countries.slice(0, 10));
        }
        else {
            setMatchingOptions([]);
        }
        setValue(value);
    };

    const onSelect = (_event: SelectionEvents, data: OptionOnSelectData) => {
        if (mode.type === "search" && data.optionText && countries) {
            mode.params.countryCode = countries.find((c) => c.name === data.optionText)?.iso_3166_1 || "";
            setValue(data.optionText);
            setMode({ ...mode });
        }
    }

    const selectedCountry =
        mode.type === "search" && countries
            ? countries.find((c) => c.iso_3166_1 === mode.params.countryCode)
            : undefined;

    return (
        <div style={{ position: "relative", width: "100%" }}>
            {selectedCountry && (
                <Image
                    style={{
                        position: "absolute",
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 1,
                        height: "16px",
                        pointerEvents: "none",
                    }}
                    src={`/images/flags/${selectedCountry.iso_3166_1.toLowerCase()}.svg`}
                    alt={selectedCountry.name}
                />
            )}
            <Combobox
                id={comboId}
                onChange={onChange}
                onOptionSelect={onSelect}
                value={value}
                style={{ width: "100%" }}
                input={{ style: { paddingLeft: selectedCountry ? "38px" : undefined } }}
                placeholder="Select a country..."
            >
                {matchingOptions.map((option) => (
                    <Option key={option.iso_3166_1} text={option.name}>
                        <Image style={{ height: "16px" }} src={`/images/flags/${option.iso_3166_1.toLowerCase()}.svg`} alt={option.name} />
                        <span style={{ width: "100%", textWrap: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{option.name}</span>
                    </Option>
                ))}
            </Combobox>
        </div>
    );
};
