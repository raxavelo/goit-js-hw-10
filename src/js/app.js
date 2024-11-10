import { Notify } from "notiflix/build/notiflix-notify-aio";
import { LimitError } from "./LimitError";
import { NotFoundError } from "./NotFoundError";
import { fetchCountries } from "./fetchCountries";
import { debounce } from "lodash";

const countryInput = document.getElementById("search-box");
const listOfCountries = document.createElement("ul");
listOfCountries.id = "countries-list";
const oneCountry = document.createElement("div");
oneCountry.id = "one-country";

const debouncedFetchCountries = debounce(async (value) => {
  try {
    const countries = await fetchCountries(value);
    if (countries.length > 1) {
      showListOfCountries(countries);
    } else {
      showCountry(countries[0]);
    }
  } catch (err) {
    if (err instanceof LimitError) {
      listOfCountries.remove();
      oneCountry.remove();
      Notify.info(err.message);
    } else if (err instanceof NotFoundError) {
      listOfCountries.remove();
      oneCountry.remove();
      Notify.failure(err.message);
    } else {
      listOfCountries.remove();
      oneCountry.remove();
      Notify.failure(err.message);
      console.log(err.message);
      console.log(err.stack);
    }
  }
}, 300);

countryInput.addEventListener("input", (e) => {
  const country = e.target.value.trim();
  if (country.length === 0) {
    listOfCountries.remove();
    return;
  }
  debouncedFetchCountries(country);
});

function showListOfCountries(list) {
  oneCountry.remove();
  listOfCountries.innerHTML = "";
  const fragment = document.createDocumentFragment();
  list.forEach((country) => {
    const li = document.createElement("li");
    li.insertAdjacentHTML(
      "afterbegin",
      `<div><img src="${country.flag}" alt=""><p> - ${country.name}</p></div>`
    );
    fragment.appendChild(li);
  });
  listOfCountries.appendChild(fragment);
  document.body.appendChild(listOfCountries);
}

function showCountry(country) {
  listOfCountries.remove();
  oneCountry.innerHTML = "";
  oneCountry.insertAdjacentHTML(
    "afterbegin",
    `<h1><img src="${country.flag}" alt=""> ${country.name}</h1>
        <p><span class="bold">Population:</span> ${country.population}</p>
        <p><span class="bold">Capital:</span> ${country.capital}</p>
        <p><span class="bold">Languages:</span> ${country.languages}</p>`
  );
  document.body.appendChild(oneCountry);
}
