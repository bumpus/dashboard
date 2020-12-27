<?php

include "climacell.inc";
include "nws-alert.inc";

header('Content-Type: application/json');

class WeekForecast{
  private $forecast;
  private $webservice;
  private $nws_alerts;

  private $latitude = 41.975;
  private $longitude = -91.765;
  private $timeZone = "America/Chicago";

  private $forecast_url;


  function __construct(){ 
    $this->webservice = new climacell($this->latitude, $this->longitude);
    $this->forecast = $this->webservice->get_data();
    $this->nws_alerts = get_alerts($this->latitude, $this->longitude);
  }

  private function convertToF($celsius)
  {
    return round((1.8*$celsius)+32);
  }

  private function convertToM($kilometer)
  {
    return round($kilometer/1.609);
  }

  function get_results(){
    //var_dump($this->forecast);
    $results['current']['temperature'] =              $this->convertToF($this->forecast['current']->values->temperature);
    $results['current']['feels_like']  =              $this->convertToF($this->forecast['current']->values->temperatureApparent);
    $results['current']['pop']         =                          round($this->forecast['current']->values->precipitationProbability/100,2);
    $results['current']['icon']        = $this->webservice->getIconName($this->forecast['current']->values->weatherCode);
    $results['current']['windSpeed']   =              $this->convertToM($this->forecast['current']->values->windSpeed);
    $results['current']['windBearing'] =                          round($this->forecast['current']->values->windDirection);

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
      $date = new DateTime($day->startTime);
      $date->setTimezone($timeZone);
      $weekday = $date->format('l');

      //Check if this weekday is already present in the array.
      //That might be the case if the  1st day and the last day are the
      //same day of the week e.g. 1 week forecast is Sunday to Sunday, or perhaps
      //the daily forecast goes out more than one week.
      //If that's the case I only want the first one.
      if (!array_key_exists($weekday, $results['daily']['data'])){
        $results['daily']['data'][$weekday]['icon'] = $this->webservice->getIconName($day->values->weatherCode);
        $results['daily']['data'][$weekday]['pop']  =                          round($day->values->precipitationProbability/100,2);
        $results['daily']['data'][$weekday]['low']  =              $this->convertToF($day->values->temperatureMin);
        $results['daily']['data'][$weekday]['high'] =              $this->convertToF($day->values->temperatureMax);
      }
    }

    //Get almanac data from today's information
    $sunriseTime = new DateTime($this->forecast['daily'][0]->values->sunriseTime);
    $sunriseTime->setTimezone($timeZone);
    $sunsetTime = new DateTime($this->forecast['daily'][0]->values->sunsetTime);
    $sunsetTime->setTimezone($timeZone);
    $results['almanac']['sunrise'] = $sunriseTime->format("U");
    $results['almanac']['sunset'] = $sunsetTime->format("U");
    $results['almanac']['moonphase'] = $this->forecast['daily'][0]->values->moonPhase;

    return json_encode($results);
  }
}

$myForecast = new WeekForecast;
echo $myForecast->get_results();
echo "\n"
?>
