# select dev or prod environment
export TARGET=$1
if [ -z $TARGET ]
then
    export TARGET='default'
fi

# delete the database
aws --profile $TARGET \
    cloudformation delete-stack \
    --stack-name skiagenda-database

# wait for completion
aws cloudformation wait stack-delete-complete \
    --stack-name skiagenda-database
