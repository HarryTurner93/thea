# Thea
A much better designed version of project_thea for the purposes of practicing full stack system design.

# Installation
First time
bash start.sh
Starts the API, starts postgres, starts S3 (localstack)
Create bucket -  aws s3api create-bucket --bucket images --endpoint-url http://localhost:4566
Add localstack to hosts under 127.0.0.1 so the front end can resolve it.
aws --endpoint-url http://localhost:4566 s3api put-bucket-cors --bucket images --cors-configuration file://s3_cors.json
aws --endpoint-url http://localhost:4566 s3api put-bucket-acl --bucket images --acl public-read


# Useful Commands
See buckets - aws s3api list-buckets --endpoint-url http://localhost:4566

# ML
Download from here.
https://drive.google.com/file/d/1UUwsKd064Pw1cCk-CFPV8RR1igBkM5Df/view?usp=sharing
Put in api/model directory.

# Backend

Lint
Start the backend.
`docker exec -ti infrastructure_api_1 /bin/bash`
`flake8`

# Frontend
 Lint
 bash lint.sh inside FE.

## Todo
Django Tests
Update Call Model in Readme
Add Readme Instructions for installation
