# cleanup the stacks
aws cloudformation delete-stack --stack-name skiagenda-website

# wait for completion
aws cloudformation wait stack-delete-complete \
    --stack-name skiagenda-website

# empty the website bucket
aws s3 rb s3://skiagenda --force

# cleanup the temporary S3 bucket
aws s3 rb s3://skiagenda-source --force

