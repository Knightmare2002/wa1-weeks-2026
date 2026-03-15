import dayjs from 'dayjs'
import sqlite from 'sqlite3'

const db = new sqlite.Database("films.db", (err) => {
    if (err)
        console.log(`Connection Error: ${err.message}`)
    
    else
        console.log("Database connected successfully")
})

const dbCopy = new sqlite.Database("films copy.db", (err) => {
    if (err)
        console.log(`Connection Error: ${err.message}`)
    
    else
        console.log("Database connected successfully")
})

class Film{
    constructor(ID, title, favorite=false, watchDate=null, rating, userID){
        this.ID = ID
        this.title = title
        this.favorite = favorite
        this.watchDate = watchDate
        this.rating = rating
        this.userID = userID

    }

    
}

class FilmLibrary{
    constructor(ID, films=[]){
        this.ID = ID
        this.films = films
    }

    addFilm = (film=Film) => {
        this.films.push(film)
    }

    printFilms = () => {
        this.films.forEach((film) => {
        console.log(`Id: ${film.ID}, Title: ${film.title}, Favorite: ${film.favorite}, Watch Date: ${film.watchDate}, Rating: ${film.rating}, Userd ID: ${film.userID}\n\n`)
})
    }

    sortByDate = () => {
    this.films = this.films.sort((f1, f2) => {
        // Caso 1: Nessuno dei due film ha una data. Sono uguali, non spostarli.
        if (!f1.watchDate && !f2.watchDate) return 0;
        
        // Caso 2: f1 non ha la data. Deve andare in fondo alla lista (restituiamo 1)
        if (!f1.watchDate) return 1;
        
        // Caso 3: f2 non ha la data. f2 va in fondo, quindi f1 viene prima (restituiamo -1)
        if (!f2.watchDate) return -1;
        
        // Caso 4: Entrambi i film hanno una data. Ordiniamo normalmente dal più vecchio al più recente.
        return f1.watchDate.diff(f2.watchDate);
    });
    }

    sortByRating = () => {
        this.films = this.films.sort((f1, f2) => {
            return f2.rating - f1.rating
        })
    }

    removeFilm = (fid) => {
        const updated_list = this.films.filter((f) => {
            return f.ID !== fid
        })

        return this.films = updated_list
    }

    updateRating = (fid, newRating) => {
        this.films = this.films.map((f) => {
            if (f.ID == fid){
                f.rating = newRating
            }
            return f
        })
    }

    // ===== ASYNCHRONOUS METHODS =====
    getTableStructure = () => {
        db.all("PRAGMA table_info(films)", (err, columns) => {
            if (err) {
                console.error("Errore durante la lettura dello schema:", err.message);
                return;
            }
            
            console.log("--- STRUTTURA DELLA TABELLA ---");
            console.log(columns);
            
            // Se vuoi stampare SOLO i nomi delle colonne in modo più pulito:
            console.log("\n--- NOMI DELLE COLONNE ---");
            const columnNames = columns.map(col => col.name);
            console.log(columnNames);
        });
    }

    getAllFilms = () => {
        return new Promise((resolve, rejects) => {
            const query = 'SELECT * FROM films'

            db.all(query, (err, rows) => {
                if (err){
                    rejects(err)
                }

                else{
                    const filmList = rows.map((row) => {
                        const isFavorite = row.isFavorite === 1

                        const watchDate = row.watchDate ? dayjs(row.watchDate) : null

                        return new Film(
                            row.ID, 
                            row.title, 
                            isFavorite, 
                            watchDate, 
                            row.rating, 
                            row.userID
                        );
                    })
                    resolve(filmList)
                }
            })
            
        })
    }

    getAllFavorite = () => {
        return new Promise((resolve, rejects) => {
            const query = 'SELECT * FROM films WHERE isFavorite = 1'

            db.all(query, (err, rows) => {
                if(err){
                    console.log(`getAllFavorite error: ${err.message}`)
                    rejects(err)
                }

                else{
                    const filmList = rows.map((row) => {
                        const isFavorite = row.isFavorite === 1

                        const watchDate = row.watchDate ? dayjs(row.watchDate) : null

                        return new Film(
                            row.ID, 
                            row.title, 
                            isFavorite, 
                            watchDate, 
                            row.rating, 
                            row.userID
                        );
                    })
                    resolve(filmList)
                }
            })
        })
    }

    retrieveFilmByDate = (date) => {
        return new Promise((resolve, rejects) => {
            const query = "SELECT * FROM films WHERE watchDate < ?"
            const formattedDate = dayjs(date).format('YYYY-MM-DD') 

            db.all(query, [formattedDate], (err, rows) => {
                if (err)
                    rejects(err)

                else{
                    const filmLists = rows.map((row) => {
                        const isFavorite = row.isFavorite === 1

                        const watchDate = row.watchDate ? dayjs(row.watchDate) : null

                        return new Film(
                            row.ID, 
                            row.title, 
                            isFavorite, 
                            watchDate, 
                            row.rating, 
                            row.userID
                        )
                })
                resolve(filmLists)}
            })
        })
    }

