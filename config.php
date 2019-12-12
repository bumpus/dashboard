
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
  <head>
    <title>Bump.us Dashboard - Configuration - <?php echo $user_email; ?></title>
    <style>
body {
  background : lightcyan;
}
    </style>
  </head>
  <body>
<?php
if (isset($_POST['calendars']) || isset($_POST['album'])){
  $docref = $firestore->collection('settings')->document($user_email);
  if (isset($_POST['calendars'])){
    echo "<h2>Calendars</h2>";
    echo htmlspecialchars(print_r($_POST['calendars'], true));
    $calendars = array();
    foreach ($_POST['calendars'] as $selectedcalendar){
      $calendars[] = $selectedcalendar;
    }
    $docref->set(['calendars' => $calendars], ['merge' => true]);
  }
  if (isset($_POST['album'])){
    echo "<h2>Album</h2>";
    echo htmlspecialchars(print_r($_POST['album'], true));
    $docref->set(['album' => $_POST['album']], ['merge' => true]);
  }
  echo "<h1>Updated Settings</h1>";
}
else{
  echo '<form action="config.php" method="post">';
  echo '<div id="Calendars">';
  echo '<fieldset>';
  //At this point, there should be a valid logged in google client
  // Create a calendar object
  $calendarservice = new Google_Service_Calendar($client);
  $cals = $calendarservice->calendarList->listCalendarList();
  echo '<div class="list_heading">Calendars for '  . $user_email . '</div>';
  foreach($cals as $cal) {
    echo '<input type="checkbox" name="calendars[]" value="' . $cal->id . '">' . $cal->summary . '<br>';
  }
  echo '</fieldset>';
  echo '</div>';
  echo '<div id="Photo-Albums">';
  echo '<fieldset>';
  $photoservice = new Google_Service_PhotosLibrary($client);
  $albums = $photoservice->albums->listAlbums();
  echo '<div class="list_heading">Photo Albums for ' . $user_email . '</div>';
  foreach($albums as $album){
    echo '<input type="radio" name="album" value="' . $album->id . '">' . $album->title . '<br>';
  }
  $albums = $photoservice->sharedAlbums->listSharedAlbums();
  foreach($albums as $album){
    echo '<input type="radio" name="album" value="' . $album->id . '">' . $album->title . '<br>';
  }

  echo '</fieldset>';
  echo '</div>';
  echo '<input type="submit" value="Submit">';
  echo '</form>';
}
?>
  </body>
</html>
