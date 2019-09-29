aws cloudformation create-stack \
    --capabilities CAPABILITY_IAM \
    --stack-name mcmagenda1 \
    --template-body file://bucket.template 
