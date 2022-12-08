#!/bin/bash

# select dev or prod environment using environment variables and parameter
export AWS_DEFAULT_REGION=us-east-1
export BUCKET_NAME='skiagenda-source-test'

# install or refresh common resources
deploy_infra() {
    aws s3 mb s3://${BUCKET_NAME}
    aws cloudformation deploy \
        --capabilities CAPABILITY_IAM \
        --stack-name skiagenda-services \
        --template-file ./services.yaml \
        --parameter-overrides SourceBucketName=${BUCKET_NAME}
}

# launch a clean build, check the tests
build_package() {
    PACKAGE=${1}
    pushd ../packages/${PACKAGE}
    npm run clean
    npm install
    npm run test
    popd
}

# deploy the artefact and refresh the functions
deploy_package() {
    PACKAGE=${1}
    pushd ../packages/${PACKAGE}
    npm run zip
    aws s3 cp ../../build/${PACKAGE}.zip s3://${BUCKET_NAME}/services/
    popd
}

refresh_lambda() {
    PACKAGE=${1}
    FUNCTION=${2}
    aws lambda update-function-code --function-name ${FUNCTION} --s3-bucket ${BUCKET_NAME} --s3-key services/${PACKAGE}.zip
}

deploy_infra

build_package 'holidays'
deploy_package 'holidays'
refresh_lambda 'holidays' 'RefreshHolidaysFunction'
refresh_lambda 'holidays' 'ListHolidaysFunction'

build_package 'reservations'
deploy_package 'reservations'
refresh_lambda 'reservations' 'AddReservationFunction'
refresh_lambda 'reservations' 'UpdateReservationFunction'
refresh_lambda 'reservations' 'DeleteReservationFunction'
refresh_lambda 'reservations' 'ListReservationsFunction'

# TBD
exit 0

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