<?php
include "tomorrow_io.config.inc";

class tomorrow_io{
  private $base_url = BASE_URL;
  private $api_key = TOMORROW_IO_KEY;
  private $latitude;
  private $longitude;
  private $url;
  private $data;

  function __construct($lat,$long){
    $this->latitude = $lat;
    $this->longitude = $long;
    $this->build_url();
    $this->fetch_data();
  }
  private function build_url(){
    $this->url = $this->base_url . "timelines"
      . "?location=" . $this->latitude . "," . $this->longitude
      . "&fields=temperature,precipitationProbability,weatherCode,temperatureApparent,windSpeed,windDirection,sunriseTime,sunsetTime,moonPhase,temperatureMin,temperatureMax"
      ."&timesteps=1d,1m"
      . "&apikey=" . $this->api_key;
  }

  private function fetch_data(){
    $this->data = json_decode(file_get_contents($this->url));
  }

  public function getIconName($id)
  {
    $ret = "unknown";
    switch($id)
    {
      case 1000: $ret = "clear"; break;
      case 1001: $ret = "cloudy"; break;
      case 1100: $ret = "mostly_clear"; break;
      case 1101: $ret = "partly_cloudy"; break;
      case 1102: $ret = "mostly_cloudy"; break;
      case 2000: $ret = "fog"; break;
      case 2100: $ret = "fog_light"; break;
      case 3000: $ret = "wind_light"; break;
      case 3001: $ret = "wind"; break;
      case 3002: $ret = "strong_wind"; break;
      case 4000: $ret = "drizzle"; break;
      case 4001: $ret = "rain"; break;
      case 4200: $ret = "rain_light"; break;
      case 4201: $ret = "rain_heavy"; break;
      case 5000: $ret = "snow"; break;
      case 5001: $ret = "flurries"; break;
      case 5100: $ret = "snow_light"; break;
      case 5101: $ret = "snow_heavy"; break;
      case 6000: $ret = "freezing_drizzle"; break;
      case 6001: $ret = "freezing_rain"; break;
      case 6200: $ret = "freezing_rain_light"; break;
      case 6201: $ret = "freezing_rain_heavy"; break;
      case 7000: $ret = "ice_pellets"; break;
      case 7101: $ret = "ice_pellets_heavy"; break;
      case 7102: $ret = "ice_pellets_light"; break;
      case 8000: $ret = "thunderstorm"; break;
      default: $ret = "unknown"; break;
    }
    return $ret;
  }

  function get_data(){
    $timeline_count = count($this->data->data->timelines);
    $minute_index = 0;
    $day_index = 0;

    for ($i=0; $i<$timeline_count; $i++) {
      if ($this->data->data->timelines[$i]->timestep == "1m") {
        $minute_index = $i;
      }
      if ($this->data->data->timelines[$i]->timestep == "1d") {
        $day_index = $i;
      }
    }

    return(array('current'=> $this->data->data->timelines[$minute_index]->intervals[0],
                 'daily'  => array_slice($this->data->data->timelines[$day_index]->intervals,0,7)));
    //return $this->data;
   }
}

?>
