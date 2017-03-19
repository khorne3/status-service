FROM node:argon
MAINTAINER ajbond2005@gmail.com

# Create app directory
RUN mkdir -p /usr/srv/app
WORKDIR /usr/srv/app

# Install App
ADD . /usr/srv/app
RUN npm install

# Setup Runtime
ENV PORT 80
EXPOSE 8081

# Start App
CMD ["npm","start"]