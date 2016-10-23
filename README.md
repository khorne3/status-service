# Service Status Microservice
Service status microservice to receive json containing a key value pair. This service will use presistent storage to store all the data being posted. Each service posting to the serivce must create a unique id for the host sending the information. When pushing service updates the service must update instead of creating a new record. 

[![Build Status](https://travis-ci.org/BondAnthony/status-service.svg?branch=master)](https://travis-ci.org/BondAnthony/status-service) [![Coverage Status](https://coveralls.io/repos/github/BondAnthony/status-service/badge.svg?branch=master)](https://coveralls.io/github/BondAnthony/status-service?branch=master) [!Slack #general](http://slack-invite.cfapps.io)

# Install 
Install the service on your local machine by running ```npm install``` to use mocha from command line you will need to run ```npm install -g mocha```.
- You can also install nodemon for development ```npm install -g nodemon```

# Run
Run the application by executing ```npm start``` or ```nodemon server.js```.

# Tests
Execute tests by running ```moch test``` or ```npm test```
Please develop test cases when possible.

# Docs
To create the api docs run ```npm run docs```

# Example Usages
## POST request: GUI debuggers (i.e. Postman)

You would be submitting json objects in the body of the text. You also need to indicate in the headers that the Content-type is of "application/json".
POST - http://localhost:3000/api/status
```
{
   "hostName":"localhost",
   "serviceName":"replication",
   "value":1
}
```

## POST request: Commandline debuggers (i.e. curl)

```bash

curl -H "Content-Type: application/json" -d '{"hostName":"localhost", "serviceName":"replication", "value":1}' http://localhost:3000/api/status

```

## Live Tests

You can run live tests against our development version [HERE](http://status-dev.cfapps.io/). Commits pushed to master will be deployed to this instance.

# Contribute
Please feel free to contribute to the project. All we ask is you follow our standards when developing against this project, visit the [contributing](CONTRIBUTING.md) page.