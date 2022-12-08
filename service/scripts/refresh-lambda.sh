#!/bin/bash

# select dev or prod environment using environment variables and parameter
export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-'us-east-1'}
export BUCKET_NAME=${3:-'skiagenda-source-test'}

PACKAGE=${1:-'holidays'}
FUNCTION=${2:-'ListHolidaysFunction'}
aws lambda update-function-code --function-name ${FUNCTION} --s3-bucket ${BUCKET_NAME} --s3-key services/${PACKAGE}.zip
