import sqlite from 'sqlite3'

const db = new sqlite.Database('questions.sqlite', (err) => {
    if(err)
        console.log("Error in opening database")
    else
        console.log("Database connected successfully")
})

function getUserNames() {
    /* returns Promise that resolves to an array of strings */
    return new Promise((resolve, reject) => {
        const sql = 'SELECT name FROM user'
        db.all(sql, (err, rows) => {
            if(err) {
                reject(err)
            } else {
                // rows
                const result = rows.map( row => row.name )
                resolve(result)
            }
        })
    }) ;
}

function getEmailByUserName(userName) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT email FROM user WHERE name=?'
        db.get(sql, [userName], (err, row) => {
            if(err) {
                reject(err)
            } else {
                // single row -- or not row at all
                if(row) {
                    resolve(row.email)
                } else {
                    reject("Unknown user name")
                }
            }
        })
    }) ;
}


// getUserNames().then(u => console.log(u))

// getEmailByUserName('Marco Zeta').then(mail => console.log(mail))

// retrieve and print all user names and emails

getUserNames().then(names => {
    /* const emails = []
    for(const name of names) {
        getEmailByUserName(name).then(mail=> {
            console.log(mail)
            emails.push(mail)
            console.log(emails)
        })
    } */

    Promise.all( names.map( name => getEmailByUserName(name) )).then( emails => {
        console.log(emails)
    })
})

function getAllEmails() {
    return new Promise((resolve, reject) => {
        getUserNames().then(names => {
            Promise.all( names.map( name => getEmailByUserName(name)) ).then( (emails) => resolve(emails))
        })

    })
}

async function getAllEmails2() {
    const names = await getUserNames()
    const emails = []
    for (const name of names) {
        const email = await getEmailByUserName(name)
        emails.push(email)
    }
    return emails
}

console.log("try this")
const result = await getAllEmails2()
console.log(result)
getAllEmails2().then(result => console.log(result))

