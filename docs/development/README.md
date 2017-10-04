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


