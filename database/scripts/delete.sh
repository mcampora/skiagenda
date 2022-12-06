#!/bin/bash

# select dev or prod environment
export TARGET=""
if [ -n "$1" ]
then
    export TARGET="--profile $1"
fi

# delete the database
aws cloudformation delete-stack \
    --stack-name skiagenda-database \
    $TARGET

# wait for completion
aws cloudformation wait stack-delete-complete \
    --stack-name skiagenda-database \
    $TARGET
