#!/bin/bash

# select dev or prod environment
export TARGET=""
if [ -n "$1" ]
then
    export TARGET="--profile $1"
fi

# backup the database content
aws dynamodb create-backup \
    --table-name Reservations \
    --backup-name reservations-backup \
    $TARGET
