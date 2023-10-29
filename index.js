
const refs = {
  form: document.querySelector(".js-search-form "),
  list: document.querySelector(".js-list"),
};

refs.form.addEventListener("submit", handleSearch);

function handleSearch(event) {
  event.preventDefault();

  const { city, days } = event.currentTarget.elements; 

  serviceWeather(city.value, days.value) 
    .then((data) => {
      refs.list.innerHTML = createMarkup(data.forecast.forecastday); 
    })
    .catch((err) => console.log(err))
    .finally(() => refs.form.reset()); 
}

function serviceWeather(city, days) {
  const BASE_URL = "https://api.weatherapi.com/v1";
  const API_KEY = "66f9e81543404d02beb160521230808";

  
  const params = new URLSearchParams({
    key: API_KEY,
    q: city,
    days,
    lang: "uk",
  });

  return fetch(`${BASE_URL}/forecast.json?${params}`).then((response) => {

    if (!response.ok) {
      throw new Error(
        `Вимушена помилка статусу: ${response.status} | Причина: ${response.statusText}`
      );
    }

    return response.json();
  });
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        date,
        day: {
          avgtemp_c,
          condition: { text, icon },
        },
      }) => `<li class="js-weather-card">
        <img src="${icon}" alt="${text}" class="weather-icon">
        <h2 class="date">${date}</h2>
        <h3 class="weather-text">${text}</h3>
        <h3 class="temperature">${avgtemp_c} °C</h3>
    </li>
      `
    )
    .join("");
}