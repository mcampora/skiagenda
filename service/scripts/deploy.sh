#!/bin/bash

./deploy-infra.sh
./build-package.sh 'holidays'
./build-package.sh 'reservations'
./deploy-package.sh 'holidays'
./deploy-package.sh 'reservations'
./refresh-lambda.sh 'holidays' 'RefreshHolidaysFunction'
./refresh-lambda.sh 'holidays' 'ListHolidaysFunction'
./refresh-lambda.sh 'reservations' 'AddReservationFunction'
./refresh-lambda.sh 'reservations' 'UpdateReservationFunction'
./refresh-lambda.sh 'reservations' 'DeleteReservationFunction'
./refresh-lambda.sh 'reservations' 'ListReservationsFunction'

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