const holidays = require('schoolholidays')

// constants
const REMOTE_A_SRC="https://fr.ftp.opendatasoft.com/openscol/fr-en-calendrier-scolaire/Zone-A.ics"
const REMOTE_B_SRC="https://fr.ftp.opendatasoft.com/openscol/fr-en-calendrier-scolaire/Zone-B.ics"
const REMOTE_C_SRC="https://fr.ftp.opendatasoft.com/openscol/fr-en-calendrier-scolaire/Zone-C.ics"

// the test suite
describe("Test Holidays API -", function() {  
  var originalTimeout = 0
  beforeEach(function() {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 80000
  })

  afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })

  var event = { requestContext: { authorizer: 'xxx' }, body: '{}' };
  var callback = (a, b) => { //console.log(b); 
    return b; 
  };

  it("refresh holidays", async function() {
    event.body = JSON.stringify({
      a: REMOTE_A_SRC,
      b: REMOTE_B_SRC,
      c: REMOTE_C_SRC
    });
    return await holidays.refresh(event, null, callback)
    .then(d => {
      expect(d.statusCode).toBe(201);
      event.body = '{}'
      return holidays.list(event, null, callback);
    })
    .then(d => {
      //console.log(d);
      expect(d?.statusCode).toBe(200);
      expect(JSON.parse(d.body).Count).toBeGreaterThan(60);
    })
    .catch(e => {
      console.log(e);
    });
  });

})
