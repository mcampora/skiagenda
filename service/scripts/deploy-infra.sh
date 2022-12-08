#!/bin/bash

# select dev or prod environment using environment variables and parameter
export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-'us-east-1'}
export BUCKET_NAME=${1:-'skiagenda-source-test'}

# install or refresh common resources
aws s3 mb s3://${BUCKET_NAME}
aws cloudformation deploy \
    --capabilities CAPABILITY_IAM \
    --stack-name skiagenda-services \
    --template-file ./services.yaml \
    --parameter-overrides SourceBucketName=${BUCKET_NAME}
