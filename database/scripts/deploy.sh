# select dev or prod environment
export TARGET=$1
if [ -z $TARGET ]
then
    export TARGET='default'
fi

# create the database
aws --profile $TARGET \
    cloudformation deploy \
    --capabilities CAPABILITY_IAM \
    --stack-name skiagenda-database \
    --template-file ./database.yaml 
