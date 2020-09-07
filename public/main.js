// MAKE SURE SERVICE WORKERS ARE SUPPORTED
if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw_cached_site.js')
      .then(reg => console.log('Service Worker: Registered'))
      .catch(err => console.log(`Service Worker Error: ${err}`))
  })
}

let notificationElement = document.querySelector('.notification');
let inputElement = document.querySelector('.input');
let submitElement = document.querySelector('.submit');
let iconElement = document.querySelector('.weather-icon')
let locationElement = document.querySelector('.location');
let dateElement = document.querySelector('.date');
let tempElement = document.querySelector('.temp');
let descElement = document.querySelector('.desc');


const key = '11ca1a22393a6a5d92f3beb8703b2366';
const KELVIN = 273;
const weatherInfo = {};

// GET DATE
const displayDate = () => {
  let now, year, day, days, date, month, months;
  now = new Date();
  year = now.getFullYear();
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  day = now.getDay();
  date = now.getDate();
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  month = now.getMonth();
  return `${days[day]} ${date} ${months[month]}  ${year}`;
}

// GET WEATHER FROM API PROVIDER
const getWeather = () => {
  const api = `https://api.openweathermap.org/data/2.5/weather?q=${inputElement.value}&appid=${key}`;

  fetch(api)
    .then(res => res.json())
    .then((data) => {
      weatherInfo.location = `${data.name}, ${data.sys.country}`;
      weatherInfo.temp = Math.floor(data.main.temp - KELVIN);
      weatherInfo.date = displayDate();
      weatherInfo.desc = data.weather[0].description;
      weatherInfo.iconId = data.weather[0].icon;
    })
    .then(() => displayWeather())
    .catch(err => showERROR())
}

// Gather weather details on click event on submitElement
submitElement.addEventListener('click', getWeather);

// Gather weather details on keypress event with Enter key
document.addEventListener('keypress', function(event) {
  if(event.keyCode === 13 || event.which === 13){
    getWeather();
  };
});

// LOCAL STORAGE FUNCTION
function localStorageFunc() {
  //check to see if local storage is supported
  if(window.localStorage)
    console.log("Local Storage Supported");
  else
    console.log("Local Storage not supported in browser")

  // Setup local storage
  localStorage.setItem('iconElement', iconElement.innerHTML);
  localStorage.setItem('locationElement', locationElement.innerHTML);
  localStorage.setItem('dateElement', dateElement.innerHTML);
  localStorage.setItem('tempElement', tempElement.innerHTML);
  localStorage.setItem('descElement', descElement.innerHTML);

};

window.addEventListener('load', () => {

  // Get values of Local Storage keys
  let iconContent = localStorage.getItem('iconElement');
  let locationContent = localStorage.getItem('locationElement');
  let dateContent = localStorage.getItem('dateElement');
  let tempContent = localStorage.getItem('tempElement');
  let descContent =localStorage.getItem('descElement');

  // Set innerHTML of elements on browser reload
  iconElement.innerHTML = iconContent;
  locationElement.innerHTML = locationContent;
  dateElement.innerHTML = dateContent;
  tempElement.innerHTML = tempContent;
  descElement.innerHTML = descContent;
})

// DISPLAY WEATHER TO UI
const displayWeather = () => {
  iconElement.innerHTML = `<img src="asset/icons/${weatherInfo.iconId}.png" />`;
  locationElement.innerHTML = weatherInfo.location;
  dateElement.innerHTML = weatherInfo.date;
  tempElement.innerHTML = `${weatherInfo.temp}&#8451`;
  descElement.innerHTML = weatherInfo.desc;
  inputElement.value = '';
  notificationElement.innerHTML = '';
  // Call function
  localStorageFunc();
}

// SHOW ERROR
function showERROR() {
  if(!window.navigator.onLine) {
    notificationElement.innerHTML = `<p>Connection not available</p>`;
  }
  else if(inputElement.value.length < 1) {
    notificationElement.innerHTML = `<p>City is required</p>`;
  }
  else {
    notificationElement.innerHTML = `<p>Incorrect city try again</p>`;
  }
}

// const myObjLocalStorage = {
//   iconElement: iconElement,
//   locationElement: locationElement,
//   dateElement: dateElement,
//   tempElement: tempElement,
//   descElement: descElement
// }
