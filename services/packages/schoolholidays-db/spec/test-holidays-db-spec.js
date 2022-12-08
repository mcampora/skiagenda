var AWS = require('aws-sdk') // Load the AWS SDK for Node.js
AWS.config.update({region: 'us-east-1'}) // Set the region 
//import { Holidays } from 'holidays-db';
const Holidays = require('schoolholidays-db');
const holidays = new Holidays(AWS)

const LOCAL_A_SRC="./spec/rsc/Zone-A.ics"
const LOCAL_B_SRC="./spec/rsc/Zone-A.ics"
const LOCAL_C_SRC="./spec/rsc/Zone-A.ics"
const REMOTE_A_SRC="https://fr.ftp.opendatasoft.com/openscol/fr-en-calendrier-scolaire/Zone-A.ics"

describe("Holidays dB test suite -", function() {
    var originalTimeout = 0
    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 80000
    })

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
    })

    it("wipe the table then fill it with a file", function() {
        return holidays.wipe()
        .then(d => {
            return holidays.list();
        })
        .then(d => {
            //console.log(d);
            expect(d.Count).toBe(0);
        })
        .then(d => {
            return holidays.importFromFile('A', LOCAL_A_SRC);
        })
        .then(d => {
            return holidays.list();
        })
        .then(d => {
            //console.log(d);
            expect(d.Count).toBeGreaterThan(20);
        });
    });

    it("wipe the table then fill it with a URL", function() {
        return holidays.wipe()
        .then(d => {
            return holidays.list();
        })
        .then(d => {
            //console.log(d);
            expect(d.Count).toBe(0);
        })
        .then(d => {
            return holidays.importFromURL('A', REMOTE_A_SRC);
        })
        .then(d => {
            return holidays.list();
        })
        .then(d => {
            //console.log(d);
            expect(d.Count).toBeGreaterThan(20);
        });
    });

    it("wipe the table then fill it with 3 files, wipe it again", function() {
        return holidays.wipe()
        .then(d => {
            return holidays.list();
        })
        .then(d => {
            //console.log(d);
            expect(d.Count).toBe(0);
        })
        .then(d => {
            return holidays.importFromFile('A', LOCAL_A_SRC);
        })
        .then(d => {
            return holidays.importFromFile('B', LOCAL_B_SRC);
        })
        .then(d => {
            return holidays.importFromFile('C', LOCAL_C_SRC);
        })
        .then(d => {
            return holidays.list();
        })
        .then(d => {
            //console.log(d);
            expect(d.Count).toBeGreaterThan(60);
        })
        .then(d => {
            return holidays.wipe();
        })
        .then(d => {
            return holidays.list();
        })
        .then(d => {
            //console.log(d);
            expect(d.Count).toBe(0);
        })
    });
})

