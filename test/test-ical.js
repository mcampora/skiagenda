'use strict';
const ical = require('ical'); 

function _getCalendar(url, onSuccess, onFailure) {
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

function getCalendar(url) { 
    return new Promise((onSuccess, onFailure) => _getCalendar(url, onSuccess, onFailure)) 
}

getCalendar('https://www.data.gouv.fr/en/datasets/r/b580138b-ae5c-4b4d-8cbf-110ffd373192')
.then(d => {
    console.log(d)
    return d
})
.catch(e => {
    console.log(e)
})
