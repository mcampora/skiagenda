# select dev or prod environment
export TARGET=$1
if [ -z $TARGET ]
then
    export TARGET='default'
fi

# delete the database
aws --profile $TARGET \
    dynamodb create-backup \
    --table-name Reservations \
    --backup-name reservations-backup
