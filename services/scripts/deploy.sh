# select dev or prod environment
export TARGET=$1
if [ -z $TARGET ]
then
    export TARGET='default'
fi

pushd .
    cd ../src 
    pushd .
        cd holidays
        npm install
        zip -r holidays.zip .
        aws s3 cp holidays.zip s3://skiagenda-rawdata/services/holidays.zip
    popd
    pushd .
        cd reservations
        npm install
        zip -r reservations.zip .
        aws s3 cp reservations.zip s3://skiagenda-rawdata/services/reservations.zip
    popd
popd

# create the api layer
aws --profile $TARGET \
    cloudformation deploy \
    --capabilities CAPABILITY_IAM \
    --stack-name skiagenda-services \
    --template-file ./services.yaml 

## add lambdas forced refresh
aws lambda update-function-code --function-name AddReservationFunction --s3-bucket skiagenda-rawdata --s3-key services/reservations.zip
aws lambda update-function-code --function-name UpdateReservationFunction --s3-bucket skiagenda-rawdata --s3-key services/reservations.zip
aws lambda update-function-code --function-name DeleteReservationFunction --s3-bucket skiagenda-rawdata --s3-key services/reservations.zip
aws lambda update-function-code --function-name ListReservationsFunction --s3-bucket skiagenda-rawdata --s3-key services/reservations.zip
aws lambda update-function-code --function-name RefreshHolidaysFunction --s3-bucket skiagenda-rawdata --s3-key services/holidays.zip
aws lambda update-function-code --function-name ListHolidaysFunction --s3-bucket skiagenda-rawdata --s3-key services/holidays.zip

## extract output variables
export apiURL=`aws cloudformation describe-stacks --stack-name skiagenda-services  --query "Stacks[0].Outputs[?OutputKey=='apiURL'].OutputValue" --output text`
export userPoolId=`aws cloudformation describe-stacks --stack-name skiagenda-services  --query "Stacks[0].Outputs[?OutputKey=='userPoolId'].OutputValue" --output text`
export userPollClientId=`aws cloudformation describe-stacks --stack-name skiagenda-services  --query "Stacks[0].Outputs[?OutputKey=='userPollClientId'].OutputValue" --output text`
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