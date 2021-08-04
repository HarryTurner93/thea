# Thea
A much better designed version of project_thea for the purposes of practicing full stack system design.

# System Requirements

- I have only tested this system on Ubuntu Linux. All instructions are for that target system.
- [Docker](https://docs.docker.com/engine/install/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-linux.html)

# Installation

- Clone this repo with `git clone https://github.com/HarryTurner93/thea.git && cd thea `
- Run `bash start.sh build` to pull and build the containers for the local stack.
- Add (or update) the line `127.0.0.1 localhost localstack` in your `/etc/hosts` file.
- Run `bash start.sh` which starts the system.
- In a separate shell, run `aws s3api create-bucket --bucket images --endpoint-url http://localhost:4566`
- Finally access the front end by going to `http://localhost:3000` in the browser. 

Note that the front end is deployed in production mode, I just map it to 3000 to avoid conflicts on my system.



Create bucket -  aws s3api create-bucket --bucket images --endpoint-url http://localhost:4566



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
Fix mapbox API token.
Deploy whole lot via compose and run on ML2.
Django Tests
Update Call Model in Readme
Add Readme Instructions for installation
All todos throughout code
Lint BE.
ML model trained and deployed into Celery function, then written up.
Deploy entire app to EC2 and verify installation. Produce installation readme.
Final additions to write up.

