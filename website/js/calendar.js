var calendar = null
var ed = null
// initialize the calendar, its options and callbacks
function createCalendar(elt) {
    console.log("Calendar::create")
    var parent = document.getElementById(elt)
    calendar = new FullCalendar.Calendar(parent, {
        // select the plugins and the view
        plugins: [ 'dayGrid', 'interaction' ],
        defaultView: 'dayGridMonth',
        locale: 'fr',
        // header definition, nothing on the left
        // a title highliting the month displayed in the middle
        // 2 navigation buttons on the right
        header: {
            left: '',
            center: 'title',
            right: 'prev,next'
        },
        // highlight current day
        nowIndicator: true,

        // -- LIST --
        // retrieve current reservations (a 3 months range around the current month)
        refetchResourcesOnNavigate: true,
        events: getEvents,

        // -- ADD --
        // enable range selection
        selectable: true,
        // triggered when you select a range,
        // actually when you release the mouse button on the last day
        select: addEvent,
        // prevent selection of an occupied slot
        selectOverlap: function(event) {
            console.log('selectOverlap')
            console.log(event)
            return false
        },
        // only triggered when you try to select an empty slot,
        // hence the parameter does not include the underlying event
        selectAllow: function(selectInfo) { 
            console.log('selectAllow')
            console.log(selectInfo)
            return true
        },

        // -- UPDATE --
        // triggered when you drag an event around
        // and you pass over another event
        eventOverlap: function(stillEvent, movingEvent) {
            console.log('eventOverlap!')
            var stillResa = toReservation(stillEvent)
            var movingResa = toReservation(movingEvent)
            const res = 
                ((stillResa.lastday <= movingResa.firstday) || (stillResa.firstday >= movingEvent.lastday))
            console.log(res)
            return res
        },
        editable: true,
        eventResizableFromStart: true,
        eventDurationEditable: true,
        eventDrop: moveEvent,
        eventResize: moveEvent,
        
        // triggered when you click on a given event, leads tp -- DELETE --
        eventClick: selectEvent,
    })
    //getEvents(new Date().toISOString())
    calendar.render()
}

// helper function build a calendar event object
// using a reservation object as input
// beside the fact the fields have different names
// it also normalize dates and hours
function toEvent(reservation) {
    var event = {
        start: reservation.firstday,
        end: new Date(reservation.lastday).setHours(24),
        title: '(' + reservation.resaowner + ')',
        allDay: true,
        //overlap: false,
        extendedProps: { r: reservation }
    }
    return event
}

// helper function
// translate a calendar event object into a reservation object
// beside the fact the fields have different names
// it also normalize dates and hours
// updates the inner property extendedProps.r with the result
function adjustDate(date, offset) {
    d = new Date(date)
    d.setHours(offset)
    return d.toISOString()
}
function toReservation(event) {
    if (!event.extendedProps.r) 
        event.extendedProps.r = {}
    var r = event.extendedProps.r
    r.firstday = adjustDate(event.start,13)
    r.lastday = adjustDate(event.end,-13)
    r.resaowner = event.owner
    return r
}

var lastd = null
function addEvent(d) {
    // this calendar widget creates events starting at the first hour on day 1
    // and finishing at the first hour of the day after day 2 (day2 is actually excluded)
    // all the maths and actual storage will have to consider this particular behaviour
    console.log('Calendar::addevent')
    //console.log(d)
    Tooltip.instance().close();
    calendar.unselect()
    d.owner = _getUserPool().getCurrentUser().getUsername()
    d.extendedProps = {}
    var r = toReservation(d)
    // add the reservation to the database
    addReservation(accessToken,{resa:r})
    .then(d => {
        // add the event to the calendar
        console.log('success')
        //calendar.addEvent(d)
        calendar.refetchEvents()
    })
    .catch(e => {
        error(e)
    })
    lastd = d
}

function selectEvent(e) {
    console.log('Calendar::selectEvent')
    console.log(e)
    Tooltip.instance().open(e);
}

function getEvents(d, successCallback, failureCallback) {
    console.log("Calendar::getEvents")
    console.log(d)
    // compute the date in the  middle of the  view
    var focus = new Date(d.start)
    focus.setDate(15)
    // TBD
    var month = encodeURIComponent(focus.toISOString())
    listReservations(accessToken,"month=" + month)
    .then(d=>{
        console.log('success')
        console.log(d)
        var e = d.Reservations.Items.map(i => { return toEvent(i) })
        console.log(e)
        successCallback(e)
    })
    .catch(e=>{
        error(e)
        failureCallback(e)
    })
}

function moveEvent(d) {
    console.log('Calendar::moveEvent')
    console.log(d)
    lastd = d
    var m = toReservation(d.event)
    // manage the update
    console.log(m)
    updateReservation(accessToken,{resa:m})
    .then(d=>{
        console.log('success')
        console.log(d)
    })
    .catch(e=>{
        error(e)
        d.revert()
    })
}

