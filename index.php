<?php

$request = $_SERVER['REQUEST_URI'];

$file = explode("?", $request)[0];
switch ($file) {
case '/weather.php' :
  require __DIR__ . '/weather.php';
  break;
case '/cal.php' :
  require __DIR__ . '/cal.php';
  break;
case '/calendar.php' :
  require __DIR__ . '/calendar.php';
  break;
case '/oauth2callback.php' :
  require __DIR__ . '/oauth2callback.php';
  break;
default:
  http_response_code(404);
  break;
}

?>
