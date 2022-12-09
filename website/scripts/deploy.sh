#!/bin/bash

# select dev or prod environment using environment variables and parameter
export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-'us-east-1'}
export BUCKET_NAME=${1:-'skiagenda-test'}

# create the s3 bucket with proper permissions and settings
aws cloudformation deploy \
    --capabilities CAPABILITY_IAM \
    --stack-name skiagenda-website \
    --template-file ./website.yaml \
    --parameter-overrides WebsiteBucketName=$BUCKET_NAME

## extract output variables
export url=`aws cloudformation describe-stacks --stack-name skiagenda-website --query "Stacks[0].Outputs[?OutputKey=='websiteURL'].OutputValue" --output text`
export id=`aws cloudformation describe-stacks --stack-name skiagenda-website --query "Stacks[0].Outputs[?OutputKey=='cloudFrontId'].OutputValue" --output text`
echo "resources:"
echo "https://${url}"
echo ${id}

# fetch services helpers
pushd ../src/js
    npm install
popd

# upload/synchronize content
aws s3 sync --delete ../src s3://$BUCKET_NAME

# invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id ${id} --paths "/*"