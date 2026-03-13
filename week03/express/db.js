import sqlite from 'sqlite3'

const db = new sqlite.Database('questions.sqlite')

function getUsers() {
    return new Promise( (resolve, reject) => {
        db.all('SELECT * FROM user', (err, rows) => {
            if(err) reject(err)
            else resolve(rows)
        })
    })    
}

export {getUsers}