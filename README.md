# Status Service Microservice
Service status microservice to receive json formatted requests being sent by a service or application on a remote host. This service will use presistent storage to store all the data being posted. Each service posting to the serivce must create a unique id for the host sending the information. The ideal goal is to run a simple and straight forward service and front-end within a container in an isolated environment.

|Branch|Build Status|Test Coverage|
|---|---|---|
|*Master:*|[![Build Status](https://travis-ci.org/BondAnthony/status-service.svg?branch=master)](https://travis-ci.org/BondAnthony/status-service)|[![Coverage Status](https://coveralls.io/repos/github/BondAnthony/status-service/badge.svg?branch=master)](https://coveralls.io/github/BondAnthony/status-service?branch=master)|
|*Devel:*|[![Build Status](https://travis-ci.org/BondAnthony/status-service.svg?branch=devel)](https://travis-ci.org/BondAnthony/status-service)| [![Coverage Status](https://coveralls.io/repos/github/BondAnthony/status-service/badge.svg?branch=devel)](https://coveralls.io/github/BondAnthony/status-service?branch=devel)|

[Slack #general](http://slack-invite.cfapps.io)

|DOCS|
|----|
|![Development](https://github.com/BondAnthony/status-service/blob/master/docs/development/README.md "Development Docs")|
|![Testing](https://github.com/BondAnthony/status-service/blob/master/docs/testing/README.md "Testing Docs")|
|![Deployment](https://github.com/BondAnthony/status-service/blob/master/docs/deployment/README.md "Deployment Docs")|
|![Getting Started](https://github.com/BondAnthony/status-service/blob/master/docs/getting_started/README.md "Getting Started Docs")|


# Contribute
Please feel free to contribute to the project. All we ask is you follow our standards when developing against this project, visit the [contributing](CONTRIBUTING.md) page.
