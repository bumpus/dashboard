<?php
include "climacell.config.inc";

class climacell{
   private $base_url = BASE_URL;
   private $api_key = CLIMACELL_KEY;
   private $latitude;
   private $longitude;
   private $nowcast_url;
   private $daily_url;
   
   function __construct($search_location){
      $this->location = $search_location;
      $this->service_url = $this->base_url.$this->api_key.'/'.$this->location;
   }

   private function build_nowcast_url(){
     // Start time will be the next whole minute using floor() to throw away the remainder
     $start_time = floor((time()+60)/60) * 60;
     $end_time = $start_time + 60*60; // one hour later
     $this->nowcast_url = $this->base_url . "nowcast"
       . "?lat=" . $this->latitude 
       . "&lon=" . $this->longitude
       . "&unit_system=us&timestep=1"
       . "&start_time=" . date("c", $start_time) // "c" provides an ISO8601 formatted date string
       . "&end_time=" . date("c", $end_time) // "c" provides an ISO8601 formatted date string
       . "&fields=precipitation,temp"
       . "&apikey=" . $this->api_key;
     // Climacell isn't liking the timezone being specified as +00:00 replace with Z instead
     $this->nowcast_url = preg_replace("/\+00:00/", "Z", $this->nowcast_url);
   }

   private function build_daily_url(){
     // Start time will be the current day using floor() to throw away the remainder
     $start_time = floor(time() / (24 * 60 * 60)) * (24 * 60 * 60);
     $end_time = $start_time + (7 * 24 * 60 * 60); // 7 days later
     $this->daily_url = $this->base_url . "forecast/daily"
       . "?lat=" . $this->latitude 
       . "&lon=" . $this->longitude
       . "&unit_system=us"
       . "&start_time=" . date("c", $start_time) // "c" provides an ISO8601 formatted date string
       . "&end_time=" . date("c", $end_time) // "c" provides an ISO8601 formatted date string
       . "&fields=precipitation_probability,temp" // Note that max and min temperatures will be returned for daily forecast
       . "&apikey=" . $this->api_key;
     // Climacell isn't liking the timezone being specified as +00:00 replace with Z instead
     $this->daily_url = preg_replace("/\+00:00/", "Z", $this->daily_url);
   }
}
?>
