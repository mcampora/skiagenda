#export AWS_PROFILE=skiagenda-test
export LAYER=$1
if [ -z $LAYER ]
then
    export LAYER = 'backend'
fi

# cleanup the stack
aws cloudformation delete-stack --stack-name skiagenda-$LAYER

# wait for completion
aws cloudformation wait stack-delete-complete \
    --stack-name skiagenda-$LAYER

if [ $LAYER = 'website' ]
then
    # empty the website bucket
    aws s3 rb s3://skiagenda --force
fi

