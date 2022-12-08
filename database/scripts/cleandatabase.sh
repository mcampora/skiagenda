function clean {
    export TABLE_NAME=$1
    export KEY=$2

    aws dynamodb scan --table-name $TABLE_NAME --attributes-to-get "$KEY" \
        --query "Items[].$KEY.S" --output text | \
        tr "\t" "\n" | \
        xargs -t -I keyvalue aws dynamodb delete-item --table-name $TABLE_NAME \
        --key "{\"$KEY\": {\"S\": \"keyvalue\"}}"
}

clean Reservations resaid
clean Holidays hid