var tooltip = null
var  template = null
class Tooltip {
    static init(id)  {
        template = $( '#' + id )
        template.hide()
    }
    static instance()  {
        console.log('Tooltip::instance')
        if (tooltip == null) {
            tooltip = new Tooltip()
        }
        return tooltip
    }
    constructor() {
        console.log('Tooltip::constructor')
        $( "#tooltip-delete", template ).on( "click", () => { this.delete() })
        $( "#tooltip-close", template ).on( "click", () => { this.close() })
    }
    open(parent) {
        this.close()
        console.log( 'Tooltip::open' )
        console.log(parent)
        this.popper = new Popper(parent.el,template)
        this.event = parent.event
        $( '#tooltip-source', template ).html(this.event.extendedProps.r.resaowner)
        var str = 
        $( '#tooltip-period', template ).html(calendar.formatRange(
            this.event.extendedProps.r.firstday, 
            this.event.extendedProps.r.lastday, 
            {
                month: 'long',
                year: 'numeric',
                day: 'numeric',
                separator: ' au ',
                locale: 'fr'
            }))
        $( '#tooltip-note', template ).html(this.event.extendedProps.r.note)
        $( '#tooltip-creation', template ).html(this.event.extendedProps.r.creationDate)
        $( '#tooltip-update', template ).html(this.event.extendedProps.r.updateDate)
        $( '#tooltip-id', template ).html(this.event.extendedProps.r.resaid)
        template.fadeIn()
    }
    close() {
        console.log( 'tooltip-close' )
        template.fadeOut()
        //if (this.popper)
            //this.popper.destroy()
    }
    delete() {
        console.log( 'Tooltip::delete' )
        this.close()
        deleteReservation(accessToken,{resaid:this.event.extendedProps.r.resaid})
        .then(d => {
            console.log(d)
            this.event.remove()
        })
        .catch(e => {
            error(e)
        })
    }
}