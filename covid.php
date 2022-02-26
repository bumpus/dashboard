<?php

define("CDC_COUNTY_DATA", "https://covid.cdc.gov/covid-data-tracker/COVIDData/getAjaxData?id=integrated_county_timeseries_fips_19113_external");
define("LINN_COUNTY_POPULATION", 226706);

function cmp($a, $b) {
  return strcmp($a->date, $b->date);
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
  $i = count($data->integrated_county_timeseries_external_data) - 1;
  $output = array(
    'cases' => NULL,
    'positivity' => NULL,
    'transmission' => NULL,
    'admissions' => NULL,
    'beds' => NULL
  );

  while (
    $output['cases'] == NULL ||
    $output['positivity'] == NULL ||
    $output['transmission'] == NULL ||
    $output['admissions'] == NULL ||
    $output['beds'] == NULL
  )
  {
    if($output['cases'] == NULL && $data->integrated_county_timeseries_external_data[$i]->new_cases_7_day_rolling_average != NULL){
      $output['cases'] = round(($data->integrated_county_timeseries_external_data[$i]->new_cases_7_day_rolling_average*7)/(LINN_COUNTY_POPULATION/100000));
    }
    if($output['positivity'] == NULL && $data->integrated_county_timeseries_external_data[$i]->percent_positive_7_day != NULL){
      $output['positivity'] = round($data->integrated_county_timeseries_external_data[$i]->percent_positive_7_day, 1);
    }
    if($output['transmission'] == NULL && $data->integrated_county_timeseries_external_data[$i]->community_transmission_level != NULL){
      $output['transmission'] = $data->integrated_county_timeseries_external_data[$i]->community_transmission_level;
    }
    if($output['admissions'] == NULL && $data->integrated_county_timeseries_external_data[$i]->admissions_covid_confirmed_7_day_rolling_average != NULL){
      $output['admissions'] = round(($data->integrated_county_timeseries_external_data[$i]->admissions_covid_confirmed_7_day_rolling_average*7)/(LINN_COUNTY_POPULATION/100000), 1);
    }
    if($output['beds'] == NULL && $data->integrated_county_timeseries_external_data[$i]->percent_adult_inpatient_beds_used_confirmed_covid != NULL){
      $output['beds'] = round($data->integrated_county_timeseries_external_data[$i]->percent_adult_inpatient_beds_used_confirmed_covid, 1);
    }
    $i--;
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

