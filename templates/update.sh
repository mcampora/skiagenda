aws cloudformation update-stack \
    --capabilities CAPABILITY_IAM \
    --stack-name skiagenda-website \
    --template-body file://website.yaml
