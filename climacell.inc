<?php
include "climacell.config.inc";

class climacell{
   private $base_url = BASE_URL;
   private $api_key = CLIMACELL_KEY;
   private $latitude;
   private $longitude;
   private $realtime_url;
   private $daily_url;
   private $data;
   
   function __construct($lat,$long){
      $this->latitude = $lat;
      $this->longitude = $long;
      $this->build_daily_url();
      $this->build_realtime_url();
      $this->fetch_data();
   }

   private function build_realtime_url(){
       $this->realtime_url = $this->base_url . "realtime"
         . "?lat=" . $this->latitude 
         . "&lon=" . $this->longitude
         . "&unit_system=us"
         . "&fields=temp,precipitation,weather_code,wind_speed,wind_direction,sunrise,sunset,moon_phase"
         . "&apikey=" . $this->api_key;
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
       . "&fields=precipitation_probability,temp,weather_code" // Note that max and min temperatures will be returned for daily forecast
       . "&apikey=" . $this->api_key;
     // Climacell isn't liking the timezone being specified as +00:00 replace with Z instead
     $this->daily_url = preg_replace("/\+00:00/", "Z", $this->daily_url);
   }

   private function fetch_data(){
       $this->data['current'] = json_decode(file_get_contents($this->realtime_url));
       $this->data['daily'] = json_decode(file_get_contents($this->daily_url));
   }

   function get_data(){
       return $this->data;
   }
}

?>
