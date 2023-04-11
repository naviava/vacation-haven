"use client";

// External packages.
import Select from "react-select";
import Flag from "react-world-flags";

// Custom hooks.
import useCountries from "@/app/hooks/UseCountries";

export type CountrySelectValue = {
  value: string;
  label: string;
  flag: string;
  latlng: number[];
  region: string;
};

interface CountrySelectProps {
  value?: CountrySelectValue;
  onChange: (value: CountrySelectValue) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
  const { getAll } = useCountries();

  return (
    <div>
      <Select
        placeholder="Select a country..."
        isClearable
        options={getAll()}
        value={value}
        onChange={(country) => onChange(country as CountrySelectValue)}
        formatOptionLabel={(option: CountrySelectValue) => {
          return (
            <div className="flex flex-row items-center gap-3">
              <div>
                <Flag code={option.value} className="h-4 w-6 object-cover" />
              </div>
              <div>
                {option.label},{" "}
                <span className="ml-1 text-neutral-500">{option.region}</span>
              </div>
            </div>
          );
        }}
        classNames={{
          control: () => "border-2 p-3",
          input: () => "text-lg",
          option: () => "text-lg",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "rgba(251, 133, 0, 0.5)", // Color when selected
            primary25: "rgba(251, 133, 0, 0.2)", // Color when hovered
            primary50: "rgba(251, 133, 0, 0.3)", // Color when focused
          },
        })}
      />
    </div>
  );
};
export default CountrySelect;
