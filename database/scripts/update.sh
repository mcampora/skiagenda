# select dev or prod environment
export TARGET=$1
if [ -z $TARGET ]
then
    export TARGET='default'
fi

# update the database
aws --profile $TARGET \
    cloudformation update-stack \
    --capabilities CAPABILITY_IAM \
    --stack-name skiagenda-database \
    --template-body file://database.yaml

# wait for completion
aws cloudformation wait stack-update-complete \
    --stack-name skiagenda-database
