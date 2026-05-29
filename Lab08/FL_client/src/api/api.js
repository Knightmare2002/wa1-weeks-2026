const SERVER_URL = 'http://localhost:3001'

async function getFilms(filter){
    const url = filter ? `${SERVER_URL}/api/films?filter=${filter}` : `${SERVER_URL}/api/films`

    const response = await fetch(url, {credentials: 'include'})

    if(response.ok){
        return await response.json()
    }
    throw new Error('Errore nel caricamento del film.')
}

export default {getFilms}