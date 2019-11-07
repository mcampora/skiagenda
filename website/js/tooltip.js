class Tooltip {
    static tooltips = {}

    static init(id, template, openCallback, deleteCallback)  {
        this.tooltips[id] = new Tooltip(template, openCallback, deleteCallback)
    }

    static instance(id)  {
        console.log('Tooltip::instance')
        return this.tooltips[id]
    }

    constructor(template, openCallback, deleteCallback) {
        console.log('Tooltip::constructor')
        this.template = $( '#' + template )
        this.template.hide()
        $( "#tooltip-delete", this.template ).on( "click", () => { this.delete() } )
        $( "#tooltip-close", this.template ).on( "click", () => { this.close() } )
        this.openCallback = openCallback
        this.deleteCallback = deleteCallback
    }

    close() {
        console.log( 'tooltip-close' )
        this.template.fadeOut()
    }
    
    open(parent) {
        this.close()
        console.log( 'Tooltip::open' )
        console.log(parent)
        this.popper = new Popper(parent.el,this.template)
        this.event = parent.event
        if (this.openCallback)
            this.openCallback(this, this.event)
        this.template.fadeIn()
    }

    delete() {
        console.log( 'Tooltip::delete' )
        this.close()

        // -------------
        // delete callback
        // -------------
        deleteReservation(accessToken,{resaid:this.event.extendedProps.r.resaid})
        // -------------

        .then(d => {
            console.log(d)
            this.event.remove()
        })
        .catch(e => {
            error(e)
        })
    }

    static resaOpenCallback(tooltip, event) {
        console.log( 'Tooltip::resaOpenCallback' )
        console.log(event)
        $( '#tooltip-source', tooltip.template ).html(event.extendedProps.r.resaowner)
        var str = $( '#tooltip-period', tooltip.template ).html(calendar.formatRange(
            event.extendedProps.r.firstday, 
            event.extendedProps.r.lastday, 
            {
                month: 'long',
                year: 'numeric',
                day: 'numeric',
                separator: ' au ',
                locale: 'fr'
            }))
        $( '#tooltip-note', tooltip.template ).html(event.extendedProps.r.note)
        $( '#tooltip-creation', tooltip.template ).html(event.extendedProps.r.creationDate)
        $( '#tooltip-update', tooltip.template ).html(event.extendedProps.r.updateDate)
        $( '#tooltip-id', tooltip.template ).html(event.extendedProps.r.resaid)
    }

}
