<?php
require_once __DIR__ . '/vendor/autoload.php';
use Google\Photos\Library\V1\PhotosLibraryClient;
use Google\Auth\Credentials\UserRefreshCredentials;

#$service = new PhotosLibraryClient($client);
$authCredentials = new UserRefreshCredentials(
  $scopes,
  [
    'client_id' => $client->getClientId(),
    'client_secret' => $client->getclientSecret(),
    'refresh_token' => $client->getRefreshToken()
  ]
);

$service = new PhotosLibraryClient(['credentials' => $authCredentials]);

#$search = new SearchMediaItemsRequest();
#$search->setAlbumId($dashboardAlbum);
#$search->setPageSize(100);

$json_photos = array();
try {
    // Make a request to list all media items in an album
    // Provide the ID of the album as a parameter in the searchMediaItems call
    // Iterate over all the retrieved media items
    $response = $service->searchMediaItems(['albumId' => $dashboardAlbum, 'pageSize' => 100]);
    foreach($response->iterateAllElements() as $photo){
      array_push($json_photos, array( 
        'url' => $photo->getBaseUrl(),
        'id' => $photo->getId(),
        'width' => $photo->getMediaMetadata()->getWidth(),
        'height' => $photo->getMediaMetadata()->getHeight())
      );
    }
} catch (\Google\ApiCore\ApiException $e) {
  echo "got an error<br>";
  var_dump($e);
}

print json_encode($json_photos);
