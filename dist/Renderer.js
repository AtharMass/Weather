class Renderer {
    constructor() {
        this.source = $('#city-template').html()
        this.template = Handlebars.compile(this.source)
    }

    renderData(data) {
        $('.cities').empty()
        const newHTML = this.template({ data })
        $('.cities').append(newHTML)
    }


}