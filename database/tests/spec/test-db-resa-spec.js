var AWS = require('aws-sdk') // Load the AWS SDK for Node.js
AWS.config.update({region: 'us-east-1'}) // Set the region 
var Reservations = require('reservations-db')
var resa = new Reservations(AWS)

describe("Reservation test suite -", function() {
    // helpers
    const create = (params) => {
        //console.log(params)
        return resa.create(params)
        .then(d => {
            //console.log(d)
            expect(d).toEqual({})
        })
    }
    const date = (day) => {
        return "2015-12-" + day + " 11:00"
    }

    it("first record, no conflict", function() {
        return create({
            'resaid'      : 'myspecialid',
            'firstday'    : date('10'),
            'lastday'     : date('17'),
            'resaowner'   : 'marco',
        })
    })

    it("same record, so conflict", function() {
        return create({
            'resaid'      : 'myspecialid',
            'firstday'    : date('10'),
            'lastday'     : date('17'),
            'resaowner'   : 'marco',
        })
        .catch(e => {
            //console.log(e)
            expect(e.name).toBe('OverlapException')
        })
    })

    it("second record, with dates overlap", function() {
        return create({
            'resaid'      : 'myspecialid2',
            'firstday'    : date('08'),
            'lastday'     : date('19'),
            'resaowner'   : 'marco',
        })
        .catch(e => {
            //console.log(e)
            expect(e.name).toBe('OverlapException')
        })
    })

    it("third record, with dates overlap", function() {
        return create({
            'resaid'      : 'myspecialid3',
            'firstday'    : date('08'),
            'lastday'     : date('12'),
            'resaowner'   : 'marco',
        })
        .catch(e => {
            //console.log(e)
            expect(e.name).toBe('OverlapException')
        })
    })

    it("fourth record, with dates overlap", function() {
        return create({
            'resaid'      : 'myspecialid4',
            'firstday'    : date('14'),
            'lastday'     : date('19'),
            'resaowner'   : 'marco',
        })
        .catch(e => {
            //console.log(e)
            expect(e.name).toBe('OverlapException')
        })
    })

    it("fifth record", function() {
        return create({
            'resaid'      : 'myspecialid5',
            'firstday'    : date('02'),
            'lastday'     : date('08'),
            'resaowner'   : 'marco',
        })
    })

    it("sixth record", function() {
        return create({
            'resaid'      : 'myspecialid6',
            'firstday'    : date('19'),
            'lastday'     : date('25'),
            'resaowner'   : 'marco',
        })
    })

    it("retrieve", function() {
        return resa.retrieve('myspecialid')
        .then(d => {
            //console.log(d)
            expect(d).not.toBe(null)
            expect(d.Item).not.toBe(null)
            expect(d.Item.resaid).toBe('myspecialid')
        })
    })

    it("scan, match all", function() {
        return resa.list(date('10'))
        .then(d => {
            //console.log(d)
            expect(d).not.toBe(null)
            expect(d.Count).toBeGreaterThan(2)
        })
    })

    it("scan, match none", function() {
        return resa.list('2015-09-10 10:00')
        .then(d => {
            //console.log(d)
            expect(d).not.toBe(null)
            expect(d.Count).toBe(0)
        })
    })

    it("overlap, test dates overlap", function() {
        return resa.overlap(date('01'),date('03'))
        .then(d => {
            //console.log(d)
            expect(d).not.toBe(null)
            expect(d.Count).toBe(1)
        })
    })

    it("overlap, test dates overlap", function() {
        return resa.overlap(date('01'),date('12'))
        .then(d => {
            //console.log(d)
            expect(d).not.toBe(null)
            expect(d.Count).toBe(2)
        })
    })

    it("overlap, test dates overlap", function() {
        return resa.overlap(date('01'),date('20'))
        .then(d => {
            //console.log(d)
            expect(d).not.toBe(null)
            expect(d.Count).toBe(3)
        })
    })

    it("overlap, test dates overlap", function() {
        return resa.overlap(date('26'),date('28'))
        .then(d => {
            //console.log(d)
            expect(d).not.toBe(null)
            expect(d.Count).toBe(0)
        })
    })

    it("update, with date overlap", function() {
        return resa.update({
            'resaid'      : 'myspecialid',
            'firstday'    : date('10'),
            'lastday'     : date('30'),
            'resaowner'   : 'marco',
        })
        .catch(e => {
            //console.log(d)
            expect(e.name).toBe('OverlapException')
        })
    })

    it("update", function() {
        return resa.update({
            'resaid'      : 'myspecialid',
            'firstday'    : date('11'),
            'lastday'     : date('18'),
            'resaowner'   : 'marco',
            'note'        : '...',
            'category'    : 'familytime',
            'revenue'     : 0,
        })
        .then(d => {
            //console.log(d)
            expect(d).not.toBe(null)
            expect(d.Attributes.lastday).toBe(date('18'))
        })
    })

    it("2nd update", function() {
        return resa.update({
            'resaid'      : 'myspecialid',
            'firstday'    : date('26'),
            'lastday'     : date('30'),
            'resaowner'   : 'marco',
            'note'        : '...',
            'category'    : 'familytime',
            'revenue'     : 0,
        })
        .then(d => {
            //console.log(d)
            expect(d).not.toBe(null)
            expect(d.Attributes.lastday).toBe(date('30'))
        })
    })

    it("3rd update", function() {
        return resa.update({
            'resaid'      : 'myspecialid',
            'firstday'    : date('26'),
            'lastday'     : date('30'),
            'resaowner'   : 'zoro',
            'note'        : '...',
            'category'    : 'familytime',
            'revenue'     : 0,
        })
        .catch(e => {
            //console.log(e)
            expect(e).not.toBe(null)
            expect(e.code).toBe('ConditionalCheckFailedException')
        })
    })

    it("update as in the API test", function() {
        return resa.create({
            'resaid'      : 'myspecialidAPI',
            'firstday'    : '2016-01-07 10:00',
            'lastday'     : '2016-01-14 10:00',
            'resaowner'   : 'marco',
            'note'        : '...',
            'category'    : 'familytime',
            'revenue'     : 0,
        })
        .then(d => {
            //console.log(d)
            return resa.update({
                'resaid'      : 'myspecialidAPI',
                'firstday'    : '2016-01-08 10:00',
                'lastday'     : '2016-01-10 10:00',
                'resaowner'   : 'marco',
                'note'        : '...',
                'category'    : 'familytime',
                'revenue'     : 0,
                })
        })
        .then(d => {
            //console.log(d)
            expect(d).not.toBe(null)
            expect(d.Attributes.lastday).toBe('2016-01-10 10:00')
            return resa.remove('myspecialidAPI','marco')
        })
        .then(d => {
            //console.log(d)
            expect(d).not.toBe(null)
        })
    })

    it("delete, with wrong ownership", function() {
        return resa.remove('myspecialid','theintruder')
        .catch(e => {
            //console.log(e)
            expect(e.code).toBe('ConditionalCheckFailedException')
        })
    })

    if("delete, with wrong key", function() {
        return resa.remove('xxx','marco')
        .then(d => {
            console.log(d)
        })
        .catch(e => {
            console.log(e)
            expect(e).not.toBe(null)
        })
    })

    it("delete", function() {
        return resa.remove('myspecialid','marco')
        .then(d => {
            //console.log(d)
            expect(d).not.toBe(null)
            return resa.remove('myspecialid5','marco')
        })
        .then(d => {
            expect(d).not.toBe(null)
            return resa.remove('myspecialid6','marco')
        })
    })
})

