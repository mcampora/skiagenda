const ical = require('node-ical');

module.exports = class Holidays {
    constructor(AWS) {
        this.db = new AWS.DynamoDB({apiVersion: '2012-08-10'});
        this.ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
    }

    // erase all previous records
    wipe() {
        //console.log("Holidays::wipe");
        return this.list()
        .then(async d => {
            var items = d.Items;
            var params = { RequestItems: { Holidays: [] } };
            while (items.length > 0) {
                //console.log(items);
                //console.log(typeof items);
                //console.log('Elements to delete: ' + items.length);
                while (params.RequestItems.Holidays.length < 25 && items.length > 0) {
                    var i = items.pop();
                    //console.log(i);
                    params.RequestItems.Holidays.push({
                        DeleteRequest: {
                            Key: { 'hid': { S: i.hid } }
                        }
                    });
                }
                //console.log(JSON.stringify(params));
                if (params.RequestItems.Holidays.length > 0) {
                    //console.log('Delete a first batch: ' + params.RequestItems.Holidays.length);
                    await this.db.batchWriteItem(params).promise();
                }
                params.RequestItems.Holidays = [];
            }
            return Promise.resolve();
        })
    }

    // list all records
    list() {
        //console.log("Holidays::list");
        const params = { 
            TableName : 'Holidays',
        };
        return this.ddb.scan(params).promise();
    }

    events2records(events) {
        //console.log("Holidays::events2records ");
        // loop through events and record them
        var res = [];
        for (const event of Object.values(events)) {
            //console.log(event);
            if (event.type == 'VEVENT') {
                var record = {
                    summary: event.summary,
                    start: event.start.toISOString(),
                    end: event.end.toISOString()
                };
                //console.log(record);
                res.push(record);
            }
        }
        return res;
    }

    records2database(zone, records) {
        //console.log("Holidays::records2database " + zone);
        var hid = 1;
        var params = {
            RequestItems: {
                'Holidays': [
                ]
            }
        };
        records.forEach(i => {
            var item = {
                'hid': { S: zone + hid++ },
                'zone': { S: zone },
                'start': { S: i.start },
                'end': { S: i.end },
                'summary': { S: i.summary },
                'creationTime': { S: new Date().toISOString() }
            };
            //console.log(item);
            params.RequestItems.Holidays.push({
                PutRequest: {
                    Item: item
                }
            });
        })
        params.RequestItems.Holidays = params.RequestItems.Holidays.slice(-25);
        return this.db.batchWriteItem(params).promise();
    }

    importFromFile(zone, path) {
        //console.log("Holidays::importFromFile " + zone + ":" + path);
        const events = ical.sync.parseFile(path);
        var r = this.events2records(events);
        return this.records2database(zone, r);
    }

    importFromURL(zone, url) {
        //console.log("Holidays::importFromURL " + zone + ":" + path);
        return ical.async.fromURL(url)
        .then(events => {
            var records = this.events2records(events);
            return this.records2database(zone, records);
        });
    }
}
