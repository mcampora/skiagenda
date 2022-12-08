const addReservation = require('../addReservation');
const deleteReservation = require('../deleteReservation');
const listReservations = require('../listReservations');
const updateReservation = require('../updateReservation');

describe("Test Resa API -", function() {
  let event = { queryStringParameters: {}, requestContext: { authorizer: { 'claims': { 'cognito:username': 'mcampora' } } }, body: '{}' };
  let callback = (a, b) => { //console.log(b); 
    return b; 
  };

  let gresaid = null;
  it("create a basic reservation", function() {
    const firstday = '2013-01-07 10:00';
    const lastday = '2013-01-14 10:00';
    event.body = JSON.stringify({resa:{firstday:firstday,lastday:lastday}});  
    return addReservation.handler(event, null, callback)
    .then((d) => {
      //console.log("add result: ")
      //console.log(d);
      const r = JSON.parse(d?.body);
      expect(r?.resaid).not.toBe(null);
      expect(r?.resaowner).toBe('mcampora');
      expect(r?.firstday).toBe(firstday);
      expect(r?.lastday).toBe(lastday);
      // save the resaid
      gresaid = r?.resaid;
      //console.log(gresaid);
    })
    .catch(e => {
      console.log(e);
      fail();
    })
  })

  let nbresa = 0;
  it("retrieve the list of reservations, full list", function() {
    event.queryStringParameters['month'] = "2013-01-10 10:00";
    return listReservations.handler(event, null, callback).then((d) => {
      const r = JSON.parse(d?.body);
      //console.log(r);
      expect(r.Reservations.Items.length).toBeGreaterThan(0);
      nbresa = r.Reservations.Items.length;
    })
  })

  it("retrieve the list of reservations, empty list", function() {
    event.queryStringParameters['month'] = "2013-06-10 10:00";
    return listReservations.handler(event, null, callback).then((d) => {
      const r = JSON.parse(d?.body);
      //console.log(r);
      expect(r.Reservations.Items.length).toBe(0);
    })
  })

  it("update the reservation, no overlap", function() {
    const firstday = '2013-01-08 10:00';
    const lastday = '2013-01-10 10:00';
    //const firstday = '2013-01-15 10:00';
    //const lastday = '2013-01-20 10:00';
    const resa = {resa:{resaid:gresaid,firstday:firstday,lastday:lastday,note:'',category:'rental',revenue:600}};
    event.body = JSON.stringify(resa);  
    return updateReservation.handler(event, null, callback)
    .then(d => {
      //console.log('update result: ');
      //console.log(d);
      const r = JSON.parse(d?.body);
      //console.log(r);
      expect(r?.resaid).toBe(gresaid);
      expect(r?.resaowner).toBe('mcampora');
      expect(r?.firstday).toBe(firstday);
      expect(r?.lastday).toBe(lastday);
    })
    .catch(e => {
      console.log(resa);
      console.log(e);
      fail();
    })
  })

  it("delete the reservation", function() {
    event.body = JSON.stringify({'resaid':gresaid});
    return deleteReservation.handler(event, null, callback)
    .then(d => {
      //console.log(d)
      expect(d).not.toBe(null);
    })
    .catch(e => {
      console.log(e);
      fail();
    })
  })
})

