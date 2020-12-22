<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
  <head>
    <title>Bump.us Dashboard</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="weather.js" defer></script>
    <script src="menu.js" defer></script>
    <script src="photos.js" defer></script>
    <script src="clock.js" defer></script>
    <script src="calendar.js" defer></script>
    <link rel="stylesheet" type="text/css" href="weather.css">
    <link rel="stylesheet" type="text/css" href="menu.css">
    <link rel="stylesheet" type="text/css" href="photos.css">
    <link rel="stylesheet" type="text/css" href="clock.css">
    <link rel="stylesheet" type="text/css" href="calendar.css">
    <script>
      days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var menuDate;

$(document).ready(function(){
  //Start a clock display
  setInterval(updateClock, 1000);

  //Set timers to reload the calendar and weather
  setInterval(loadWeather, 1000 * 60 * 15);
  setInterval(loadCalendar, 1000 * 60 * 5);

  //Load initial content 
  loadMenus();
  loadWeather();
  loadCalendar();
  loadPhoto();
});
    </script>
    <style>
body {
  background : lightcyan;
}
    </style>
  </head>
  <body>
    <div id="Calendar"></div>
    <div id="weather"></div>
    <div id="clock"></div>
    <div id="menus">
      <div class="menu" id="taft"><div class=school>Taft</div></div>
      <div class="menu" id="jefferson"><div class=school>Jefferson</div></div>
    </div>
    <div class="photos"></div>
  </body>
</html>
