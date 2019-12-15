<?php

include "darksky.inc";

header('Content-Type: application/json');

class WeekForecast{
   private $forecast_json;
   private $forecast_php;

   private $location = "41.975,-91.765";

   private $forecast_url;


   function __construct(){ 
      $webservice = new darksky($this->location);
      $this->forecast_url = $webservice->get_url();
      $this->forecast_json = file_get_contents($this->forecast_url);
      $this->forecast_php = json_decode($this->forecast_json);
   }

   function get_results(){
     $results['current']['temperature'] = round($this->forecast_php->currently->temperature);
     $results['current']['pop'] = $this->forecast_php->currently->precipProbability;
     $results['current']['icon'] = $this->forecast_php->currently->icon;
     $results['current']['summary'] = $this->forecast_php->currently->summary;
     $results['current']['windSpeed'] = round($this->forecast_php->currently->windSpeed);
     $results['current']['windBearing'] = $this->forecast_php->currently->windBearing;
     if(isset($this->forecast_php->alerts)){
       $results['current']['alert'] = true;
     }else{
       $results['current']['alert'] = false;
     }

     $results['daily']['summary'] = $this->forecast_php->daily->summary;

     $timeZone = new DateTimeZone($this->forecast_php->timezone);
     foreach($this->forecast_php->daily->data as $day){
       $date = new DateTime("@$day->time");
       $date->setTimezone($timeZone);
       $weekday = $date->format('l');
       $results['daily']['data'][$weekday]['icon'] = $day->icon;
       $results['daily']['data'][$weekday]['pop'] = $day->precipProbability;
       $results['daily']['data'][$weekday]['low'] = round($day->temperatureLow);
       $results['daily']['data'][$weekday]['high'] = round($day->temperatureHigh);
     }

     //Get almanac data from first day in the daily range
     $sunriseTime = new DateTime("@" . $this->forecast_php->daily->data[0]->sunriseTime);
     $sunriseTime->setTimezone($timeZone);
     $sunsetTime = new DateTime("@" . $this->forecast_php->daily->data[0]->sunsetTime);
     $sunsetTime->setTimezone($timeZone);
     $results['almanac']['sunrise'] = $sunriseTime->format("g:i");
     $results['almanac']['sunset'] = $sunsetTime->format("g:i");
     $results['almanac']['moonphase'] = $this->forecast_php->daily->data[0]->moonPhase;

      return json_encode($results);
   }
}

$myForecast = new WeekForecast;
echo $myForecast->get_results();
?>

