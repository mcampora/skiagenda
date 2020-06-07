var AWS = require('aws-sdk') // Load the AWS SDK for Node.js
AWS.config.update({region: 'us-east-1'}) // Set the region 
const Holidays = require('holidays')
const holidays = new Holidays(AWS)

describe("Holidays dB test suite -", function() {
    // var originalTimeout = 0
    // beforeEach(function() {
    //     originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
    //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000
    // })
    // afterEach(function() {
    //     jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
    // })

    it("wipe the table", function() {
        return holidays.wipe()
        .then(d => {
            //console.log(d)
            //expect(d).toEqual(something)
            return holidays.list()
        })
        .then(d => {
            //console.log(d)
            expect(d.Count).toBe(0)
        })
    })

    it("import new records", function() {
        return holidays.import('A', 'https://www.data.gouv.fr/en/datasets/r/b580138b-ae5c-4b4d-8cbf-110ffd373192')
        .then(d => {
            //console.log(d)
            //expect(d).toEqual([])
            return holidays.list()
        })
        .then(d => {
            //console.log(d)
            expect(d.Count).toBeGreaterThan(1)
        })
    })

})

