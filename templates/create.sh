# create a temporary S3 bucket with static content and lambdas
aws s3 mb s3://skiagenda-source --region us-east-1
aws s3 sync ../website s3://skiagenda-source/website
pushd .
    cd ../backend
    zip functions.zip *.js
popd
aws s3 sync ../backend s3://skiagenda-source/backend

# create the website resources
aws cloudformation create-stack \
    --capabilities CAPABILITY_IAM \
    --stack-name skiagenda-website \
    --template-body file://website.yaml 

# wait for completion
aws cloudformation wait stack-create-complete \
    --stack-name skiagenda-website
