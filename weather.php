<?php

include "climacell.inc";
include "nws-alert.inc";

header('Content-Type: application/json');

class WeekForecast{
  private $forecast;
  private $nws_alerts;

  private $latitude = 41.975;
  private $longitude = -91.765;
  private $timeZone = "America/Chicago";

  private $forecast_url;


  function __construct(){ 
    $webservice = new climacell($this->latitude, $this->longitude);
    $this->forecast = $webservice->get_data();
    $this->nws_alerts = get_alerts($this->latitude, $this->longitude);
  }

  function get_results(){
    $results['current']['temperature'] = round($this->forecast['current']->temp->value);
    $results['current']['pop'] = $this->forecast['daily'][0]->precipitation_probability->value/100;
    $results['current']['icon'] = $this->forecast['current']->weather_code->value;
    $results['current']['windSpeed'] = round($this->forecast['current']->wind_speed->value);
    $results['current']['windBearing'] = round($this->forecast['current']->wind_direction->value);

    $results['current']['alerts'] = count($this->nws_alerts->features);
    if(0 != $results['current']['alerts']){
      // Get the title of the first alert. There may be more than one, but I'm only going to display the 1st
      $results['current']['alertTitle'] = $this->nws_alerts->features[0]->properties->event;
    }
     // Create an empty array to store data for each day in.
     // Explicitly creating this as an empty array prevents
     // warnings when using array_key_exists()
     $results['daily']['data'] = array();

    $timeZone = new DateTimeZone($this->timeZone);
    foreach($this->forecast['daily'] as $day){
      $date = new DateTime($day->observation_time->value);
      $date->setTimezone($timeZone);
      $weekday = $date->format('l');

      //Check if this weekday is already present in the array.
      //That might be the case if the  1st day and the last day are the
      //same day of the week e.g. 1 week forecast is Sunday to Sunday, or perhaps
      //the daily forecast goes out more than one week.
      //If that's the case I only want the first one.
    if (!array_key_exists($weekday, $results['daily']['data'])){
        $results['daily']['data'][$weekday]['icon'] = $day->weather_code->value;
        $results['daily']['data'][$weekday]['pop'] = $day->precipitation_probability->value/100;
        $results['daily']['data'][$weekday]['low'] = round($day->temp[0]->min->value);
        $results['daily']['data'][$weekday]['high'] = round($day->temp[1]->max->value);
      }
    }

    //Get almanac data from reatime information
    $sunriseTime = new DateTime($this->forecast['current']->sunrise->value);
    $sunriseTime->setTimezone($timeZone);
    $sunsetTime = new DateTime($this->forecast['current']->sunset->value);
    $sunsetTime->setTimezone($timeZone);
    $results['almanac']['sunrise'] = $sunriseTime->format("g:i A");
    $results['almanac']['sunset'] = $sunsetTime->format("g:i A");
    $results['almanac']['moonphase'] = $this->forecast['current']->moon_phase->value;

    return json_encode($results);
  }
}

$myForecast = new WeekForecast;
echo $myForecast->get_results();
echo "\n"
?>