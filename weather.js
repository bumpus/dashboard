// Icons for sunrise, sunset, and moonphase taken from the climacons collection
// by Adam Whitcroft (http://adamwhitcroft.com/climacons/)
var sunriseIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="36" viewBox="0 0 48 36"><path d="M12.7 9.9 9.9 7c-0.8-0.8-2-0.8-2.8 0-0.8 0.8-0.8 2 0 2.8l2.8 2.8c0.8 0.8 2 0.8 2.8 0 0.8-0.8 0.8-2 0-2.8zM46 22h-4c-1.1 0-2 0.9-2 2 0 1.1 0.9 2 2 2h4c1.1 0 2-0.9 2-2 0-1.1-0.9-2-2-2zm-40 0h-4c-1.1 0-2 0.9-2 2 0 1.1 0.9 2 2 2h4c1.1 0 2-0.9 2-2 0-1.1-0.9-2-2-2zm28 10H14c-1.1 0-2 0.9-2 2 0 1.1 0.9 2 2 2h20c1.1 0 2-0.9 2-2 0-1.1-0.9-2-2-2zm7-25c-0.8-0.8-2-0.8-2.8 0l-2.8 2.8c-0.8 0.8-0.8 2 0 2.8 0.8 0.8 2 0.8 2.8 0l2.8-2.8c0.8-0.8 0.8-2 0-2.8zm-17 1c1.1 0 2-0.9 2-2v-4c0-1.1-0.9-2-2-2-1.1 0-2 0.9-2 2v4c0 1.1 0.9 2 2 2zm0 4c-6.6 0-12 5.4-12 12 0 1.4 0.3 2.7 0.7 4H17.1C16.4 26.8 16 25.5 16 24c0-4.4 3.6-8 8-8 4.4 0 8 3.6 8 8 0 1.5-0.4 2.8-1.1 4h4.4c0.4-1.3 0.7-2.6 0.7-4 0-6.6-5.4-12-12-12zm0 16.2c0.6 0 1-0.4 1-1v-3.8l2.5 2.5c0.4 0.4 1 0.4 1.4 0 0.4-0.4 0.4-1 0-1.4l-4.2-4.2c-0.4-0.4-1-0.4-1.4 0l-4.2 4.2c-0.4 0.4-0.4 1 0 1.4 0.4 0.4 1 0.4 1.4 0l2.5-2.5v3.8c0 0.6 0.4 1 1 1z"/></svg>';
var sunsetIcon  = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="36" viewBox="0 0 48 36"><path d="m46 26h-4c-1.1 0-2-0.9-2-2 0-1.1 0.9-2 2-2h4c1.1 0 2 0.9 2 2 0 1.1-0.9 2-2 2zM38.1 12.7c-0.8 0.8-2 0.8-2.8 0-0.8-0.8-0.8-2 0-2.8l2.8-2.8c0.8-0.8 2-0.8 2.8 0 0.8 0.8 0.8 2 0 2.8zm-2.8 15.3h-4.4c0.7-1.2 1.1-2.5 1.1-4 0-4.4-3.6-8-8-8-4.4 0-8 3.6-8 8 0 1.5 0.4 2.8 1.1 4h-4.4c-0.4-1.3-0.7-2.6-0.7-4 0-6.6 5.4-12 12-12 6.6 0 12 5.4 12 12 0 1.4-0.3 2.7-0.7 4zM24 8c-1.1 0-2-0.9-2-2V2c0-1.1 0.9-2 2-2 1.1 0 2 0.9 2 2v4c0 1.1-0.9 2-2 2zM9.9 12.7 7 9.9c-0.8-0.8-0.8-2 0-2.8 0.8-0.8 2-0.8 2.8 0l2.8 2.8c0.8 0.8 0.8 2 0 2.8-0.8 0.8-2 0.8-2.8 0zM8 24c0 1.1-0.9 2-2 2H2c-1.1 0-2-0.9-2-2 0-1.1 0.9-2 2-2h4c1.1 0 2 0.9 2 2zm16-4c0.6 0 1 0.4 1 1v3.8l2.5-2.5c0.4-0.4 1-0.4 1.4 0 0.4 0.4 0.4 1 0 1.4l-4.2 4.2c-0.4 0.4-1 0.4-1.4 0l-4.2-4.2c-0.4-0.4-0.4-1 0-1.4 0.4-0.4 1-0.4 1.4 0l2.5 2.5v-3.8c0-0.6 0.4-1 1-1zm-10 12h20c1.1 0 2 0.9 2 2 0 1.1-0.9 2-2 2H14c-1.1 0-2-0.9-2-2 0-1.1 0.9-2 2-2z"/></svg>';
var tempIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="36" viewBox="0 0 16 36"><path d="m8 36c-4.4 0-8-3.6-8-8 0-2 0.8-3.9 2-5.3V6c0-3.3 2.7-6 6-6 3.3 0 6 2.7 6 6V22.7c1.2 1.4 2 3.3 2 5.3 0 4.4-3.6 8-8 8zm2-11.4v-4.3-10.3-4c0-1.1-0.9-2-2-2-1.1 0-2 0.9-2 2v4 10.3 4.3c-1.2 0.7-2 2-2 3.4 0 2.2 1.8 4 4 4 2.2 0 4-1.8 4-4 0-1.5-0.8-2.8-2-3.4z"/></svg>';
var rainIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44"><path d="m36 31.3v-4.4c2.4-1.4 4-4 4-6.9 0-4.4-3.6-8-8-8-1.6 0-3.1 0.5-4.3 1.3C26.4 8 21.7 4 16 4 9.4 4 4 9.4 4 16c0 3.6 1.6 6.7 4 8.9v4.9c-4.8-2.8-8-7.9-8-13.8C0 7.2 7.2 0 16 0c6 0 11.2 3.3 14 8.2 0.7-0.1 1.3-0.2 2-0.2 6.6 0 12 5.4 12 12 0 5.2-3.3 9.7-8 11.3zm-22-11.3c1.1 0 2 0.9 2 2v16c0 1.1-0.9 2-2 2-1.1 0-2-0.9-2-2v-16c0-1.1 0.9-2 2-2zm8 4c1.1 0 2 0.9 2 2v16c0 1.1-0.9 2-2 2-1.1 0-2-0.9-2-2v-16c0-1.1 0.9-2 2-2zm8-4c1.1 0 2 0.9 2 2v16c0 1.1-0.9 2-2 2-1.1 0-2-0.9-2-2v-16c0-1.1 0.9-2 2-2z"/></svg>';

