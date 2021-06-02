const express = require('express')
const router = express.Router()
const request = require('request')

const City = require("../models/City")
const helpers = require('../../helpers/funx')
const WEATHER_API = "https://api.openweathermap.org/data/2.5/weather?q="
const API_KEY = "5f2ef77ab2ebe928102ffe423e8c062b"
const IMAGE_URL = "http://openweathermap.org/img/w/"

const getWeatherAPI = cityName => {
    return `${WEATHER_API}${cityName}&units=metric&appid=${API_KEY}`
}

const searchAndFindWeatherCity = cityName => {
    return new Promise(function (resolve, reject) {
        request(getWeatherAPI(cityName), function (error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve({ code: 200, data: body });
            } else {
                reject({ code: 422, data: error });
            }
        });
    });
}

router.get('/city/:cityName', async function (req, resp) {
    let { cityName } = req.params
    let finalResp = { code: 404, data: null }

    try {
        const foundedCity = await City.find({ name: helpers.firstLetterToUpperCase(cityName) })

        if (foundedCity.length === 0) {
            const bodyResp = await searchAndFindWeatherCity(cityName);

            if (bodyResp.code === 200) {
                let cityData = JSON.parse(bodyResp.data)

                let city = new City({
                    name: cityData.name,
                    temperature: Math.round(cityData.main.temp),
                    condition: cityData.weather[0].description,
                    conditionPic: `${IMAGE_URL}${cityData.weather[0].icon}.png`,
                    isInDatabase: false
                })

                finalResp = { status: cityData.cod, data: city };
            }
        }

    } catch (e) {
        console.error(e)
    }

    resp.send(finalResp)
})

router.get('/cities', function (req, res) {
    City.find({})
        .sort({ _id: -1 })
        .exec(function (err, cities) {
            res.send(cities)
        })
})

router.post('/city/', function (request, response) {
    let data = request.body

    let city = new City({
        name: data.name,
        temperature: data.temperature,
        condition: data.condition,
        conditionPic: data.conditionPic,
        isInDatabase: data.isInDatabase
    })

    const citySavedPromise = city.save()

    citySavedPromise.then(function (citySaved) {
        if (citySaved != null)
            response.send(`The ${citySaved.name} city successfuly has been saved :)`)
        else
            response.send(`Ohhh! Faield to save the ${cityName} city :(`)
    })

})

router.delete('/city/:cityName', function (request, response) {
    const { cityName } = request.params
    const cityPromise = City.find({ name: cityName }, { _id: 1 })
    cityPromise.then(function (cityId) {

        const removedCity = City.deleteOne({ _id: cityId })

        removedCity.then(function (removed) {
            if (removed.deletedCount == 1) {
                response.send(`The ${cityName} city successfuly hase been removed :)`)
            } else {
                response.send(`Ohhh! Faield to remove the ${cityName} city :(`)
            }
        })

    })

})

module.exports = router

