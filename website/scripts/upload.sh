# upload website content into an S3 bucket
aws s3 mb s3://skiagenda-rawdata --region us-east-1
aws s3 sync ../website s3://skiagenda-rawdata/website
