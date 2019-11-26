<?php
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . 'config.inc';

$MAX_EVENTS = 30;

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

$service = new Google_Service_Calendar($client);

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
