import sqlite from 'sqlite3'
import dayjs from 'dayjs'
import { Film } from './entities.js'

const db = new sqlite.Database('films.db', (err) => {
    if (err){
        console.log(`Connection Error: ${err.message}`)
    }
    else{
        console.log('Database successfully connected')
    }
})

// ==== Retrieve the list of all the available films. ====
export function getFilms(){
    return new Promise((resolve, rejects) => {
        const query = "SELECT * FROM films"
        db.all(query, (err, rows) => {
            if (err){
                rejects(err)
            }
            else{
                resolve(rows.map(item => {
                    const watchDate = item.watchDate ? dayjs(item.watchDate) : null;
                    return new Film(item.id, item.title, item.isFavorite, watchDate, item.rating, item.userID)
                }))
            }
        })
    })
} 

// ==== Retrieve a list of all the films that fulfill each of the following filters ====
export function getFavoriteFilms(){
    return new Promise((resolve, rejects) => {
        const query = "SELECT * FROM films WHERE isFavorite = 1"
        db.all(query, (err, rows) => {
            if (err){
                rejects(err)
            }
            else{
                resolve(rows.map(item => {
                    const watchDate = item.watchDate ? dayjs(item.watchDate) : null;
                    return new Film(item.id, item.title, item.isFavorite, watchDate, item.rating, item.userID)
                }))
            }
        })
    })
} 

export function getBestRatedFilms(){
    return new Promise((resolve, rejects) => {
        const query = "SELECT * FROM films WHERE rating = 5"
        db.all(query, (err, rows) => {
            if (err){
                rejects(err)
            }
            else{
                resolve(rows.map(item => {
                    const watchDate = item.watchDate ? dayjs(item.watchDate) : null;
                    return new Film(item.id, item.title, item.isFavorite, watchDate, item.rating, item.userID)
                }))
            }
        })
    })
}

export function getRecentlyWatchedFilms(Date){
    return new Promise((resolve, rejects) => {
        const month = `${Date.format("YYYY-MM")}-%`

        const query = "SELECT * FROM films WHERE watchDate LIKE ?"
        db.all(query, [month], (err, rows) => {
            if (err){
                rejects(err)
            }
            else{
                resolve(rows.map(item => {
                    const watchDate = item.watchDate ? dayjs(item.watchDate) : null;
                    return new Film(item.id, item.title, item.isFavorite, watchDate, item.rating, item.userID)
                }))
            }
        })
    })
}

export function getUnseenFilms(){
    return new Promise((resolve, rejects) => {
        const query = "SELECT * FROM films WHERE watchDate IS NULL"
        db.all(query, (err, rows) => {
            if (err){
                rejects(err)
            }
            else{
                resolve(rows.map(item => {
                    const watchDate = item.watchDate ? dayjs(item.watchDate) : null;
                    return new Film(item.id, item.title, item.isFavorite, watchDate, item.rating, item.userID)
                }))
            }
        })
    })
}

// ==== Retrieve a film given its id. ====
export function getFilmByID(ID){
    return new Promise((resolve, rejects) => {
        const query = "SELECT * FROM films WHERE id = ?"
        
        // Chiamiamo la variabile 'row' (singolare)
        db.get(query, [ID], (err, row) => {
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
                resolve(new Film(row.id, row.title, row.isFavorite, watchDate, row.rating, row.userID))
            }
        })
    })
}

// ==== Create a new film, by providing all its properties (as per the previous labs) - except the id that will be automatically assigned by the back-end. ====
export function addFilm(title, isFavorite, rating, watchDate, userID){
    return new Promise((resolve, rejects) => {
        const favoriteDB = isFavorite ? 1 : 0
        const watchDateDB = watchDate ? watchDate.format('YYYY-MM-DD') : null

        const query = "INSERT INTO films (title, isFavorite, rating, watchDate, userID) VALUES  (?, ?, ?, ?, ?)"

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
            SET title = ?, isFavorite = ?, rating = ?, watchDate = ?, userID = ? 
            WHERE id = ?
        `;

        const parameters = [title, favoriteDb, rating, watchDateDb, userID, id];

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
export function updateRating(id, newRating){
    return new Promise((resolve, rejects) => {
        const query = "UPDATE films SET rating = ? WHERE id = ?"

        const parameters = [newRating, id]

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
export function updateFavorite(id, newFavorite){
    return new Promise((resolve, rejects) => {
        const query = "UPDATE films SET isFavorite = ? WHERE id = ?"
        const parameters = [newFavorite, id]

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
export function deleteFilm(id){
    return new Promise((resolve, rejects) => {
        const query = "DELETE FROM films WHERE id = ?"
        const parameters = [id]

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
