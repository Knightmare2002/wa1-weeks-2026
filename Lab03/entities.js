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
}

export{Film, FilmLibrary}