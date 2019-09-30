# create the resources
aws cloudformation create-stack \
    --capabilities CAPABILITY_IAM \
    --stack-name skiagenda-1 \
    --template-body file://website.template 

# wait for completion
aws cloudformation wait stack-create-complete \
    --stack-name skiagenda-1

# upload static files
aws s3 sync ../website/ s3://skiagenda
