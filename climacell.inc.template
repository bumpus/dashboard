<?php
class darksky{
   private $base_url = "https://api.darksky.net/forecast/";
   private $api_key = "INSERT_KEY_HERE";
   private $exclude = "?exclude=minutely,hourly";
   private $location;
   private $service_url;
   
   function __construct($search_location){
      $this->location = $search_location;
      $this->service_url = $this->base_url.$this->api_key.'/'.$this->location.$this->exclude;
   }

   function get_url(){
      return $this->service_url;
   }

}
?>
