<?php
require_once __DIR__.'/vendor/autoload.php';

session_start();

$client = new Google_Client();
$client->setAuthConfigFile('client_secrets.json');
$client->setRedirectUri('https://' . $_SERVER['HTTP_HOST'] . '/oauth2callback.php');
$client->addScope(Google_Service_Calendar::CALENDAR_READONLY);

if (! isset($_GET['code'])) {
  error_log("No code");
  $auth_url = $client->createAuthUrl();
  header('Location: ' . filter_var($auth_url, FILTER_SANITIZE_URL));
} else {
  error_log("Code is: " . $_GET['code']);

  $client->authenticate($_GET['code']);
  $_SESSION['access_token'] = $client->getAccessToken();

  error_log("Access_token is: " . $client->getAccessToken());
  ob_start();
  var_dump($_SESSION );
  $contents = ob_get_contents();
  ob_end_clean();
  error_log("_SESSION contains: " . $contents );

  $redirect_uri = 'https://' . $_SERVER['HTTP_HOST'] . '/calendar.php';
  header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
}

?>
