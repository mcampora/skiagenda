const ical = require('ical')

module.exports = class Holidays {
    constructor(AWS) {
        this.db = new AWS.DynamoDB({apiVersion: '2012-08-10'})
        this.ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'})
    }

    // erase all previous records
    wipe() {
        //console.log("Holidays::wipe")
        return this.list()
        .then(d => {
            var params = {
                RequestItems: {
                    'Holidays': [
                    ]
                }
            }
            if (d.Count > 0) {
                d.Items.forEach(i => {
                    params.RequestItems.Holidays.push({
                        DeleteRequest: {
                            Key: { 'hid': { S: i.hid } }
                        }
                    })
                })
                //console.log(JSON.stringify(params))
                return this.db.batchWriteItem(params).promise()
            }
            else return Promise.resolve()
        })
    }

    // list all records
    list() {
        //console.log("Holidays::list")
        const params = { 
            TableName : 'Holidays',
        }
        return this.ddb.scan(params).promise()
    }

    // import current and next year schedule
    // for a given area (A, B, C)
    import(zone, url) {
        //console.log("Holidays::import")
        return this.getCalendar(url)
        .then(d => {
            //console.log(d)
            var hid = 1
            var params = {
                RequestItems: {
                    'Holidays': [
                    ]
                }
            }
            d.forEach(i => {
                params.RequestItems.Holidays.push({
                    PutRequest: {
                        Item: {
                            'hid': { S: zone + hid++ },
                            'zone': { S: zone },
                            'start': { S: i.start },
                            'end': { S: i.end },
                            'summary': { S: i.summary },
                            'creationTime': { S: new Date().toISOString() }
                        }
                    }
                })
            })
            //console.log(JSON.stringify(params))
            return this.db.batchWriteItem(params).promise()
        })
        .catch(e => {
            //console.log(e)
            return Promise.reject(e)
        })
    }
    
    _getCalendar(url, onSuccess, onFailure) {
        //this.
        ical.fromURL(url, {}, (e, d) => { 
            if (e) onFailure(e) 
            else {
                var res = []
                for (let k in d) {
                    if (d.hasOwnProperty(k)) {
                        var ev = d[k]
                        if (d[k].type == 'VEVENT') {
                            if (ev.end) {
                                res.push({
                                    summary: ev.summary,
                                    start: ev.start.toISOString(),
                                    end: ev.end.toISOString()
                                })
                            }
                        }
                    }
                }
                //console.log(res)
                onSuccess(res)
            } 
        })
    }

    getCalendar(url) { 
        return new Promise((onSuccess, onFailure) => this._getCalendar(url, onSuccess, onFailure)) 
    }
}
