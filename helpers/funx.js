const firstLetterToUpperCase = (name) => {
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


module.exports = {
    firstLetterToUpperCase
}