var calendar = null
function createCalendar(elt) {
    // initialise the calendar
    document.addEventListener('DOMContentLoaded', function() {
        calendar = new FullCalendar.Calendar(document.getElementById(elt), {

          // select the plugins and the view
          plugins: [ 'dayGrid', 'interaction' ],
          defaultView: 'dayGridMonth',

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

          //
          selectable: true,
          //
          selectMirror: true,
          // triggered when you select a slot,
          // actually when you release the mouse button on the last day
          select: addevent,

          // prevent selection of an occupied slot
          selectOverlap: false, 
          // only triggered when you try to select an empty slot,
          // hence the parameter does not include the underlying event
          selectAllow: function(selectInfo) { 
            console.log('selectAllow')
            console.log(selectInfo)
            return true
          },

          // triggered when you drag an event around
          // and you pass over another event
          eventOverlap: function(stillEvent, movingEvent) {
            console.log('eventOverlap!')
            var ss = stillEvent.start; ss.setHours(13)
            var se = stillEvent.end; se.setHours(-13)
            var ms = movingEvent.start; ms.setHours(13)
            var me = movingEvent.end; me.setHours(-13)
            console.log(se)
            console.log(ms)
            const res = ((se <= ms) || (ss >= me))
            console.log(res)
            return res
          },

          // triggered when you click on a given event
          eventClick: selectevent,

          eventDrop: function(d) {
            console.log('eventDrop')
            console.log(d)
          },

          eventResize: function(d) {
            console.log('eventResize')
            console.log(d)
          },
          
          dateClick: function(d) {
            console.log('dateClick')
            console.log(d)
          },
        })

        calendar.render()
    })
}

var lastd = null
function addevent(d) {
    // this calendar widget creates events starting at the first hour on day 1
    // and finishing at the first hour of the day after day 2 (day2 is actually excluded)
    // all the maths and actual storage will have to consider this particular behaviour
    console.log('addevent')
    console.log(d)    
    
    calendar.unselect()
    
    const owner = _getUserPool().getCurrentUser().getUsername()
    
    // force minimum duration to 2 days
    // TBD

    calendar.addEvent({
        title: '(' + owner + ')',
        start: d.start,
        end: d.end,
        allDay: true,
        //overlap: false,
        editable: true,
        startEditable: true,
        eventResizableFromStart: true,
        durationEditable: true,
    })
    lastd = d
}

function deleteevent(e) {

}

function moveevent(e) {

}

function selectevent(e) {
    console.log('selectevent')
    console.log(e)
}

function init(c) {

}