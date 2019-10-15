LAYER=$1
if [ -z $LAYER ]
then
    LAYER = 'backend'
fi

aws cloudformation update-stack \
    --capabilities CAPABILITY_IAM \
    --stack-name skiagenda-$LAYER \
    --template-body file://$LAYER.yaml
