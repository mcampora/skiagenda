#export AWS_PROFILE=skiagenda-test
export LAYER=$1
if [ -z $LAYER ]
then
    export LAYER='backend'
fi

export TARGET=$2
if [ -z $TARGET ]
then
    export TARGET='default'
fi

# create/refresh the source bucket
./upload.sh

# create the resources
aws --profile $TARGET \
    cloudformation create-stack \
    --capabilities CAPABILITY_IAM \
    --stack-name skiagenda-$LAYER \
    --template-body file://$LAYER.yaml 

# wait for completion
aws cloudformation wait stack-create-complete \
    --stack-name skiagenda-$LAYER
