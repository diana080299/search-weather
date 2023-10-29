// key = 'https://www.weatherapi.com/docs/'
// Base 'URL: http://api.weatherapi.com/v1'
// /forecast.json

/*
1. збираємо рефси
2. вішаємо на форму обробник подій по сабміту
    2.1. зупиняємо поведінку браузера за замовчуванням (event.preventDefault())
    2.2. витягуємо з форми інформацію про місто і кількість днів
    2.3. робимо запит з інформцією, яку ми зібрали з полів (окрема ф-ція)
    2.4. відмальовуємо розмітку (окрема ф-ція)
*/

const refs = {
    form: document.querySelector('.js-search-form'),
    list: document.querySelector('.js-list')
}


refs.form.addEventListener('submit', onSubFrom)

function onSubFrom(event) {
    event.preventDefault();
    const {city, days} = event.currentTarget.elements;
   
serviceWeather(city.value, days.value)
.then ((data) => refs.list.innerHTML = createMarkup(data.forecast.forecastday))
.catch((error) => console.log(error))
.finally(()=> refs.form.reset())
}

function serviceWeather(city, days) {
    const API_KEY = '725d98ee85724637912101834231710';
    const BASE_URL = "https://www.weatherapi.com";
const params = new URLSearchParams ({
    key: API_KEY,
    q: city,
    days,
    lang: "uk",
})
// fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=${days}&lang=uk`)
return fetch(`${BASE_URL}/forecast.json?${params}`).then((response) => {
 
  if (!response.ok) {
    throw new Error(
      `Вимушена помилка статусу: ${response.status} | Причина: ${response.statusText}`
    )}

        return response.json()
    })
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
          astro: {
            sunrise,
            sunset,
            moonrise
          }
        }) => `<li class="js-weather-card">
          <img src="${icon}" alt="${text}" class="weather-icon">
          <h2 class="date">${date}</h2>
          <h3 class="weather-text">${text}</h3>
          <h3 class="temperature">${avgtemp_c} °C</h3>
          <h3 class="temperature">${sunrise} °C</h3>
          <h3 class="temperature">${sunset} °C</h3>
          <h3 class="temperature">${moonrise} °C</h3>
      </li>
        `
      )
      .join("");
  }