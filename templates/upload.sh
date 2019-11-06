# upload website content and functions into an S3 bucket
aws s3 mb s3://skiagenda-source --region us-east-1
aws s3 sync ../website s3://skiagenda-source/website
pushd .
    cd ../backend
    zip -r functions.zip .
popd
aws s3 sync ../backend/functions.zip s3://skiagenda-source/backend
