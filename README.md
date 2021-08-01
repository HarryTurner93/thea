# project_thea_revamped
A much better designed version of project_thea for the purposes of practicing full stack system design.

First time
bash start.sh
Starts the API, starts postgres, starts S3 (localstack)
Create bucket -  aws s3api create-bucket --bucket images --endpoint-url http://localhost:4566
Add localstack to hosts under 127.0.0.1 so the front end can resolve it.
aws --endpoint-url http://localhost:4566 s3api put-bucket-cors --bucket images --cors-configuration file://s3_cors.json
aws --endpoint-url http://localhost:4566 s3api put-bucket-acl --bucket images --acl public-read


Useful commands.
See buckets - aws s3api list-buckets --endpoint-url http://localhost:4566

# Todo
 - All todos throughout code
 - Lint BE.
 - ML model trained and deployed into Celery function, then written up.
 - Deploy entire app to EC2 and verify installation. Produce installation readme.
 - Final additions to write up.
