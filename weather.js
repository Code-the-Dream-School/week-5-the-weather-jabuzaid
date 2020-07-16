// Auther: Joseph Abzaid
// Code The Dream Software Development Bootcamp
// Summer 2020
//************************************ */
const myKey = "60d63513b2b0159bc51c7bcb2d7ba645";
const url = "https://api.openweathermap.org/data/2.5/";
/**
* FIRST FETCH FUNCTION - Verifying the existence of the input city and getting it's information
**/
var button = document.getElementById('search')
              .addEventListener('click', (event) => {
                var cityName = document.getElementById("city").value.toLowerCase();
                if (cityName.length === 0) {
                  alert('Please Enter City Name')
                } else {
                  var urlCityInfo = `weather?q=${cityName}&appid=${myKey}`
                  var cityURL = url + urlCityInfo;
                  fetch(cityURL)
                    .then(response => response.json())
                    .then(data => {
                        //capture the city/country/lat/long that are returned by the first api call
                        //the lat long will be used in the second api call
                        const city = data.name;
                        const country = data.sys.country;
                        const lon = data.coord.lon;
                        const lat = data.coord.lat;

                        var weeklyURL = url + `onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly&appid=${myKey}`;

                        generateWeatherReport(weeklyURL, city, country)
                    })
                    .catch(err => alert('City Not Found'));

                }
              });
/**
 * SECOND FETCH FUNCTION - Getting the weekly weather for the city
 **/
const generateWeatherReport = (url, city, country) => {
  fetch(url)
    .then(response => response.json())
    .then(weatherData => {
        generateCurrentWeather(city, country, weatherData)
    })

};
/**
 * HELPER FUNCTION - Adding the weather report data to the HTML.
 */
const generateCurrentWeather = (city, country, weatherData) => {
  var newHTML = '<table class="table table-dark">';
  newHTML += '<thead>';
  newHTML += '<tr>';
  newHTML += '<th scope="col">day</th>';
  newHTML += '<th scope="col">min</th>';
  newHTML += '<th scope="col">max</th>';
  newHTML += '<th scope="col">weather</th>';
  newHTML += '</tr>';
  newHTML += '</thead>';
  newHTML += '<tbody>';
  newHTML += '<tr>';
  //loop through the daily weather data to get the day for the next seven days
  for (let i =0; i< weatherData.daily.length -1; i++) {
    //convert the epoch returned by the api to a human readable data
    var date = new Date(weatherData.daily[i].dt * 1000);
    var iso = date.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/)
    newHTML += '<th scope="row">' + iso[1] + '</th>';
    // create cells for min max temperature
    newHTML += '<td>' + Math.round(weatherData.daily[i].temp.min)+ ` &#x2109;`	+ '</td>';
    newHTML += '<td>' + Math.round(weatherData.daily[i].temp.max) + ` &#x2109;`	+ '</td>';
    //get the icon data
    newHTML += `<td><img src="http://openweathermap.org/img/wn/${weatherData.daily[i].weather[0].icon}@2x.png"></img></td>`;
    newHTML += '</tr>'
  }
  newHTML += '</tbody>';
  newHTML += '</table>';
  var WeatherInfo = (city ? `<h1 class="text-danger"><span>***** ${city} *****</h1>` : "") +
  (country ? `<h2 class="p-3 mb-2 bg-warning text-dark"><span>Country:</span> ${country}</h2>` : "") +
  `<p id="current-weather" class="mb=3 p-3 bg-info text-white"></spam>Current Weather: ${weatherData.current.weather[0].description} </span></p>`
  //append the generated html to the info div
  document.getElementById('info').innerHTML =WeatherInfo + newHTML;
}
