<?php
require __DIR__ . '/vendor/autoload.php';

session_start();

$client = new Google_Client();
$client->setAuthConfig('client_secrets.json');
$client->addScope(Google_Service_Calendar::CALENDAR_READONLY);

ob_start();
var_dump($_SESSION );
$contents = ob_get_contents();
ob_end_clean();
error_log("_SESSION contains: " . $contents );

if(isset($_SESSION['access_token']) && $_SESSION['access_token']){
  $client->setAccessToken($_SESSION['access_token']);
  error_log("Had an access_token");
}
else
{
  error_log("Didn't have no access_token");
  $redirect_uri = 'https://' . $_SERVER['HTTP_HOST'] . '/oauth2callback.php';
  header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
  $client = NULL;
}

$request = $_SERVER['REQUEST_URI'];

$file = explode("?", $request)[0];
error_log("file is: " . $file . "===");

switch ($file) {
case '' :
case '/' :
case 'index.html' :
case 'index.php' :
  require __DIR__. '/main.php';
  break;
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
