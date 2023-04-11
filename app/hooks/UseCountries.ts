// External packages.
import countries from "world-countries";

const formattedCountries = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
  flag: country.flag,
  latlng: country.latlng,
  region: country.region,
}));

const useCountries = () => {
  // Return all countries.
  const getAll = () => formattedCountries;

  // Return a country by the requested value.
  const getByValue = (value: string) =>
    formattedCountries.find((country) => country.value === value);

  return { getAll, getByValue };
};

export default useCountries;
