LAYER=$1
if [ -z $LAYER ]
then
    LAYER='backend'
fi

if [ $LAYER = 'website' ]
then
    # create a temporary S3 bucket with static content
    aws s3 mb s3://skiagenda-source --region us-east-1
    aws s3 sync ../website s3://skiagenda-source/website
else
    # update the temporary content with lambdas
    pushd .
        cd ../backend
        zip -r functions.zip .
    popd
    aws s3 sync ../backend s3://skiagenda-source/backend
fi

# create the resources
aws cloudformation create-stack \
    --capabilities CAPABILITY_IAM \
    --stack-name skiagenda-$LAYER \
    --template-body file://$LAYER.yaml 

# wait for completion
aws cloudformation wait stack-create-complete \
    --stack-name skiagenda-$LAYER
