# empty the website bucket
aws s3 rb s3://skiagenda --force

# cleanup the stacks
aws cloudformation delete-stack --stack-name skiagenda-website
aws cloudformation delete-stack --stack-name skiagenda-backend
aws cloudformation delete-stack --stack-name skiagenda-test
