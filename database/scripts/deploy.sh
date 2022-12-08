#!/bin/bash

# select dev or prod environment using environment variables

export AWS_DEFAULT_REGION=us-east-1

# create the database
aws cloudformation deploy \
    --capabilities CAPABILITY_IAM \
    --stack-name skiagenda-database \
    --template-file ./database.yaml
