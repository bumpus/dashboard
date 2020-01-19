<?php
require __DIR__ . '/vendor/autoload.php';

use Google\Cloud\Firestore\FirestoreClient;

$projectId = getenv('GOOGLE_CLOUD_PROJECT');
// Instantiate the Firestore Client for your project ID.
$firestore = new FirestoreClient([
    'projectId' => $projectId,
]);

$handler = $firestore->sessionHandler(['gcLimit' => 500]);

// Configure PHP to use the the Firebase session handler.
session_set_save_handler($handler, true);
session_save_path('sessions');
session_start();

// Sort out what file is being requested
$request = $_SERVER['REQUEST_URI'];
$file = explode("?", $request)[0];

$client = new Google_Client();
$client->setAuthConfig('client_secrets.json');
$client->setAccessType('offline');
$client->setApprovalPrompt ("force");
$client->setIncludeGrantedScopes(true);
$client->addScope([
  Google_Service_Plus::USERINFO_EMAIL,
  Google_Service_Plus::USERINFO_PROFILE,
  Google_Service_Calendar::CALENDAR_READONLY,
  Google_Service_PhotosLibrary::PHOTOSLIBRARY_READONLY
]);
$client->setRedirectUri('https://' . $_SERVER['HTTP_HOST'] . '/oauth2callback.php');

if(!(isset($_SESSION['access_token']) && $_SESSION['access_token']) || ($file == '/oauth2callback.php')) {
  if (! isset($_GET['code'])) {
    $auth_url = $client->createAuthUrl();
    header('Location: ' . filter_var($auth_url, FILTER_SANITIZE_URL));
    return;
  } else {
    $client->authenticate($_GET['code']);
    $_SESSION['access_token'] = $client->getAccessToken();
    $_SESSION['refresh_token'] = $client->getRefreshToken();

    $redirect_uri = 'https://' . $_SERVER['HTTP_HOST'] . '/';
    header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
    return;
  }
} else {
  $client->setAccessToken($_SESSION['access_token']);
  if($client->isAccessTokenExpired()){
    if (isset($_SESSION['refresh_token']) && $_SESSION['refresh_token'])
    {
      $client->refreshToken($_SESSION['refresh_token']);
      $_SESSION['access_token'] = $client->getAccessToken();
    }
    else
    {
      error_log("No refresh token. responding with 401 status");
      http_response_code(403); // Don't have a refresh code set unauthroized return code
      $_SERVER['access_token'] = NULL; //NULL out expired access_token
      error_log("Removed access_token from   \$_SESSION");
      return;
    }

  }
}

# get the id of the logged in user and retreive their configuration:
$tokeninfo = $client->verifyIdToken();
$user_email = $tokeninfo['email'];

$docRef = $firestore->collection('settings')->document($user_email);
$snapshot = $docRef->snapshot();

$dashboardCalendars = NULL;
$dashboardAlbum = NULL;

if ($snapshot->exists()) {
  $data = $snapshot->data();
  if (array_key_exists('calendars', $data)){
    $dashboardCalendars = $snapshot->data()['calendars'];
  }else{
    $file = '/config.php';
  }

  if (array_key_exists('album', $data)){
    $dashboardAlbum = $snapshot->data()['album'];
  }else{
    $file = '/config.php';
  }
} else {
  printf('Document %s does not exist!' . PHP_EOL, $snapshot->id());
  $file = '/config.php';
}

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
case '/calendar.php' :
  require __DIR__ . '/calendar.php';
  break;
case '/config.php' :
  require __DIR__ . '/config.php';
  break;
case '/photos.php' :
  require __DIR__ . '/photos.php';
  break;
default:
  http_response_code(404);
  echo "Not Found (404)";
  break;
}
?>

