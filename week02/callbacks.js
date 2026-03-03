"use strict";

// CLOSURES 

function distance_sign(metric=true) {
    let conversion = 1.0
    let unit = "km"
    if (metric == false) {
        conversion = 0.621371
        unit = "miles"
    }

    function sign_text(meters) {
        const value = (meters / 1000.0 * conversion).toFixed(3)

        const msg = `${value} ${unit}`

        return msg

    }

    return sign_text

}


const sign_eu = distance_sign()
const sign_uk = distance_sign(false)

console.log( sign_eu(1500) )
console.log( sign_uk(1500) )