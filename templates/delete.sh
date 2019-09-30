# empty the website bucket
aws s3 rb s3://skiagenda --force

# cleanup the stack
aws cloudformation delete-stack --stack-name skiagenda-1
