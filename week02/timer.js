"use strict";

console.log("Start")

let count = 1

setInterval( ()=>{
    let count = 1
    console.log(`Finished ${count}`);
    count++
    }, 1000 )

console.log("End")

// do some long computation that takes more than 1 second

console.log(count)
// will print 1 because the async code had no chance of executing