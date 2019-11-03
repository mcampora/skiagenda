'use strict';
const ical = require('ical'); 
ical.fromURL('https://www.data.gouv.fr/en/datasets/r/b580138b-ae5c-4b4d-8cbf-110ffd373192', {}, function (err, data) {
    for (let k in data) {
        if (data.hasOwnProperty(k)) {
            var ev = data[k]
            if (data[k].type == 'VEVENT') {
                if (ev.end) {
                    //console.log(ev)
                    console.log(`${ev.summary} from ${ev.start.toISOString()} to ${ev.end.toISOString()}`)
                }
            }
        }
    }
    if (err) {
        console.log(err)
    }
});