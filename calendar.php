<?php
require __DIR__ . '/vendor/autoload.php';

$MAX_EVENTS = 15;

if (php_sapi_name() != 'cli') {
    throw new Exception('This application must be run on the command line.');
}

/**
 * Returns an authorized API client.
 * @return Google_Client the authorized client object
 */
function getClient()
{
    $client = new Google_Client();
    $client->setApplicationName('Google Calendar API PHP Quickstart');
    $client->setScopes(Google_Service_Calendar::CALENDAR_READONLY);
    $client->setAuthConfig('credentials.json');
    $client->setAccessType('offline');
    $client->setPrompt('select_account consent');

    // Load previously authorized token from a file, if it exists.
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    $tokenPath = 'token.json';
    if (file_exists($tokenPath)) {
        $accessToken = json_decode(file_get_contents($tokenPath), true);
        $client->setAccessToken($accessToken);
    }

    // If there is no previous token or it's expired.
    if ($client->isAccessTokenExpired()) {
        // Refresh the token if possible, else fetch a new one.
        if ($client->getRefreshToken()) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
        } else {
            // Request authorization from the user.
            $authUrl = $client->createAuthUrl();
            printf("Open the following link in your browser:\n%s\n", $authUrl);
            print 'Enter verification code: ';
            $authCode = trim(fgets(STDIN));

            // Exchange authorization code for an access token.
            $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);
            $client->setAccessToken($accessToken);

            // Check to see if there was an error.
            if (array_key_exists('error', $accessToken)) {
                throw new Exception(join(', ', $accessToken));
            }
        }
        // Save the token to a file.
        if (!file_exists(dirname($tokenPath))) {
            mkdir(dirname($tokenPath), 0700, true);
        }
        file_put_contents($tokenPath, json_encode($client->getAccessToken()));
    }
    return $client;
}

/* sorts two calendar entries Criteria is as follows:
Earlier starting event comes first
All day events come before events on that day at a specific time
Order of events at the same time is event 'a' comes last.
*/
function calendarEntrySort($a, $b){
    //Either date or dateTime will be set.
    //date if it's an all day event, dateTime if it has
    //a specific time.
    if (NULL==$a->start->date){
        $a_start_string = $a->start->dateTime;
    }else{
        $a_start_string = $a->start->date;
    }
    if (NULL==$b->start->date){
        $b_start_string = $b->start->dateTime;
    }else{
        $b_start_string = $b->start->date;
    }

    //Make a dateTime from each string to compare
    $a_dateTime = new dateTime($a_start_string);
    $b_dateTime = new dateTime($b_start_string);
    //Return if the first is bigger than the second.
    return $a_dateTime > $b_dateTime;
}

// Get the API client and construct the service object.
$client = getClient();
$service = new Google_Service_Calendar($client);

$dashboardCalendars =
    [
        "troop33cr@gmail.com",
        "bump.us_9euv403bsp2vrlc8ejht51b3go@group.calendar.google.com",
        "shelley@bump.us",
        "ion14oo8qv5bt4h0vmn2ggmghc@group.calendar.google.com",
        "megan@bump.us",
        "adam@bump.us",
        "nick@bump.us",
        "en.usa#holiday@group.v.calendar.google.com",
        "ht3jlfaac5lfd6263ulfh4tql8@group.calendar.google.com",
        "ncaaf_28_%49owa+%48awkeyes#sports@group.v.calendar.google.com"
    ];
// Print the next 10 events in each calendar.
$optParams = array(
  'maxResults' => $MAX_EVENTS,
  'orderBy' => 'startTime',
  'singleEvents' => true,
  'timeMin' => date('c'),
);

$events = array();

foreach ($dashboardCalendars as $calendarId)
{
    $results = $service->events->listEvents($calendarId, $optParams);
    //Add the color appropriate to this calendar to each object
    $calendarDetails = $service->calendarList->get($calendarId);
    foreach ($results as $result)
    {
        $result['backgroundColor'] = $calendarDetails['backgroundColor'];
        $result['foregroundColor'] = $calendarDetails['foregroundColor'];
    }
    $events = array_merge($events, $results->getItems());
}

usort($events, "calendarEntrySort");
$events = array_slice($events, 0, $MAX_EVENTS);
$json_events = array();
foreach($events as $event) {
    array_push($json_events, array('summary' => $event['summary'],
            'start' => $event['start'],
            'end' => $event['end'],
            'backgroundColor' => $event['backgroundColor'],
            'foregroundColor' => $event['foregroundColor']
        )
    );
    $start = $event->start->dateTime;
    if (empty($start)) {
        $start = $event->start->date;
    }
}

print json_encode($json_events);
