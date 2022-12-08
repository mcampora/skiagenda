#!/bin/bash

# select dev or prod environment using environment variables and parameter
export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-'us-east-1'}
export BUCKET_NAME=${2:-'skiagenda-source-test'}

# deploy the artefact and refresh the functions
PACKAGE=${1:=holidays}
pushd ../packages/${PACKAGE}
npm run zip
popd
aws s3 cp ../build/${PACKAGE}.zip s3://${BUCKET_NAME}/services/
