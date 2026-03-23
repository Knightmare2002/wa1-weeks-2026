import express from 'express'
import morgan from 'morgan'
import dayjs from 'dayjs'

import {param, body, validationResult} from 'express-validator'

import { Film } from './entities.js'
import * as func from './functions.js'


const app = express()

const log = morgan('dev')
app.use(log)
app.use(express.json())

function errorResponse(err){
    return {
        "error": err.message
    }
}

const PREFIX = '/api/films'

// GET
app.get(PREFIX + '/:id', (req, res) => {
    const id = req.params.id

    func.getFilmByID(id)
    .then(film => res.json(film))
    .catch(err => {
        if(err.message === "Nessun file trovato con questo ID"){
            res.status(404).json(errorResponse(err))
        }

        else{
            res.status(500).json(errorResponse(err))
        }
    })
})

app.get(PREFIX, (req, res) => {
    const filter = req.query.filter

    if(filter == 'favorite'){
        func.getFavoriteFilms()
            .then(films => res.json(films))
            .catch(err => res.status(500).json(errorResponse(err)))
    }

    else if (filter == 'bestRated'){
        func.getBestRatedFilms()
        .then(films => res.json(films))
        .catch(err => res.status(500).json(errorResponse(err)))
    }

    else if (filter == 'lastMonth'){
        const today = dayjs()

        func.getRecentlyWatchedFilms(today)
        .then(films => res.json(films))
        .catch(err => res.status(500).json(errorResponse(err)))
    }

    else if (filter == 'Unseen'){
        func.getUnseenFilms()
        .then(films => res.json(films))
        .catch(err => res.status(500).json(errorResponse(err)))
    }

    else if (!filter){
        func.getFilms()
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
app.post(PREFIX, (req, res) => {
    const { title, favorite, rating, watchDate } = req.body;

   
    const parsedDate = watchDate ? dayjs(watchDate) : null;

   
    const userID = 1;

   
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
app.put(`${PREFIX}/:id`, (req, res) => {
    const id = req.params.id;

    
    const { title, favorite, rating, watchDate } = req.body;

   
    const parsedDate = watchDate ? dayjs(watchDate) : null;
    
    
    const userID = 1;

    
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

app.put(`${PREFIX}/:id/rating`, (req, res) => {
    const id = req.params.id

    const rating = req.body.rating

    if(!rating || rating < 1 || rating >5){
        return res.status(422).json({
            "error": "Il voto deve essere un intero compreso tra 1 e 5"
        })
    }

    func.updateRating(id, rating)
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

app.put(`${PREFIX}/:id/favorite`, (req, res) => {
    const id = req.params.id

    const favorite = req.body.favorite

    if ( typeof favorite !== 'boolean'){
        return res.status(422).json({
            "error": "Il campo 'favorite' deve essere un booleano."
        })
    }

    func.updateFavorite(id, favorite)
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
app.delete(`${PREFIX}/:id`, (req, res) => {

    const id = req.params.id;
    func.deleteFilm(id)
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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});