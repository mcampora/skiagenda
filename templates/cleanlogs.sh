aws logs describe-log-groups --query 'logGroups[*].logGroupName' --output table | \
awk '/\|/{print $2}' | grep -v DescribeLogGroups | while read x; do  echo "deleting $x" ; aws logs delete-log-group --log-group-name $x; done

