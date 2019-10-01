# create the website resources
aws cloudformation create-stack \
    --capabilities CAPABILITY_IAM \
    --stack-name skiagenda-website \
    --template-body file://website.template 

# wait for completion
aws cloudformation wait stack-create-complete \
    --stack-name skiagenda-website

# upload static files
aws s3 sync ../website/ s3://skiagenda

# create the backend resources
aws cloudformation create-stack \
    --capabilities CAPABILITY_IAM \
    --stack-name skiagenda-backend \
    --template-body file://backend.template 