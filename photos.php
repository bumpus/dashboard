<?php
require_once __DIR__ . '/vendor/autoload.php';

$service = new Google_Service_PhotosLibrary($client);

$search = new Google_Service_PhotosLibrary_SearchMediaItemsRequest();
$search->setAlbumId($dashboardAlbum);

$json_photos = array();
try {
    // Make a request to list all media items in an album
    // Provide the ID of the album as a parameter in the searchMediaItems call
    // Iterate over all the retrieved media items
    $response = $service->mediaItems->search($search);
    foreach($response['mediaItems'] as $photo){
      array_push($json_photos, array( 
        'url' => $photo['baseUrl'],
        'id' => $photo['id'])
      );
    }
} catch (\Google\ApiCore\ApiException $e) {
  echo "got an error<br>";
  var_dump($e);
}

print json_encode($json_photos);
