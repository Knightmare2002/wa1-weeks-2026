import { Film } from '../../FL_server/entities'

import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import FilmTable from './components/FilmTable'
import LoginPage from './components/LoginPage'
import UserContext from './context/UserContext'
import { Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom'

import { checkSession } from './api/auth'
import { getFilms } from './api/api'

function getFilteredFilms(films, selectedFilter) {
  const today = dayjs()
  switch (selectedFilter) {
    case 'favorites':
      return films.filter((film) => film.favorite === true);

    case 'best-rated':
      return films.filter((film) => film.rating === 5);

    case 'seen-last-month': {
      const thirtyDaysAgo = dayjs().subtract(30, 'day');
      return films.filter((film) =>
        film.watchDate && film.watchDate.isAfter(thirtyDaysAgo) && film.watchDate.isBefore(today)
      );
    }

    case 'unseen':
      return films.filter((film) => !film.watchDate);

    case 'all':
    default:
      return films;
  }
}

function App(){
    const navigate = useNavigate()

    //===== STATES =====
    const [films, setFilms] = useState([])

    const [showForm, setShowForm] = useState(false)

    const [filmToEdit, setEditingFilm] = useState(null)

    const [user, setUser] = useState({id: undefined, name: undefined})

    //===== EFFECTS ======

    //Mounting
    useEffect(() => {
      checkSession().then(result => {
        if(result){
          setUser({
            id: result.id,
            name: result.name
          })
        }
      })
    }, [])

    //Carica i film del server dopo l'autenticazione
    useEffect(() => {
      if (user.id) {
        getFilms()
          .then(filmList => setFilms(filmList))
          .catch(err => console.error('Errore nel caricamento dei film:', err))
      }
    }, [user.id])

    //===== CALLBACKS =====
    const handleLogin = (newUser) => {
      setUser({id: newUser.id, name: newUser.name})

      navigate('/app')
    }

    const handleLogout = () => {
      setUser({ id: undefined, name: undefined })
      setFilms([])
      navigate('/')
    }

    //===== HANDLERS =====

    const handleSaveFilm = (film) => {

      //EDIT
      if (filmToEdit) {
        setFilms(oldFilms =>
          oldFilms.map((f) =>
            f.ID === filmToEdit.ID
              ? new Film(
                  filmToEdit.ID,
                  film.title,
                  film.favorite,
                  film.watchDate,
                  film.rating,
                  1
                )
              : f
          )
        );

        setEditingFilm(null);
        setShowForm(false);
        return;
      }

      //ADD
      const newId = films.at(-1).ID + 1;

      const newFilm = new Film(
        newId,
        film.title,
        film.favorite,
        film.watchDate,
        film.rating,
        1
      );

      setFilms(oldFilms => oldFilms.concat(newFilm));
      setShowForm(false);
    };

    const handleEditFilm = (film) => {
      setEditingFilm(film);
      setShowForm(true);
    };

    const handleDeleteFilm = (film) => {
      setFilms((oldFilms) => {
        return oldFilms.filter((f) => {return f.ID !== film.ID})
      })
    };

    
    const filters = [
      {label: 'All', path: 'all'},
      {label: 'Favorites', path: 'favorites'},
      {label: 'Best Rated', path: 'best-rated'},
      {label: 'Seen Last Month', path: 'seen-last-month'},
      {label: 'Unseen', path: 'unseen'}
    ]

    

    
    
    return (
      <UserContext.Provider value={user}>
        <Routes>
          <Route path='/' element={<LoginPage onLogin={handleLogin}/>} />

          <Route path='/app' element={<MainLayout filters={filters} />}>
            <Route
              index
              element={
                user.id ?
                <HomePage
                  visibleFilms={getFilteredFilms(films, 'all')}
                  setShowForm={setShowForm}
                  showForm={showForm}
                  handleSaveFilm={handleSaveFilm}
                  handleDeleteFilm={handleDeleteFilm}
                  handleEditFilm={handleEditFilm}
                  filmToEdit={filmToEdit}
                /> : <Navigate to='/'/>
              }
            />

            <Route
              path='filter/:filterName'
              element={
                user.id ?
                <FilterPage
                  films={films}
                  setShowForm={setShowForm}
                  showForm={showForm}
                  handleSaveFilm={handleSaveFilm}
                  handleDeleteFilm={handleDeleteFilm}
                  handleEditFilm={handleEditFilm}
                  filmToEdit={filmToEdit}
                /> : <Navigate to='/'/>
              }
            />
          </Route>

          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </UserContext.Provider>
    )
}

function HomePage(props){
  return(
    <FilmTable 
      films={props.visibleFilms}
      onShowForm={props.setShowForm}
      showForm={props.showForm}
      onSave={props.handleSaveFilm}
      onEditFilm={props.handleEditFilm}
      editingFilm={props.filmToEdit}
      onDelete={props.handleDeleteFilm}
      />
  )
}

function MainLayout(props){
  return (
    <>
      <Header/>

      <Row className='flex-grow-1'>
        <Col xs={4} style={{background:"lightgray"}}>
          <Sidebar 
            filters={props.filters}/>
        </Col>

        <Col className='position-relative'>
          <Outlet/>
        </Col>
      </Row>
    </>
  )
}

//Possiamo sostituire HomePage direttamente con questa funzione volendo
function FilterPage(props){
  const { filterName } = useParams()

  const visibleFilms = getFilteredFilms(props.films, filterName)

  return(
    <FilmTable 
      films={visibleFilms}
      onShowForm={props.setShowForm}
      showForm={props.showForm}
      onSave={props.handleSaveFilm}
      onEditFilm={props.handleEditFilm}
      editingFilm={props.filmToEdit}
      onDelete={props.handleDeleteFilm}
      />
  )
}

function NotFoundPage(){
  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <h2>Page not found</h2>
      <p>The requested URL is not valid.</p>
    </div>
  )
}

export default App

