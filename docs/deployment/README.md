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

