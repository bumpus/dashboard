<?php

define("NWS_ALERT_URL", "https://api.weather.gov/alerts?active=true&point=");

function get_alerts($lat, $long){
    $opts = [
    "http" => [
        "method" => "GET",
        "header" => "user-agent: Bump.us Dashboard/v3.1415927 (adam@bump.us)"
    ]
];

$context = stream_context_create($opts);
    return json_decode(file_get_contents(NWS_ALERT_URL.$lat.",".$long, false, $context));
}

?>