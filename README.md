#install the google api client library and dependencies
composer require google/apiclient:^2.0

#install the cloud firestore library, gRPC and protobuf to allow firestore storage of PHP session
composer require google/cloud-firestore
composer require "grpc/grpc:^v1.1.0"
composer require "google/protobuf:^v3.3.0"

#get your credentials.json file from the google api page
#
#configure API key for dark sky. Add this info to darksky.inc using darksky.inc.template as a template
