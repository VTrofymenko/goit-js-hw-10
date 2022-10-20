import debounce from 'lodash.debounce';
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const ALERT_MESSAGE = 'Oops, there is no country with that name!!!';
const INFO_MESSAGE =
  'Too many matches found. Please enter a more specific name.';
const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countriesList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(event) {
  let country = event.target.value.trim();

  if (country === '') {
    clearCountriesList();
    clearCountryInfo();
    return;
  }

  fetchCountries(country)
    .then(renderResults)
    .catch(() => {
      clearCountriesList();
      clearCountryInfo();
      Notify.failure(ALERT_MESSAGE);
    });
}

function getCountriesList(countries) {
  const markupCountries = countries.map(markupFewCountries).join('');

  renderFewCountries(markupCountries);
}

function markupFewCountries(countries) {
  let {
    name,
    flags: { svg },
  } = countries;
  return `<li class="country-item">
  <img class="country-flag" src="${svg}" alt="${name} flag" width = 50/>
  <p class="country-name">${name}</p>
</li>`;
}

function renderFewCountries(markup) {
  refs.countriesList.innerHTML = markup;
}

function getCountry(country) {
  const markup = country.map(markupCountry).join('');
  renderCountry(markup);
}

function markupCountry(country) {
  let {
    name,
    capital,
    population,
    flags: { svg },
    languages,
  } = country;
  return `<div class = "wrapper"><div class="country-info__main">
  <img src="${svg}" alt="${name} flag" width = 50/>
  <p class = "country-name">${name}</p>
</div>
<div class="country-info__secondary">
  <p class="country-info__value">
    <span class="country-info__headding">Capital : </span>${capital}
  </p>
  <p class="country-info__value">
    <span class="country-info__headding">Population : </span>
    ${population}
  </p>
  <p class="country-info__value">
    <span class="country-info__headding">Languages : </span>${getLanguage(
      languages
    )}
  </p>
</div></div>`;
}

function renderCountry(markup) {
  refs.countryInfo.innerHTML = markup;
}

function getLanguage(languages) {
  for (let language of languages) {
    return language.name;
  }
}

function renderResults(countries) {
  if (countries.length > 10) {
    Notify.info(INFO_MESSAGE);
    clearCountriesList();
    clearCountryInfo();
    return;
  }

  if (countries.length > 1 && countries.length <= 10) {
    getCountriesList(countries);
    clearCountryInfo();
    return;
  }
  if (countries.length === 1) {
    getCountry(countries);
    clearCountriesList();
    return;
  }
}

function clearCountriesList() {
  refs.countriesList.innerHTML = '';
}

function clearCountryInfo() {
  refs.countryInfo.innerHTML = '';
}
