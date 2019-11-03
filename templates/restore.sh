export ARN=`aws dynamodb list-backups | \
    grep BackupArn | \
    awk '/.*: \"(.*)\"/{print $2}' | \
    sed 's/\"//g' | \
    head -1`

#aws dynamodb describe-backup \
#    --backup-arn $ARN

aws dynamodb delete-table --table-name Reservations

aws dynamodb restore-table-from-backup \
    --target-table-name Reservations \
    --backup-arn $ARN
