class TempManager {

    constructor() {
        this.cityData = []
    }

    async getDataFromDB() {
        const cities = await $.get(`cities/`)
        this.cityData = cities
    }

    async getCityData(cityName) {        
        cityName = this.firstLetterToUpperCase(cityName)

        const response = await $.get(`/city/${cityName}`)

        if(Number(response.status) !== 404 && 
            !this.cityData.find(o => o.name == cityName)){
            const city = response.data
            this.cityData.unshift({
                _id: city._id,
                name: city.name,
                temperature: Math.round(city.temperature),
                condition: city.condition,
                conditionPic: city.conditionPic,
                isInDatabase: city.isInDatabase
            })
        }
    }

    saveCity(cityName) {
        let data = {}

        for (const city of this.cityData) {
            if (city.name === cityName){
                data = city
            }
        }
        data.isInDatabase = true
        
        $.post('/city', data, function (response) {
            console.log(response)
        })
    }

    removeCity(cityName){

        return $.ajax({
            url: `/city/${cityName}`,
            method: "DELETE",
            success: function (response) {
                console.log(response)
             },
             error: function (err) {
             }
        });
        
    }

    firstLetterToUpperCase (name) {
        let strArray = name.split(" ")
        let cityName
        let str 
        let charToUpperCase
        let charLowerCase 
        for (const indx in strArray) {
            str = strArray[indx]
            charToUpperCase = str.charAt(0).toUpperCase()
            charLowerCase = str.toLowerCase().slice(1)
            if (indx == 0) {
                cityName = charToUpperCase + charLowerCase
            } else {
                cityName = `${cityName} ${charToUpperCase}${charLowerCase}`
            }
        }
        return cityName
    }
}