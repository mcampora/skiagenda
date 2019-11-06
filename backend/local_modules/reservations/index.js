module.exports = class Reservations {
    constructor(ddb) {
        this.ddb = ddb
    }

    // create a record, keep track of the owner
    // the dates have to be consistent and not overlap an existing reservation
    create(item) {
        return this.overlap(item.firstday, item.lastday)
        .then(d => {
            //console.log('create:')
            //console.log(item)
            //console.log(d)
            if (d.Count == 0) {
                item.creationTime = new Date().toISOString()
                const params = {
                    TableName: 'Reservations',
                    Item: item,
                    ConditionExpression: 'attribute_not_exists(resaid) \
                        and (:e > :b)',
                    ExpressionAttributeValues: {
                        ':b' : item.firstday,
                        ':e' : item.lastday,
                    },
                    ReturnValues: 'ALL_OLD'
                }
                return this.ddb.put(params).promise()
            }
            else {
                var e = new Error("There's an overlap with an existing reservation!")
                e.name = "OverlapException"
                throw e
            }
        })
    }

    // return the list of records overlaping with a given period
    overlap(firstday, lastday, resaid = null) {
        const params = { 
            TableName : 'Reservations',
            FilterExpression: '((firstday <= :b and lastday >= :b) or (firstday <= :e and lastday >= :e) or (firstday >= :b and  lastday <= :e)) and (resaid <> :id)',
            ExpressionAttributeValues: {
                ':b' : firstday,
                ':e' : lastday,
                ':id': resaid
            }
        }
        return this.ddb.scan(params).promise()
    }

    // retrieve a particular record
    retrieve(key) {
        const params = {
            TableName: 'Reservations',
            Key: { 'resaid' : key }
        }
        return this.ddb.get(params).promise()
    }

    // list records for the provided month (plus and minus one)
    list(date) {
        var d = new Date(date)
        var b = new Date(d)
        b.setMonth(b.getMonth() - 1, 1)
        var e = new Date(d)
        e.setMonth(e.getMonth() + 1, 30)
        //console.log(b)
        //console.log(e)
        const params = { 
            TableName : 'Reservations',
            FilterExpression: '(firstday >= :b and lastday <= :e)',
            ExpressionAttributeValues: {
                ':b' : b.toISOString(),
                ':e' : e.toISOString(),
            }
        }
        return this.ddb.scan(params).promise()
    }

    // update a record, provided the user corresponds to the one used at creation time
    // the dates have to be consistent and not overlap an existing reservation
    update(item) {
        return this.overlap(item.firstday, item.lastday, item.resaid)
        .then(d => {
            //console.log('update:')
            //console.log(item)
            //console.log(d)
            if (d.Count == 0) {
                const params = {
                    TableName: 'Reservations',
                    Key: { 'resaid' : item.resaid },
                    UpdateExpression: 'set firstday = :b, lastday = :e, updateTime = :t',
                    ConditionExpression: 'resaowner = :o \
                        and (:e > :b)',
                    ExpressionAttributeValues: {
                        ':b' : item.firstday,
                        ':e' : item.lastday,
                        ':t' : new Date().toISOString(),
                        ':o' : item.resaowner
                    },
                    ReturnValues: 'ALL_NEW'
                }
                return this.ddb.update(params).promise()
            }
            else {
                //console.log(item)
                //console.log(d)
                var e = new Error("There's an overlap with an existing reservation!")
                e.name = "OverlapException"
                e.list = d
                throw e
            }
        })
    }

    // delete a record, provided the user corresponds to the one used at creation time
    remove(key, owner) {
        const params = {
            TableName: 'Reservations',
            Key: { 'resaid' : key },
            ConditionExpression: 'resaowner = :o',
            ExpressionAttributeValues: {
                ':o' : owner
            }
        }
        return this.ddb.delete(params).promise()
    }
}
