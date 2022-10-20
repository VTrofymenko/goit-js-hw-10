export function fetchCountries(country) {
  return fetch(
    `https://restcountries.com/v2/name/${country}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      //   clearCountriesList();
      //   clearCountryInfo();
      //   Notify.failure(ALERT_MESSAGE);
      throw new Error(response.status);
    }

    return response.json();
  });
}
