# select dev or prod environment
export TARGET=$1
export BUCKET_NAME='skiagenda'
if [ -z $TARGET ]
then
    export TARGET='default'
    export BUCKET_NAME='skiagenda-test'
fi

# create the s3 bucket with proper permissions and settings
aws --profile $TARGET \
    cloudformation deploy \
    --capabilities CAPABILITY_IAM \
    --stack-name skiagenda-website \
    --template-file ./website.yaml \
    --parameter-overrides WebsiteBucketName=$BUCKET_NAME

# fetch services helpers
pushd .
    cd ../src/js
    npm install
popd

# upload/synchronize content
aws s3 sync ../src s3://$BUCKET_NAME

## extract output variables
export url=`aws cloudformation describe-stacks --stack-name skiagenda-website --query "Stacks[0].Outputs[?OutputKey=='websiteURL'].OutputValue" --output text`
echo $url