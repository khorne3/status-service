# Service Status Microservice
Service status microservice to receive json formatted requests being sent by a service or application on a remote host. This service will use presistent storage to store all the data being posted. Each service posting to the serivce must create a unique id for the host sending the information. The ideal goal is to run a simple and straight forward service and front-end within a container in an isolated environment.

|Branch|Build Status|Test Coverage|
|---|---|---|
|*Master:*|[![Build Status](https://travis-ci.org/BondAnthony/status-service.svg?branch=master)](https://travis-ci.org/BondAnthony/status-service)|[![Coverage Status](https://coveralls.io/repos/github/BondAnthony/status-service/badge.svg?branch=master)](https://coveralls.io/github/BondAnthony/status-service?branch=master)|
|*Devel:*|[![Build Status](https://travis-ci.org/BondAnthony/status-service.svg?branch=devel)](https://travis-ci.org/BondAnthony/status-service)| [![Coverage Status](https://coveralls.io/repos/github/BondAnthony/status-service/badge.svg?branch=devel)](https://coveralls.io/github/BondAnthony/status-service?branch=devel)|

[Slack #general](http://slack-invite.cfapps.io)

# Install
Install the service on your local machine by running ```npm install``` to use mocha from command line you will need to run ```npm install -g mocha```.
- You can also install nodemon for development ```npm install -g nodemon```

# Run
Run the application by executing ```npm start``` or ```nodemon server.js```.

# Docker Build & Run
You can also build and run the service within a docker container.

1. Build the container: `docker build -t $REPO/service-status .`
2. Start the container: `docker run -d -p 8081:80 bondanthony/service-status`
3. Access the endpoint: http://dockerhost:8081/

# Tests
Execute tests by running ```mocha test``` or ```npm test```
Please develop test cases when possible.
- Test cases are broken down by api or front-end subject areas.
# Docs
To create the api docs run ```npm run docs```

# Use a docker container as independent datastore

Run a docker container to setup a independent datastore (with [MongoDB](https://www.mongodb.com)) which could be deployed separate from the UI and service.

### Before start:

- install docker ([official documentation](https://docs.docker.com/engine/installation/))

### Normal usage:

- `cd database && docker-compose up` to start the container
- `cd database && docker-compose stop` to stop the container

### How to access it manually:

If you want to access to the mongo container start it and then run:

`docker exec -it CONTAINER_ID mongo admin`

where `CONTAINER_ID` is the container's identifier, you can find it with this command `docker ps`.

More details at the [official documentation](https://github.com/docker-library/docs/tree/master/mongo).

# Example Usages
## POST request: GUI debuggers (i.e. Postman)

You would be submitting json objects in the body of the text. You also need to indicate in the headers that the Content-type is of "application/json".
POST - http://localhost:3000/api/status
```
{
  "host": "nyc010.domain.com",
  "services": [
    {
      "name": "brickyard api",
      "is_online": 1,
      "update_at": "2014-11-14T16:36:31Z",
      "mesg": "System Online: Average response 200ms"
    },
    {
      "name": "ords",
      "is_online": 1,
      "update_at": "2014-11-14T16:36:31Z",
      "mesg": "Oracle REST is open for business"
    }
  ]
}
```

## POST request: Commandline debuggers (i.e. curl)

```bash

curl -H "Content-Type: application/json" -d '{"host": "nyc010.domain.com","services": [{"name": "brickyard api","is_online": 1,"update_at": "2014-11-14T16:36:31Z","mesg": "System Online: Average response 200ms"},{"name": "ords","is_online": 1,"update_at": "2014-11-14T16:36:31Z","mesg":"Oracle REST is open for business"}]}' http://localhost:3000/api/status

```

## Live Tests

You can run live tests against our development version [HERE](http://status-dev.cfapps.io/). Commits pushed to master will be deployed to this instance.

# Contribute
Please feel free to contribute to the project. All we ask is you follow our standards when developing against this project, visit the [contributing](CONTRIBUTING.md) page.