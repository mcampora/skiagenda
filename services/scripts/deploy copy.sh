# select dev or prod environment
export TARGET=$1
export BUCKET_NAME='skiagenda-source'
if [ -z $TARGET ]
then
    export TARGET='default'
    export BUCKET_NAME='skiagenda-source-test'
fi

aws --profile $TARGET s3 mb s3://$BUCKET_NAME
pushd .
    cd ../src 
    pushd .
        cd holidays
        npm install
        zip -r holidays.zip .
        aws --profile $TARGET s3 cp holidays.zip s3://$BUCKET_NAME/services/holidays.zip
    popd
    pushd .
        cd reservations
        npm install
        zip -r reservations.zip .
        aws --profile $TARGET s3 cp reservations.zip s3://$BUCKET_NAME/services/reservations.zip
    popd
popd

# create the api layer
aws --profile $TARGET \
    cloudformation deploy \
    --capabilities CAPABILITY_IAM \
    --stack-name skiagenda-services \
    --template-file ./services.yaml \
    --parameter-overrides SourceBucketName=$BUCKET_NAME


## add lambdas forced refresh
aws --profile $TARGET lambda update-function-code --function-name AddReservationFunction --s3-bucket $BUCKET_NAME --s3-key services/reservations.zip
aws --profile $TARGET lambda update-function-code --function-name UpdateReservationFunction --s3-bucket $BUCKET_NAME --s3-key services/reservations.zip
aws --profile $TARGET lambda update-function-code --function-name DeleteReservationFunction --s3-bucket $BUCKET_NAME --s3-key services/reservations.zip
aws --profile $TARGET lambda update-function-code --function-name ListReservationsFunction --s3-bucket $BUCKET_NAME --s3-key services/reservations.zip
aws --profile $TARGET lambda update-function-code --function-name RefreshHolidaysFunction --s3-bucket $BUCKET_NAME --s3-key services/holidays.zip
aws --profile $TARGET lambda update-function-code --function-name ListHolidaysFunction --s3-bucket $BUCKET_NAME --s3-key services/holidays.zip

## extract output variables
export apiURL=`aws --profile $TARGET cloudformation describe-stacks --stack-name skiagenda-services  --query "Stacks[0].Outputs[?OutputKey=='apiURL'].OutputValue" --output text`
export userPoolId=`aws --profile $TARGET cloudformation describe-stacks --stack-name skiagenda-services  --query "Stacks[0].Outputs[?OutputKey=='userPoolId'].OutputValue" --output text`
export userPollClientId=`aws --profile $TARGET cloudformation describe-stacks --stack-name skiagenda-services  --query "Stacks[0].Outputs[?OutputKey=='userPollClientId'].OutputValue" --output text`
echo "var _config = {
    cognito: { 
        userPoolId: '$userPoolId', // patched
        userPoolClientId: '$userPollClientId', 
        region: 'us-east-1', 
    },
    api: {
        invokeUrl: '$apiURL',
    }
};" > ../src/client/config.js