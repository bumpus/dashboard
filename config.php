<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
  <head>
    <title>Bump.us Dashboard - Configuration</title>
    <style>
body {
  background : lightcyan;
}
    </style>
  </head>
  <body>
    <form action="config-save.php" method="post">
      <div id="Calendars">
      <fieldset>
<?php
//At this point, there should be a valid logged in google client
// Create a calendar object
$calendarservice = new Google_Service_Calendar($client);
$cals = $calendarservice->calendarList->listCalendarList();
foreach($cals as $cal) {
  echo '<input type="checkbox" name="calendars[]" value="' . $cal->id . '">' . $cal->summary . '<br>';
}
?>
      </fieldset>
      </div>
      <div id="Photo-Albums">
      <fieldset>
<?php
$photoservice = new Google_Service_PhotosLibrary($client);
$albums = $photoservice->albums->listAlbums();
foreach($albums as $album){
  echo '<input type="radio" name="album" value="' . $album->id . '">' . $album->title . '<br>';
}
$albums = $photoservice->sharedAlbums->listSharedAlbums();
foreach($albums as $album){
  echo '<input type="radio" name="album" value="' . $album->id . '">' . $album->title . '<br>';
}

?>
      </fieldset>
      </div>
      <input type="submit" value="Submit">
    </form>
  </body>
</html>
