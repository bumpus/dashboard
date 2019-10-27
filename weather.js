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

