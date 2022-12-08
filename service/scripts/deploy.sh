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

./get-config.sh
./build-package.sh 'client'
