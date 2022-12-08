#!/bin/bash

export AWS_DEFAULT_REGION=us-east-1

export BUCKET_NAME='skiagenda-source-test'
export HOLIDAYS_PCK='schoolholidays-0.0.2'

# select dev or prod environment using environment variables

# install or refresh common resources
aws s3 mb s3://${BUCKET_NAME}

# launch a clean build
npm install
lerna clean -y
lerna run build --include-dependencies --scope=schoolholidays
lerna run pack --include-dependencies --scope=schoolholidays
tar xvf ./dist/${HOLIDAYS_PCK}.tgz /tmp
zip -r ./dist/${HOLIDAYS_PCK}.zip /tmp/package

# upload the tarball
aws s3 cp ./dist/${HOLIDAYS_PCK}.zip s3://${BUCKET_NAME}/services/

# install or refresh the API GW
aws cloudformation deploy \
    --capabilities CAPABILITY_IAM \
    --stack-name skiagenda-services \
    --template-file ./scripts/services.yaml \
    --parameter-overrides SourceBucketName=${BUCKET_NAME}

# install or refresh the lambda
aws lambda update-function-code --function-name RefreshHolidaysFunction --s3-bucket ${BUCKET_NAME} --s3-key services/${HOLIDAYS_PCK}
aws lambda update-function-code --function-name ListHolidaysFunction --s3-bucket ${BUCKET_NAME} --s3-key services/${HOLIDAYS_PCK}

# TBD
exit 0

aws --profile $TARGET lambda update-function-code --function-name AddReservationFunction --s3-bucket $BUCKET_NAME --s3-key services/reservations.zip
aws --profile $TARGET lambda update-function-code --function-name UpdateReservationFunction --s3-bucket $BUCKET_NAME --s3-key services/reservations.zip
aws --profile $TARGET lambda update-function-code --function-name DeleteReservationFunction --s3-bucket $BUCKET_NAME --s3-key services/reservations.zip
aws --profile $TARGET lambda update-function-code --function-name ListReservationsFunction --s3-bucket $BUCKET_NAME --s3-key services/reservations.zip

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