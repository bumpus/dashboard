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

// Determine if we've logged in before
// 1) Is the user id set in $_SESSION
// 2) If not, is it set in the login cookie?
// 3) If 1 or 2, then check if an access_token is stored
// 4) If access_token is not stored, see if we're going to oauth2callback.php to set it
// 5) Otherwise, send us off to the login page.
error_log("line 42");

/* Begin be determining if we already know this user */
$user_email = NULL;
/* first check in the session data */
if (isset($_SESSION['user_email'])){
  $user_email = $_SESSION['user_email'];
}else if (isset($_COOKIE['login_id'])){
  /* if that didn't work, check for a login_id cookie to lead us to it */
error_log("line 51");
  $docRef = $firestore->collection('login_ids')->document($_COOKIE['login_id']);
  $snapshot = $docRef->snapshot();
  $data = $snapshot->data();
  if(array_key_exists('user_email', $data)){
    $user_email = $data['user_email'];
  }
}

/* If we have an e-mail address already, then see if Google login data is stored for it */
$access_token = NULL;
$refresh_token = NULL;
error_log("line 63");
#$docRef = $firestore->collection('settings')->document($user_email);
#$snapshot = $docRef->snapshot();
#if($snapshot->exists()){
#  $data = $snapshot->data();
#  if(array_key_exists('access_token', $data)){
#    $access_token = $data['access_token'];
#  }
#  if(array_key_exists('refresh_token', $data)){
#    $refresh_token = $data['refresh_token'];
#  }
#}



if((NULL == $access_token) || ($file == '/oauth2callback.php')) {
  if (! isset($_GET['code'])) {
    $auth_url = $client->createAuthUrl();
    header('Location: ' . filter_var($auth_url, FILTER_SANITIZE_URL));
    return;
  } else {
    $client->authenticate($_GET['code']);
    # get the id of the logged in user and retreive their configuration:
    $tokeninfo = $client->verifyIdToken();
    $user_email = $tokeninfo['email'];
    $_SESSION['user_email'] = $user_email;

    /* Store the user's e-mail address in the login_id database
     * If the user already has a login_id cookie set, refresh it.
     * Otherwise, generate a new one, set cookie and store in database */

    if(isset($_COOKIE['user_id'])){
      // Get the user_id random string supplied in the user's cookie
      $user_id = $_COOKIE['user_id'];
    }else{
      // Generate a new random user_id login id for the cookie
      $user_id = bin2hex(random_bytes(16));
    }
error_log("line 101");
    $docRef = $firestore->collection('login_ids')->document($user_id);
    $docRef->set(['user_email' => $user_email], ['merge' => false]);

    // Get the user's database entry and store the access_token and refresh_token
error_log("line 106");
    $docRef = $firestore->collection('settings')->document($user_email);
    $docRef->set(['access_token' => $client->getAccessToken()], ['merge' => true]);
    $docRef->set(['refresh_token' => $client->getRefreshToken()], ['merge' => true]);

    setcookie('user_id', $user_id, time()+(86400 * 30), '/', $_SERVER['SERVER_NAME'], true, true);

    $redirect_uri = 'https://' . $_SERVER['HTTP_HOST'] . '/';
    header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
    return;
  }
} else {
  $client->setAccessToken($access_token);
  if($client->isAccessTokenExpired()){
    if (NULL != $refresh_token)
    {
error_log("line 122");
      $docRef = $firestore->collection('settings')->document($user_email);
      $snapshot = $docRef->snapshot();
      $client->refreshToken($snapshot->data()['refresh_token']);
      // Get the user's database entry and store the access_token and refresh_token
      $docRef->set(['access_token' => $client->getAccessToken()], ['merge' => true]);
      $docRef->set(['refresh_token' => $client->getRefreshToken()], ['merge' => true]);

      /* Store the user's e-mail address in the login_id database
       * If the user already has a login_id cookie set, refresh it.
       * Otherwise, generate a new one, set cookie and store in database */

      if(isset($_COOKIE['user_id'])){
        // Get the user_id random string supplied in the user's cookie
        $user_id = $_COOKIE['user_id'];
    }else{
      // Generate a new random user_id login id for the cookie
      $user_id = bin2hex(random_bytes(16));
    }
error_log("line 141");
    $docRef = $firestore->collection('login_ids')->document($user_id);
    $docRef->set(['user_email' => $user_email], ['merge' => false]);

    setcookie('user_id', $user_id, time()+(86400 * 30), '/', $_SERVER['SERVER_NAME'], true, true);

    }
    else
    {
      error_log("No refresh token. responding with 403 status");
      http_response_code(403); // Don't have a refresh code set unauthroized return code
error_log("line 152");
      $docRef = $firestore->collection('settings')->document($user_email);
      $docRef->set(['access_token' => NULL], ['merge' => true]); //NULL out expired access_token
      error_log("Removed access_token for $user_email");
      return;
    }

  }
}

# get the id of the logged in user and retreive their configuration:
$tokeninfo = $client->verifyIdToken();
$user_email = $tokeninfo['email'];

error_log("line 166");
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

