class Tooltip {
    static tooltips = {}

    static init(id, template, openCallback, deleteCallback, saveCallback)  {
        this.tooltips[id] = new Tooltip(template, openCallback, deleteCallback, saveCallback)
    }

    static instance(id)  {
        console.log('Tooltip::instance')
        return this.tooltips[id]
    }

    constructor(template, openCallback, deleteCallback, saveCallback) {
        console.log('Tooltip::constructor')
        this.template = $( '#' + template )
        this.template.hide()
        $( "#tooltip-save", this.template ).on( "click", () => { this.save() } )
        $( "#tooltip-delete", this.template ).on( "click", () => { this.delete() } )
        $( "#tooltip-close", this.template ).on( "click", () => { this.close() } )
        this.openCallback = openCallback
        this.deleteCallback = deleteCallback
        this.saveCallback = saveCallback
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

    save() {
        console.log( 'Tooltip::save' )

        // -------------
        // save callback
        // -------------
        var e = this.event
        var r = e.extendedProps.r

        r.category = $('#tooltip-category')[0].value
        r.revenue = $('#tooltip-revenue')[0].value

        r.note = $('#tooltip-note').html()
        e.setProp('title', r.note)
        console.log(r)
        updateReservation(accessToken, {resa:r})
        // -------------

        .then(d => {
            console.log(d)
        })
        .catch(e => {
            error(e)
        })

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
            event.extendedProps.r.lastday, {
                month: 'long',
                year: 'numeric',
                day: 'numeric',
                separator: ' au ',
                locale: 'fr'
            }))
        
        $( '#tooltip-category', tooltip.template )[0].value = event.extendedProps.r.category
        $( '#tooltip-revenue', tooltip.template )[0].value = event.extendedProps.r.revenue

        $( '#tooltip-note', tooltip.template ).html(event.extendedProps.r.note)
        $( '#tooltip-creation', tooltip.template ).html(calendar.formatDate(
            event.extendedProps.r.creationTime, {
                month: 'long',
                year: 'numeric',
                day: 'numeric',
                locale: 'fr'
            }))
        if (event.extendedProps.r.updateTime)
            $( '#tooltip-update', tooltip.template ).html(calendar.formatDate(
                event.extendedProps.r.updateTime, {
                    month: 'long',
                    year: 'numeric',
                    day: 'numeric',
                    locale: 'fr'
                }))
        $( '#tooltip-id', tooltip.template ).html(event.extendedProps.r.resaid)
    }

}
