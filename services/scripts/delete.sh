# select dev or prod environment
export TARGET=$1
if [ -z $TARGET ]
then
    export TARGET='default'
fi

# delete the api layer
aws --profile $TARGET \
    cloudformation delete-stack \
    --stack-name skiagenda-services

# wait for completion
aws --profile $TARGET cloudformation wait stack-delete-complete \
    --stack-name skiagenda-services