    retrieveFilmByTitle = (str) => {
        return new Promise((resolve, rejects) => {
            const query = 'SELECT * FROM films WHERE title LIKE ?'
            const search = `%${str}%`

            db.all(query, [search], (err, rows) => {
                if (err){
                    rejects(err)
                }

                else{
                    const films = rows.map((row) => {
                        const isFavorite = row.isFavorite === 1
                        const watchDate = row.watchDate ? dayjs(row.watchDate) : null

                        return new Film(
                            row.ID,
                            row.title,
                            isFavorite,
                            watchDate,
                            row.rating,
                            row.userID
                        )
                    })
                    resolve(films)
                }

            })
        })
    }

    // ===== MODIFY DATASET COPY =====
    addRow = (film) => {
        return new Promise((resolve, rejects) => {
            const query = "INSERT INTO films (id, title, isFavorite, rating, watchDate, userID) VALUES (?, ?, ?, ?, ?, ?)"

            const isFavorite = film.favorite ? 1 : 0
            const watchDate = film.watchDate ? film.watchDate.format('YYYY-MM-DD') : null

            const parameters = [film.ID, film.title, isFavorite, film.rating, watchDate, film.userID]

            dbCopy.run(query, parameters, function(err) {
                if(err){
                    rejects(err)
                    return
                }
                
                resolve(this.lastID)
            })
        })
    }

    deleteRow = (ID) => {
        return new Promise((resolve, rejects) => {
            const query = "DELETE FROM films WHERE id = ?"
            const parameter = ID
            dbCopy.run(query, [parameter], (err, rows) => {
                if (err){
                    rejects(err)
                    return
                }
                resolve(ID)
            })
        })
    }

    deleteWatchDate = () => {
        return new Promise((resolve, rejects) => {
            const query = "UPDATE films SET watchDate = NULL"

            dbCopy.run(query, (err, rows) => {
                if (err){
                    rejects(err)
                    return
                }
                resolve(rows)
            })
        })
    }


}



let id = 6

const film1 = new Film(id++, "Transformers", true, null, 4, 0)

const film2 = new Film(id++, "Transformers 2", false, dayjs("2026-03-11"), 2, 0)

const film3 = new Film(id++, "Transformers 3", true, dayjs("2026-03-07"), 5, 0)

const film4 = new Film(id++, "Transformers 4", true, dayjs("2026-03-19"), 2, 0)

const filmLibrary = new FilmLibrary(0)
filmLibrary.addFilm(film1)
filmLibrary.addFilm(film2)
filmLibrary.addFilm(film3)
filmLibrary.addFilm(film4)


//filmLibrary.printFilms()


filmLibrary.sortByDate()
//filmLibrary.printFilms()

filmLibrary.sortByRating()
//filmLibrary.printFilms()


filmLibrary.removeFilm(3)
//filmLibrary.printFilms()

filmLibrary.updateRating(1, 7)
//filmLibrary.printFilms()

//===== LAB02 =====

//filmLibrary.getTableStructure()

/*filmLibrary.getAllFilms()
            .then((filmsFromDB) => {
                console.log("--- FILM RECUPERATI DAL DATABASE ---");

                // Stampiamo l'array di oggetti Film
                console.log(filmsFromDB);
            })
            .catch((err) => {
                console.error("Errore durante il recupero dei film:", err.message)
            })
*/

/*filmLibrary.getAllFavorite()
            .then((filmsFromDB) => {
                console.log("--- FILM PREFERITI RECUPERATI DAL DATABASE ---");
                console.log(filmsFromDB);
            })
            .catch((err) => {
                console.error("Errore durante il recupero dei film preferiti:", err.message)
            })
*/

/*const date = '2026-03-15'
filmLibrary.retrieveFilmByDate(date)
            .then((films) => {
                console.log(`--- FILM PRECEDENTI A ${date} RECUPERATI DAL DATABASE ---`);
                console.log(films)
            })
            .catch((err) => {
                console.error("Errore durante il recupero dei film:", err.message)
            })
*/

/*const str = 'sh'
filmLibrary.retrieveFilmByTitle(str)
            .then((films) => {
                console.log(`--- FILM CONTENENTI ${str}  ---`);
                console.log(films)
            })
            .catch((err) => {
                console.error("Errore durante il recupero dei film:", err.message)
            })
*/
const toAdd = film1
/*filmLibrary.addRow(toAdd)
            .then((filmsFromDB) => {
                console.log(`--- FILM ${toAdd.title} AGGIUNTO AL DATABASE ---`);

                console.log(filmsFromDB);
            })
            .catch((err) => {
                console.error("Errore durante l'aggiunta del film:", err.message)
            })
*/
const toDelete = 2
/*filmLibrary.deleteRow(toDelete)
            .then((filmID) => {
                console.log(`FILM WITH ID=${filmID} REMOVED`)
            })
            .catch((err) => {
                console.log('Errore durante la rimozione del film: ', err)
            })
*/

filmLibrary.deleteWatchDate()
            .then(() => {
                console.log("WATCHDATE ELIMINATE")
            })
            .catch((err) => {
                console.log('Errore nella cancellazione delle watchdate: ', err)
            })


db.close()