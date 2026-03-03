import sqlite from 'sqlite3'

const db = new sqlite.Database('data.sqlite', (err)=> {
    if(!err) {
        console.log("DB opened successfully")
        console.log(db)
    } else {
        console.log(err)
        console.log(db)
    }
} )

db.all("SELECT id, name FROM users", (err, rows) => {
    if(err)
        console.log(err)
    else {
        console.log(rows)
    }
})

db.get("SELECT id, name FROM users", (err, row) => {
    if(err)
        console.log(err)
    else {
        console.log(row)
    }
})

db.each("SELECT id, name FROM users", (err, row) => {
    if(err)
        console.log(err)
    else {
        console.log(row)
    }
})


const names = new Promise( (resolve, reject) => {
    db.all("SELECT name FROM users", (err, rows)=> {
        if (err)
            reject(err)
        else {
            resolve( rows.map(r => r.name) )
        }
    })
} )

names.then( (result)=> console.log(result) )
    .catch( err => console.log(err))



////// all this code will run BEFORE the query is started

console.log()