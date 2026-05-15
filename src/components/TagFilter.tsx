import * as React from "react";
import { Combobox, ComboboxProps, Option, useId } from "@fluentui/react-components";
import { NameAndCount, SearchMode } from "../types/services.types";
import { useTags } from "../hooks/useTags";

interface TagFilterProps {
    mode: SearchMode;
    setMode: (mode: SearchMode) => void;
}

export const TagFilter = ({ mode, setMode }: TagFilterProps) => {
    const comboId = useId("tag-filter");
    const { tags } = useTags();
    const [value, setValue] = React.useState(
        mode.type === "search" ? mode.params.tag || "" : "",
    );
    const [matchingOptions, setMatchingOptions] = React.useState<NameAndCount[]>([]);

    React.useEffect(() => {
        if (tags) {
            setMatchingOptions(tags.slice(0, 10));
            if (mode.type === "search") {
                setValue(mode.params.tag || "");
            }
        }
    }, [tags, mode]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        if (tags && value) {
            setMatchingOptions(
                tags.filter((option) =>
                    option.name.toLowerCase().includes(value.toLowerCase()),
                ).slice(0, 10),
            );
        }
        else if (tags) {
            setMatchingOptions(tags.slice(0, 10));
        }
        else {
            setMatchingOptions([]);
        }
        setValue(value);
    };

    const onSelect: ComboboxProps["onOptionSelect"] = (e, data) => {
        if (mode.type === "search" && data.optionText) {
            mode.params.tag = data.optionValue;
            setValue(data.optionText);
            setMode({ ...mode });
        }
    };

    return (
        <Combobox
            id={comboId}
            onChange={onChange}
            onOptionSelect={onSelect}
            value={value}
            placeholder="Select a tag..."
        >
            {matchingOptions.map((option) => (
                <Option key={option.name}>{option.name}</Option>
            ))}
        </Combobox>
    );
};
