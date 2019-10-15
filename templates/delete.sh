LAYER=$1
if [ -z $LAYER ]
then
    LAYER = 'backend'
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

    # cleanup the temporary S3 bucket
    aws s3 rb s3://skiagenda-source --force
fi

