<?php
require __DIR__ . '/vendor/autoload.php';

session_start();

// Sort out what file is being requested
$request = $_SERVER['REQUEST_URI'];
$file = explode("?", $request)[0];
error_log("file is: " . $file . "===");

$client = new Google_Client();
$client->setAuthConfig('client_secrets.json');
$client->setAccessType('offline');
$client->setApprovalPrompt ("force");
$client->setIncludeGrantedScopes(true);
$client->addScope([Google_Service_Calendar::CALENDAR_READONLY, Google_Service_PhotosLibrary::PHOTOSLIBRARY_READONLY]);
$client->setRedirectUri('https://' . $_SERVER['HTTP_HOST'] . '/oauth2callback.php');

ob_start();
var_dump($_SESSION );
$contents = ob_get_contents();
ob_end_clean();
error_log("_SESSION contains: " . $contents );

if(!(isset($_SESSION['access_token']) && $_SESSION['access_token'])) {
  error_log("index.php: No access_token in SESSION");
  if (! isset($_GET['code'])) {
    error_log("oauth2callback.php \$_GET['code'] is not set");
    $auth_url = $client->createAuthUrl();
    error_log("Redirecting to $auth_url\n");
    header('Location: ' . filter_var($auth_url, FILTER_SANITIZE_URL));
    return;
  } else {
    $client->authenticate($_GET['code']);
    $_SESSION['access_token'] = $client->getAccessToken();
    $_SESSION['refresh_token'] = $client->getRefreshToken();

    error_log("Saved access_token and refresh token in \$_SESSION");
    ob_start();
    var_dump($_SESSION );
    $contents = ob_get_contents();
    ob_end_clean();
    error_log("_SESSION contains: " . $contents );

    $redirect_uri = 'https://' . $_SERVER['HTTP_HOST'] . '/';
    error_log("Redirecting to $redirect_uri\n");
    header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
    return;
  }
} else {
  $client->setAccessToken($_SESSION['access_token']);
  error_log("Had an access_token");
  error_log("Checking if access_token expired");
  if($client->isAccessTokenExpired()){
    error_log("access_token expired");
    if (isset($_SESSION['refresh_token']) && $_SESSION['refresh_token'])
    {
      $client->refreshToken($_SESSION['refresh_token']);
      $_SESSION['access_token'] = $client->getAccessToken();

      error_log("Refreshed access_token and saved to  \$_SESSION");
      ob_start();
      var_dump($_SESSION );
      $contents = ob_get_contents();
      ob_end_clean();
      error_log("_SESSION contains: " . $contents );
    }
    else
    {
      error_log("No refresh token. responding with 401 status");
      http_response_code(401); // Don't have a refresh code set unauthroized return code
      $_SERVER['access_token'] = NULL; //NULL out expired access_token
      error_log("Removed access_token from   \$_SESSION");
      ob_start();
      var_dump($_SESSION );
      $contents = ob_get_contents();
      ob_end_clean();
      error_log("_SESSION contains: " . $contents );
      return;
    }

  }
}

switch ($file) {
case '' :
case '/' :
case 'index.html' :
case 'index.php' :
  error_log("index.php: routing to main.php");
  require __DIR__. '/main.php';
  break;
case '/weather.php' :
  error_log("index.php: routing to weather.php");
  require __DIR__ . '/weather.php';
  break;
case '/calendar.php' :
  error_log("index.php: routing to calendar.php");
  require __DIR__ . '/calendar.php';
  break;
default:
  http_response_code(404);
  break;
}
?>
