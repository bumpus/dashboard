<?php

define("CDC_COUNTY_DATA", "https://covid.cdc.gov/covid-data-tracker/COVIDData/getAjaxData?id=integrated_county_timeseries_fips_19113_external");
define("LINN_COUNTY_POPULATION", 226706);

function cmp($a, $b) {
  //sort for newest date first
  return -1 * strcmp($a->date, $b->date);
}


function get_covid(){
  $opts = [
    "http" => [
      "method" => "GET",
      "header" => "user-agent: Bump.us Dashboard/v3.1415927 (adam@bump.us)"
    ]
  ];

  $context = stream_context_create($opts);
  $data = json_decode(file_get_contents(CDC_COUNTY_DATA, false, $context));
  usort($data->integrated_county_timeseries_external_data, "cmp");
  $output = array(
    'cases' => NULL,
    'admissions' => NULL,
    'beds' => NULL
  );

  foreach($data->integrated_county_timeseries_external_data as $day)
  {
    if($output['cases'] == NULL && $day->new_cases_7_day_rolling_average != NULL){
      $output['cases'] = round(($day->new_cases_7_day_rolling_average*7)/(LINN_COUNTY_POPULATION/100000));
    }
    if($output['admissions'] == NULL && $day->admissions_covid_confirmed_last_7_days_per_100k_population!= NULL){
      $output['admissions'] = $day->admissions_covid_confirmed_last_7_days_per_100k_population;
    }
    if($output['beds'] == NULL && $day->percent_adult_inpatient_beds_used_confirmed_covid != NULL){
      $output['beds'] = round($day->percent_adult_inpatient_beds_used_confirmed_covid, 1);
    }
    if ( $output['cases'] != NULL &&
         $output['admissions'] != NULL &&
         $output['beds'] != NULL)
    {
      break;
    }
  }

  if ($output['cases'] < 200){
    if (($output['admissions'] < 10) && ($output['beds'] < 10)){
      $output['community'] = "low";
    } else if (($output['admissions'] < 20) && ($output['beds'] < 15)){
      $output['community'] = "medium";
    } else {
      $output['community'] = "high";
    }
  } else {
    if (($output['admissions'] < 10) && ($output['beds'] < 10)){
      $output['community'] = "medium";
    } else {
      $output['community'] = "high";
    }
  }

  return json_encode($output);
}

print(get_covid());
?>

