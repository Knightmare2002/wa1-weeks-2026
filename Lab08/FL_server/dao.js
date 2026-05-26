import sqlite from 'sqlite3'
import dayjs from 'dayjs'
import { Film } from './entities.js'
import crypto from 'crypto'

const db = new sqlite.Database('films.db', (err) => {
    if (err){
        console.log(`Connection Error: ${err.message}`)
    }
    else{
        console.log('Database successfully connected')
    }
})

// ==== Retrieve the list of all the available films. ====
export function getFilms(userID){
    return new Promise((resolve, rejects) => {
        const query = "SELECT * FROM films where userId = ?"
        db.all(query, [userID], (err, rows) => {
            if (err){
                rejects(err)
            }
            else{
                resolve(rows.map(item => {
                    const watchDate = item.watchDate ? dayjs(item.watchDate) : null;
                    return new Film(item.id, item.title, item.isFavorite, watchDate, item.rating, item.userId)
                }))
            }
        })
    })
} 

// ==== Retrieve a list of all the films that fulfill each of the following filters ====
export function getFavoriteFilms(userID){
    return new Promise((resolve, rejects) => {
        const query = "SELECT * FROM films WHERE isFavorite = 1 AND userId = ?"
        db.all(query, [userID], (err, rows) => {
            if (err){
                rejects(err)
            }
            else{
                resolve(rows.map(item => {
                    const watchDate = item.watchDate ? dayjs(item.watchDate) : null;
                    return new Film(item.id, item.title, item.isFavorite, watchDate, item.rating, item.userId)
                }))
            }
        })
    })
} 

export function getBestRatedFilms(userID){
    return new Promise((resolve, rejects) => {
        const query = "SELECT * FROM films WHERE rating = 5 AND userId = ?"
        db.all(query, [userID], (err, rows) => {
            if (err){
                rejects(err)
            }
            else{
                resolve(rows.map(item => {
                    const watchDate = item.watchDate ? dayjs(item.watchDate) : null;
                    return new Film(item.id, item.title, item.isFavorite, watchDate, item.rating, item.userId)
                }))
            }
        })
    })
}

export function getRecentlyWatchedFilms(Date, userID){
    return new Promise((resolve, rejects) => {
        const month = `${Date.format("YYYY-MM")}-%`

        const query = "SELECT * FROM films WHERE watchDate LIKE ? AND userId = ?"
        db.all(query, [month, userID], (err, rows) => {
            if (err){
                rejects(err)
            }
            else{
                resolve(rows.map(item => {
                    const watchDate = item.watchDate ? dayjs(item.watchDate) : null;
                    return new Film(item.id, item.title, item.isFavorite, watchDate, item.rating, item.userId)
                }))
            }
        })
    })
}

export function getUnseenFilms(userID){
    return new Promise((resolve, rejects) => {
        const query = "SELECT * FROM films WHERE watchDate IS NULL AND userId = ?"
        db.all(query, [userID], (err, rows) => {
            if (err){
                rejects(err)
            }
            else{
                resolve(rows.map(item => {
                    const watchDate = item.watchDate ? dayjs(item.watchDate) : null;
                    return new Film(item.id, item.title, item.isFavorite, watchDate, item.rating, item.userId)
                }))
            }
        })
    })
}

// ==== Retrieve a film given its id. ====
export function getFilmByID(ID, userID){
    return new Promise((resolve, rejects) => {
        const query = "SELECT * FROM films WHERE id = ? AND userId = ?"
        
        // Chiamiamo la variabile 'row' (singolare)
        db.get(query, [ID, userID], (err, row) => {
            if (err){
                rejects(err)
            }
            else if (!row) {
                // Se non c'è nessuna riga, l'ID non esiste!
                rejects(new Error("Nessun film trovato con questo ID"))
            }
            else {
                // Nessun map! Creiamo e restituiamo direttamente il film
                const watchDate = row.watchDate ? dayjs(row.watchDate) : null;
                resolve(new Film(row.id, row.title, row.isFavorite, watchDate, row.rating, row.userId))
            }
        })
    })
}

