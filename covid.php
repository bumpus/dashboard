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
  while (
    $data->integrated_county_timeseries_external_data[$i]->new_cases_7_day_rolling_average == NULL ||
    $data->integrated_county_timeseries_external_data[$i]->percent_positive_7_day == NULL ||
    $data->integrated_county_timeseries_external_data[$i]->community_transmission_level == NULL
  )
  {
    $i--;
  }
  return json_encode(array(
    'cases' => round(($data->integrated_county_timeseries_external_data[$i]->new_cases_7_day_rolling_average*7)/(LINN_COUNTY_POPULATION/100000)),
    'positivity' => round($data->integrated_county_timeseries_external_data[$i]->percent_positive_7_day, 1),
    'level' => $data->integrated_county_timeseries_external_data[$i]->community_transmission_level,
    'date' => $data->integrated_county_timeseries_external_data[$i]->date
  ));
}

print(get_covid());
?>
