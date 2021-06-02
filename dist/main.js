const tempManager = new TempManager()
const render = new Renderer()

const inputCity = $("#city-input")

const loadPage = async function () {
    await tempManager.getDataFromDB()
    await render.renderData(tempManager.cityData)
}

const handleSearch = async function () {
    const cityName = inputCity.val()
    inputCity.val("")

    await tempManager.getCityData(cityName)
    await render.renderData(tempManager.cityData)

}
$('.container').on('click', "#btn-search", handleSearch)

$('.cities').on('click', ".remove-city", async function () {

    const cityName = $(this).closest(".city").find("h5").text()

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await tempManager.removeCity(cityName)
            
            Swal.fire(
                'Deleted!',
                `${cityName} city has been deleted. 😔`,
                'success'
            )

            loadPage()

        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            Swal.fire(
                'Cancelled',
                `${cityName} city is safe. 😄`,
                'error'
            )
        }
        
    })

})

$('.cities').on('click', ".add-city", async function () {
    const cityName = $(this).closest(".city").find("h5").text()
    tempManager.saveCity(cityName)
    Swal.fire({
        icon: 'success',
        title: `Your ${cityName} city has been saved`,
        showConfirmButton: false,
        timer: 1500
    })
    render.renderData(tempManager.cityData)
})
  
loadPage()