// ==== Create a new film, by providing all its properties (as per the previous labs) - except the id that will be automatically assigned by the back-end. ====
export function addFilm(title, isFavorite, rating, watchDate, userID){
    return new Promise((resolve, rejects) => {
        const favoriteDB = isFavorite ? 1 : 0
        const watchDateDB = watchDate ? watchDate.format('YYYY-MM-DD') : null

        const query = "INSERT INTO films (title, isFavorite, rating, watchDate, userId) VALUES  (?, ?, ?, ?, ?)"

        const parameters = [title, favoriteDB, rating, watchDateDB, userID]

        db.run(query, parameters, function(err) {
            if (err) {
                rejects(err);
                return;
            }
            resolve(this.lastID);
        })
    })
}

// ==== Update an existing film, by providing all its updated properties. ====
export function updateFilm(id, title, isFavorite, rating, watchDate, userID) {
    return new Promise((resolve, rejects) => {
        const favoriteDb = isFavorite ? 1 : 0;
        const watchDateDb = watchDate ? watchDate.format('YYYY-MM-DD') : null;

        const query = `
            UPDATE films 
            SET title = ?, isFavorite = ?, rating = ?, watchDate = ?, userId = ? 
            WHERE id = ? AND userId = ?
        `;

        const parameters = [title, favoriteDb, rating, watchDateDb, userID, id, userID];

        db.run(query, parameters, function(err) {
            if (err) {
                rejects(err);
                return;
            }

            if (this.changes === 0) {
                rejects(new Error("Nessun film trovato con questo ID"));
                return;
            }

            resolve(this.changes);
        });
    });
}

// ==== Update the rating of a specific film. ====
export function updateRating(id, newRating, userID){
    return new Promise((resolve, rejects) => {
        const query = "UPDATE films SET rating = ? WHERE id = ? AND userId = ?"

        const parameters = [newRating, id, userID]

        db.run(query, parameters, function(err){
            if(err){
                rejects(err)
                return
            }

            if(this.changes === 0){
                rejects(new Error("Nessun film trovato con questo ID"))
                return
            }

            resolve(this.changes)
        })
    })
}

// ==== Mark an existing film as favorite/unfavorite. ====
export function updateFavorite(id, newFavorite, userID){
    return new Promise((resolve, rejects) => {
        const query = "UPDATE films SET isFavorite = ? WHERE id = ? AND userId = ?"
        const parameters = [newFavorite, id, userID]

        db.run(query, parameters, function(err){
            if(err){
                rejects(err)
                return
            }
            if(this.changes === 0){
                rejects(new Error("Nessun film trovato con questo ID"))
                return
            }
            resolve(this.changes)
        })
    })
}
// ==== Delete an existing film given its id. ====
export function deleteFilm(id, userID){
    return new Promise((resolve, rejects) => {
        const query = "DELETE FROM films WHERE id = ? and userId = ?"
        const parameters = [id, userID]

        db.run(query, parameters, function(err){
            if(err){
                rejects(err)
                return
            }
            if(this.changes === 0){
                rejects(new Error("Nessun film trovato con questo ID"))
                return
            }
            resolve(this.changes)
        })
    })
}

//====USERS====
export function getUser(email, password){
    return new Promise((resolve, rejects) => {
        const query = "SELECT * FROM users WHERE email = ?"

        db.get(query, [email], (err, row) => {
            if(err){
                rejects(err)
            }

            else if(!row){
                resolve(false)
            }

            else{
                const user = {
                    id: row.id,
                    username: row.email,
                    name: row.name
                }

                //Non stiamo recuperando la password originale, ma stiamo semplicemente andando a creare un buffer binario usando password + salt. Andremo poi a confrontarlo con quello salvato nel db e se coincidono allora ci siamo.
                crypto.scrypt(password, row.salt, 32, function(err, hashedPassword){
                    if (err){
                        rejects(err)
                        return
                    }

                    const passwordBuffer = Buffer.from(row.hash, 'hex')

                    if(!crypto.timingSafeEqual(passwordBuffer, hashedPassword)){
                        resolve(false)
                    }
                    else{
                        resolve(user)
                    }
                })
            }
        })
    })
}
