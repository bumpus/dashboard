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
     if(isset($this->forecast_php->alerts)){
       $results['current']['alert'] = true;
     }else{
       $results['current']['alert'] = false;
     }

     $results['daily']['summary'] = $this->forecast_php->daily->summary;

     $timezone = "America/Chicago";
     foreach($this->forecast_php->daily->data as $day){
       $date = new DateTime("@$day->time");
       $date->setTimezone(new DateTimeZone($timezone));
       $weekday = $date->format('l');
       $results['daily']['data'][$weekday]['icon'] = $day->icon;
       $results['daily']['data'][$weekday]['pop'] = $day->precipProbability;
       $results['daily']['data'][$weekday]['low'] = round($day->temperatureLow);
       $results['daily']['data'][$weekday]['high'] = round($day->temperatureHigh);
     }

      return json_encode($results);
   }
}

$myForecast = new WeekForecast;
echo $myForecast->get_results();
?>

