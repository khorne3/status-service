#!/bin/bash
set -ev
scode=`curl -s -o /dev/null -w "%{http_code}" http://localhost/api/status`
if [ $scode -ne 200 ]
then
  echo "Status Code: $scode"
  exit 1
fi

if [ "$TRAVIS_BRANCH" == "master" ] && [ "${TRAVIS_PULL_REQUEST}" == "false" ]
then
  docker login -u="$DOCKERU" -p="$DOCKERP";
  docker push $DOCKERU/service-status:latest;
fi

