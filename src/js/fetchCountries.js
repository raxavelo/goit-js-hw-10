import { debounce } from "lodash";
import { LimitError } from "./LimitError";
import { NotFoundError } from "./NotFoundError";

export async function fetchCountries(country) {
  const response = await fetch(
    `https://restcountries.com/v3.1/name/${country}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new NotFoundError("Oops, there is no country with that name");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }

  const data = await response.json();
  if (data.length > 10) {
    throw new LimitError(
      "Too many matches found. Please enter a more specific name."
    );
  }

  return data.map((country) => ({
    name: country.name.official,
    population: country.population,
    capital: country.hasOwnProperty("country") ? country?.capital[0] : "None",
    flag: country.flags.svg,
    languages: Object.values(country.languages).join(", "),
  }));
}
