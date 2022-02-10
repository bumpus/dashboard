<?php
require __DIR__ . '/vendor/autoload.php';

use Google\Cloud\Firestore\FirestoreClient;

$projectId = getenv('GOOGLE_CLOUD_PROJECT');
# Instantiate the Firestore Client for your project ID.
$firestore = new FirestoreClient([
    'projectId' => $projectId,
]);

# Sort out what file is being requested
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

/* Determine if we already know this user */
$user_email = NULL;
if (isset($_COOKIE['login_id'])){
  $docRef = $firestore->collection('login_ids')->document($_COOKIE['login_id']);
  $snapshot = $docRef->snapshot();
  $data = $snapshot->data();
  if(array_key_exists('user_email', $data)){
    $user_email = $data['user_email'];
  }
}

/* If we have an e-mail address, then see if Google login data is stored for it */
$access_token = NULL;
$refresh_token = NULL;
if(NULL != $user_email){
  $docRef = $firestore->collection('settings')->document($user_email);
  $snapshot = $docRef->snapshot();
  if($snapshot->exists()){
    $data = $snapshot->data();
    if(array_key_exists('access_token', $data)){
      $access_token = $data['access_token'];
    }
    if(array_key_exists('refresh_token', $data)){
      $refresh_token = $data['refresh_token'];
    }
  }
}

if((NULL == $access_token) || ($file == '/oauth2callback.php')) {
  if (isset($_GET['code'])) { # client is returning from google login page
    $client->authenticate($_GET['code']);
    # get the id of the logged in user and retreive their configuration:
    $tokeninfo = $client->verifyIdToken();
    $user_email = $tokeninfo['email'];

    /* Store the user's e-mail address in the login_id database
     * If the user already has a login_id cookie set, refresh it.
     * Otherwise, generate a new one, set cookie and store in database */

    if(isset($_COOKIE['login_id'])){
      # Get the login_id random string supplied in the user's cookie
      $login_id = $_COOKIE['login_id'];
    }else{
      # Generate a new random login_id login id for the cookie
      $login_id = bin2hex(random_bytes(16));
    }

    $docRef = $firestore->collection('login_ids')->document($login_id);
    $docRef->set(['user_email' => $user_email], ['merge' => false]);

    # Get the user's database entry and store the access_token and refresh_token
    $docRef = $firestore->collection('settings')->document($user_email);
    $docRef->set(['access_token' => $client->getAccessToken()], ['merge' => true]);
    $docRef->set(['refresh_token' => $client->getRefreshToken()], ['merge' => true]);

    setcookie('login_id', $login_id, time()+(86400 * 30), '/', $_SERVER['SERVER_NAME'], true, true);

    $redirect_uri = 'https://' . $_SERVER['HTTP_HOST'] . '/';
    header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
    return;
  } else { #cleint needs to visit login page
    $auth_url = $client->createAuthUrl();
    header('Location: ' . filter_var($auth_url, FILTER_SANITIZE_URL));
    return;
  }
} else { #The user has an access_token
  $client->setAccessToken($access_token);
  if($client->isAccessTokenExpired()){
    if (NULL != $refresh_token)
    {
      $docRef = $firestore->collection('settings')->document($user_email);
      $snapshot = $docRef->snapshot();
      $client->refreshToken($snapshot->data()['refresh_token']);
      # Get the user's database entry and store the access_token and refresh_token
      $docRef->set(['access_token' => $client->getAccessToken()], ['merge' => true]);
      $docRef->set(['refresh_token' => $client->getRefreshToken()], ['merge' => true]);

      /* Store the user's e-mail address in the login_id database
       * If the user already has a login_id cookie set, refresh it.
       * Otherwise, generate a new one, set cookie and store in database */

      if(isset($_COOKIE['login_id'])){
        # Get the login_id random string supplied in the user's cookie
        $login_id = $_COOKIE['login_id'];
    }else{
      # Generate a new random login_id for the cookie
      $login_id = bin2hex(random_bytes(16));
    }
    $docRef = $firestore->collection('login_ids')->document($login_id);
    $docRef->set(['user_email' => $user_email], ['merge' => false]);

    setcookie('login_id', $login_id, time()+(86400 * 30), '/', $_SERVER['SERVER_NAME'], true, true);
    }
    else
    {
      error_log("No refresh token. responding with 403 status");
      http_response_code(403); # Don't have a refresh code set unauthroized return code
      $docRef = $firestore->collection('settings')->document($user_email);
      $docRef->set(['access_token' => NULL], ['merge' => true]); #NULL out expired access_token
      error_log("Removed access_token for $user_email");
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

# Sort out which file is requested
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
case '/covid.php' :
  require __DIR__ . '/covid.php';
  break;
default:
  http_response_code(404);
  echo "Not Found (404)";
  break;
}
?>