//Array of moonphases
var moonIcon = [
  // New Moon
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 24C5.4 24 0 18.6 0 12 0 5.4 5.4 0 12 0c6.6 0 12 5.4 12 12 0 6.6-5.4 12-12 12z"/></svg>',
  // Waxing Crescent
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 24C18.6 24 24 18.6 24 12 24 5.4 18.6 0 12 0 5.4 0 0 5.4 0 12 0 18.6 5.4 24 12 24ZM10 4.3C10.6 4.1 11.3 4 12 4c4.4 0 8 3.6 8 8 0 4.4-3.6 8-8 8-0.7 0-1.4-0.1-2-0.3 3.4-0.9 6-4 6-7.7 0-3.7-2.6-6.8-6-7.7z"/></svg>',
  // First Quarter
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 24C5.4 24 0 18.6 0 12 0 5.4 5.4 0 12 0c6.6 0 12 5.4 12 12 0 6.6-5.4 12-12 12zm0-4c4.4 0 8-3.6 8-8C20 7.6 16.4 4 12 4Z"/></svg>',
  // Waxing Gibbous
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 24C5.4 24 0 18.6 0 12 0 5.4 5.4 0 12 0c6.6 0 12 5.4 12 12 0 6.6-5.4 12-12 12zM12 4c-2.2 0-4 3.6-4 8 0 4.4 1.8 8 4 8 4.4 0 8-3.6 8-8C20 7.6 16.4 4 12 4Z"/></svg>',
  // Full Moon
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 24C5.4 24 0 18.6 0 12 0 5.4 5.4 0 12 0 18.6 0 24 5.4 24 12 24 18.6 18.6 24 12 24ZM12 4c-4.4 0-8 3.6-8 8 0 4.4 3.6 8 8 8 4.4 0 8-3.6 8-8C20 7.6 16.4 4 12 4Z"/></svg>',
  // Waning Gibbous
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m12 24c6.6 0 12-5.4 12-12C24 5.4 18.6 0 12 0 5.4 0 0 5.4 0 12 0 18.6 5.4 24 12 24ZM12 4c2.2 0 4 3.6 4 8 0 4.4-1.8 8-4 8-4.4 0-8-3.6-8-8 0-4.4 3.6-8 8-8z"/></svg>',
  // Last Quarter
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m12 24c6.6 0 12-5.4 12-12C24 5.4 18.6 0 12 0 5.4 0 0 5.4 0 12 0 18.6 5.4 24 12 24Zm0-4c-4.4 0-8-3.6-8-8C4 7.6 7.6 4 12 4Z"/></svg>',
  // Waning Crescent
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 24C5.4 24 0 18.6 0 12 0 5.4 5.4 0 12 0c6.6 0 12 5.4 12 12 0 6.6-5.4 12-12 12zm2-19.7C13.4 4.1 12.7 4 12 4 7.6 4 4 7.6 4 12c0 4.4 3.6 8 8 8 0.7 0 1.4-0.1 2-0.3C10.6 18.8 8 15.7 8 12 8 8.3 10.6 5.2 14 4.3Z"/></svg>'];

function loadWeather(){
  $.getJSON("weather.php", displayWeather);
}

function displayWeather(data){
  var dailyskycons = new Skycons({"color": "grey"});
  var currentskycons = new Skycons({"color": "darkgrey"});
  $("#weather").empty();
  $("#weather").append("<div id='current'></div>")
  $("#current").append(`<div class='currentSummary'>${data.current.summary}</div>`); 
  $("#current").append(`<div class='currentTemperature'>${data.current.temperature}&#176;</div>`);
  $("#current").append("<div class='currentPop'>" + Math.round(data.current.pop * 100) + "%</div>");
  $("#current").append(`<div class='currentIcon'><canvas id="current-icon" width="96" height="96"></div>`);
  $("#current").append("<div class= 'currentWind'>" + data.current.windSpeed + "mph - " + direction(data.current.windBearing) + "</div>");
  currentskycons.add('current-icon', chooseIcon(data.current.icon));

  if(data.current.alert){
    $("#current").append("<div class='alert'>!</div>");
  }

  $("#weather").append('<div id="week"></div>');
  $("#week").append(`<div class='weekSummary'>${data.daily.summary}</div>`);
  for(let day in data.daily.data){
    $("#week").append(`<div class='day' id='${day}' >`);
    $(`#${day}`).append(`<div class='dayName'>${day}</div>`);
    $(`#${day}`).append("<div class='dayContainer'></div>");
    $(`#${day} > .dayContainer`).append(`<div class='dailyLow'>${data.daily.data[day].low}&#176;</div>`);
    $(`#${day} > .dayContainer`).append(`<div class='dailyHigh'>${data.daily.data[day].high}&#176;</div>`);
    $(`#${day} > .dayContainer`).append("<div class='dailyPop'>" + Math.round(data.daily.data[day].pop * 100) + "%</div>");
    $(`#${day} > .dayContainer`).append(`<div class='dailyIcon'><canvas id="icon-${day}" width="48" height="48"></canvas></div>`);

    dailyskycons.add(`icon-${day}`, chooseIcon(data.daily.data[day].icon));
  }

  $("#week").append('<div class="day" id="almanac"></div>');
  $("#almanac").append('<div class="dayName">Almanac</div>');
  $("#almanac").append("<div class='dayContainer'></div>");
  $("#almanac > .dayContainer").append(`<div class="sunrise">${sunriseIcon}${data.almanac.sunrise}</div>`);
  $("#almanac > .dayContainer").append(`<div class="sunset">${sunsetIcon}${data.almanac.sunset}</div>`);
  // Math here converts from decimal moonphase 0=new 0.5 = full to one of the 8 icons in the array above
  $("#almanac > .dayContainer").append(`<div class="moonphase">${moonIcon[Math.round((data.almanac.moonphase*8)%8)]}</div>`);

  //Make the animated icons start animating
  currentskycons.play();
  dailyskycons.play();
}

function chooseIcon(icon){
  let skycon = Skycons.CLEAR_DAY;
  switch(icon){
    case "clear-day": skycon = Skycons.CLEAR_DAY; break;
    case "clear-night": skycon = Skycons.CLEAR_NIGHT; break;
    case "rain": skycon = Skycons.RAIN; break;
    case "snow": skycon = Skycons.SNOW; break;
    case "sleet": skycon = Skycons.SLEET; break;
    case "wind": skycon = Skycons.WIND; break;
    case "fog":skycon = Skycons.FOG; break;
    case "cloudy": skycon = Skycons.CLOUDY; break;
    case "partly-cloudy-day": skycon = Skycons.PARTLY_CLOUDY_DAY; break;
    case "partly-cloudy-night": skycon = Skycons.PARTLY_CLOUDY_NIGHT; break;
  }
  return skycon;
}

// No error checking on the input. It is the responsiblity
// of the caller to provide a bearing from 0 to 360.
// Data provided from darksky is always an integer 0 to 359.
function direction(bearing){
  var ret;
  if ((22 < bearing) && (bearing <= 67))
    ret = "NE";
  else if ((67 < bearing) && (bearing <= 112))
    ret = "E";
  else if ((112 < bearing) && (bearing <= 157))
    ret = "SE";
  else if ((157 < bearing) && (bearing <= 202))
    ret = "S";
  else if ((202 < bearing) && (bearing <= 247))
    ret = "SW";
  else if ((247 < bearing) && (bearing <= 292))
    ret = "W";
  else if ((292 < bearing) && (bearing <= 337))
    ret = "NW";
  else ret = "N"; // 337-360/0-22

  return ret;
}
