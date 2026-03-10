import dayjs from 'dayjs'

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
}

let id = 0

const film1 = new Film(id++, "Transformers", true, null, 8, 0)

const film2 = new Film(id++, "Transformers 2", false, dayjs("2026-03-11"), 6, 0)

const film3 = new Film(id++, "Transformers 3", true, dayjs("2026-03-07"), 10, 0)

const film4 = new Film(id++, "Transformers 4", true, dayjs("2026-03-19"), 6, 0)

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
filmLibrary.printFilms()


