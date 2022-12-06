#!/bin/bash -x

# select dev or prod environment
export TARGET=""
if [ -n "$1" ]
then
    export TARGET="--profile $1"
fi

# create the database
aws \
    cloudformation deploy \
    --capabilities CAPABILITY_IAM \
    --stack-name skiagenda-database \
    --template-file ./database.yaml \
    $TARGET
