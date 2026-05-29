import express from 'express'
import morgan from 'morgan'
import dayjs from 'dayjs'
import session from 'express-session'
import passport from 'passport'
import cors from 'cors'
import LocalStrategy from 'passport-local'

import {param, body, validationResult} from 'express-validator'


import { Film } from './entities.js'
import * as func from './dao.js'


const app = express()
const port = 3001

const log = morgan('dev')
app.use(log)
app.use(express.json())

//=====CONFIGURAZIONE CORS=====

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true    
}

app.use(cors(corsOptions))

function errorResponse(err){
    return {
        "error": err.message
    }
}

//=====CONFIGURAZIONE PASSPORT=====
//Vediamo se l'autenticazione è andata a buon fine
passport.use(new LocalStrategy({usernameField: 'email'}, async function verify(username, password, cb){
    const user = await func.getUser(username, password)

    if(!user){
        return cb(null, false, 'Incorrect username or password.')
    }

    return cb(null, user)
}))

//Creiamo un gestore di sessioni. Da questo moemnto in poi, ogni volta che arriva una richiesta dal brower express-session controlla se quel browser ha un cookie ID di sessione. Se ce l'ha, recupera i dati dell'utente; se non ce l'ha, valuta se crearne uno nuovo
app.use(session({
    secret: "shhh...it's a secret",
    resave: false,
    saveUninitialized: false
}))

//Collega passport al gestore di sessioni. Mettiamo l'utente memorizzato e lo mettiamo in req.user
app.use(passport.authenticate('session'))

//Salviamo le info dell'user per la sessione attuale req.session.passport
passport.serializeUser(function (user, cb){
    cb(null, user) //genera una sessione sul server e un cookie inviato al browser
})

//Ogni volta che compiamo un'azione, affinchè si tenga conto di tutte le informazioni della sessione, viene chiamata questa funzione. Questo perchè HTTP è stateless.
passport.deserializeUser(function (user,cb){
    return cb(null, user) //genera l'oggetto che posso usare nelle routes Express
})

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next()
    }

    return res.status(401).json({error: 'Not Authorized'})
}

//=====ROUTES SESSIONI=====
//L'opzione local serve a controllare se l'user è memorizzato in req.body
app.post('/api/sessions', passport.authenticate('local'), function(req, res) {
    return res.status(201).json(req.user)
})

app.get('/api/sessions/current', function (req, res){
    if(req.isAuthenticated()){
        return res.json(req.user)
    }

    return res.status(401).json({error: 'Not authorized'})
})

app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => res.end())
})

//=====ROUTES FILMS=====
const PREFIX = '/api/films'

// GET
app.get(PREFIX + '/:id', isLoggedIn, (req, res) => {
    const id = req.params.id
    const userID = req.user.id

    func.getFilmByID(id, userID)
    .then(film => res.json(film))
    .catch(err => {
        if(err.message === "Nessun film trovato con questo ID"){
            res.status(404).json(errorResponse(err))
        }

        else{
            res.status(500).json(errorResponse(err))
        }
    })
})

app.get(PREFIX, isLoggedIn, (req, res) => {
    const filter = req.query.filter
    const userID = req.user.id

    if(filter == 'favorites'){
        func.getFavoriteFilms(userID)
            .then(films => res.json(films))
            .catch(err => res.status(500).json(errorResponse(err)))
    }

    else if (filter == 'best-rated'){
        func.getBestRatedFilms(userID)
        .then(films => res.json(films))
        .catch(err => res.status(500).json(errorResponse(err)))
    }

    else if (filter == 'seen-last-month'){
        const today = dayjs()

        func.getRecentlyWatchedFilms(today, userID)
        .then(films => res.json(films))
        .catch(err => res.status(500).json(errorResponse(err)))
    }

    else if (filter == 'unseen'){
        func.getUnseenFilms(userID)
        .then(films => res.json(films))
        .catch(err => res.status(500).json(errorResponse(err)))
    }

    else if (!filter){
        func.getFilms(userID)
        .then(films => res.json(films))
        .catch(err => res.status(500).json(errorResponse(err)))
    }

    else{
        res.status(400).json({
            "error": `Filtro ${filter} non valido.`
        })
    }
})

// POST
app.post(PREFIX, isLoggedIn, (req, res) => {
    const { title, favorite, rating, watchDate } = req.body;
    const userID = req.user.id

   
    const parsedDate = watchDate ? dayjs(watchDate) : null;

   
    func.addFilm(title, favorite, rating, parsedDate, userID)
        .then(newId => {
            
            res.status(201).json({ id: newId });
        })
        .catch(err => {
            
            res.status(500).json(errorResponse(err));
        });
});

// PUT
// PUT - Aggiorna un film esistente in modo completo
app.put(`${PREFIX}/:id`, isLoggedIn, (req, res) => {
    const id = req.params.id;
    const userID = req.user.id

    
    const { title, favorite, rating, watchDate } = req.body;

   
    const parsedDate = watchDate ? dayjs(watchDate) : null;
    
    func.updateFilm(id, title, favorite, rating, parsedDate, userID)
        .then(() => {
            res.status(200).end();
        })
        .catch(err => {
            if (err.message === "Nessun film trovato con questo ID") {
                res.status(404).json(errorResponse(err));
            } else {
                res.status(500).json(errorResponse(err));
            }
        });
});

app.put(`${PREFIX}/:id/rating`, isLoggedIn, (req, res) => {
    const id = req.params.id
    const userID = req.user.id

    const rating = req.body.rating

    if(!rating || rating < 1 || rating >5){
        return res.status(422).json({
            "error": "Il voto deve essere un intero compreso tra 1 e 5"
        })
    }

    func.updateRating(id, rating, userID)
    .then(() => res.status(200).end())
    .catch(err => {
        if(err.message === "Nessun film trovato con questo ID"){
            res.status(404).json(errorResponse(err))
        }
        else{
            res.status(500).json(errorResponse(err))
        }
    })
})

app.put(`${PREFIX}/:id/favorite`, isLoggedIn, (req, res) => {
    const id = req.params.id
    const userID = req.user.id

    const favorite = req.body.favorite

    if ( typeof favorite !== 'boolean'){
        return res.status(422).json({
            "error": "Il campo 'favorite' deve essere un booleano."
        })
    }

    func.updateFavorite(id, favorite, userID)
    .then(() => res.status(200).end())
    .catch( err => {
        if(err.message === "Nessun film trovato con questo ID"){
            res.status(404).json(errorResponse(err))
        }
        else{
            res.status(500).json(errorResponse(err))
        }
    })

})

// DELETE
app.delete(`${PREFIX}/:id`, isLoggedIn, (req, res) => {

    const id = req.params.id;
    const userID = req.user.id

    func.deleteFilm(id, userID)
        .then(() => { 
            res.status(200).end();
        })
        .catch(err => {
            if (err.message === "Nessun film trovato con questo ID") {
                res.status(404).json(errorResponse(err));

            } else {
                res.status(500).json(errorResponse(err));
            }
        });
});



app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});