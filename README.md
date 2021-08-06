# Thea
An ML backed camera trap image processing system for managing and analysing camera trap images. For details on how this system was designed and built, see the [Design Document](https://github.com/HarryTurner93/thea/blob/main/DESIGN.md)

### [See Demo (youtube)](https://www.youtube.com/watch?v=5tgIaj8bbSA)

## System Requirements

- I have only tested this system on Ubuntu Linux. All instructions are for that target system.
- Install [Docker](https://docs.docker.com/engine/install/)
- Install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-linux.html)

## Installation

- Clone this repo with `git clone https://github.com/HarryTurner93/thea.git && cd thea `
- Download the model from [here](https://drive.google.com/file/d/1UUwsKd064Pw1cCk-CFPV8RR1igBkM5Df/view?usp=sharing) and place it into the `api/model/` directory.
- Run `bash start.sh build` to pull and build the containers for the local stack.
- Add (or update) the line `127.0.0.1 localhost localstack` in your `/etc/hosts` file.
- Run `bash start.sh` which starts the system.
- Run `aws s3api create-bucket --bucket images --endpoint-url http://localhost:4566`
- Finally access the front end by going to `http://localhost:3000` in the browser. 
- To run tests, first `cd` into the `frontend` directory then run `npx cypress run`. Note this requires `npm` to be installed.

#### Stop the System
 - From the top level directory run `docker-compose -f infrastructure/docker-compose.yml down`

Note that the front end is deployed in production mode, I just map it to 3000 to avoid conflicts on my system.
