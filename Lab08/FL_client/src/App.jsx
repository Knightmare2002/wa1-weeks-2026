import { Film } from '../../FL_server/entities'

import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import FilmTable from './components/FilmTable'
import LoginPage from './components/LoginPage'
import UserContext from './context/UserContext'
import { Outlet, Route, Routes, useParams } from 'react-router-dom'

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


    const initialFilms = []
    initialFilms.push(new Film(1, "Transformers", true, dayjs("11-10-2007", "DD-MM-YYYY"), 5, 1))
    initialFilms.push(new Film(2, "Transformers 2", false, dayjs("11-10-2009", "DD-MM-YYYY"), 3, 1))
    initialFilms.push(new Film(3, "Transformers 3", false, null, null, 1))

    const filters = [
      {label: 'All', path: 'all'},
      {label: 'Favorites', path: 'favorites'},
      {label: 'Best Rated', path: 'best-rated'},
      {label: 'Seen Last Month', path: 'seen-last-month'},
      {label: 'Unseen', path: 'unseen'}
    ]
    //const [selectedFilter, setSelectedFilter] = useState('All') Logica state-based

    const [films, setFilms] = useState(initialFilms)

    //const visibleFilms = getFilteredFilms(films, selectedFilter) Logica state-based

    const [showForm, setShowForm] = useState(false)

    const [filmToEdit, setEditingFilm] = useState(null)

    const user = {name: 'Guest'}
    
    return (
      <UserContext.Provider value={user}>
        <Routes>
          <Route path='/' element={<LoginPage />} />

          <Route path='/app' element={<MainLayout filters={filters} />}>
            <Route
              index
              element={
                <HomePage
                  visibleFilms={getFilteredFilms(films, 'all')}
                  setShowForm={setShowForm}
                  showForm={showForm}
                  handleSaveFilm={handleSaveFilm}
                  handleDeleteFilm={handleDeleteFilm}
                  handleEditFilm={handleEditFilm}
                  filmToEdit={filmToEdit}
                />
              }
            />

            <Route
              path='filter/:filterName'
              element={
                <FilterPage
                  films={films}
                  setShowForm={setShowForm}
                  showForm={showForm}
                  handleSaveFilm={handleSaveFilm}
                  handleDeleteFilm={handleDeleteFilm}
                  handleEditFilm={handleEditFilm}
                  filmToEdit={filmToEdit}
                />
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

