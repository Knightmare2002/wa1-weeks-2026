import { Film } from '../../Lab03/entities'

import { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import FilmTable from './components/FilmTable'

function getFilteredFilms(films, selectedFilter) {
  const today = dayjs()
  switch (selectedFilter) {
    case 'Favorites':
      return films.filter((film) => film.favorite === true);

    case 'Best Rated':
      return films.filter((film) => film.rating === 5);

    case 'Seen Last Month': {
      const thirtyDaysAgo = dayjs().subtract(30, 'day');
      return films.filter((film) =>
        film.watchDate && film.watchDate.isAfter(thirtyDaysAgo) && film.watchDate.isBefore(today)
      );
    }

    case 'Unseen':
      return films.filter((film) => !film.watchDate);

    case 'All':
    default:
      return films;
  }
}

function App(){
    const handleSaveFilm = (film) => {
      const newId = films.at(-1).id + 1;

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

    const initialFilms = []
    initialFilms.push(new Film(1, "Transformers", true, dayjs("11-10-2007", "DD-MM-YYYY"), 5, 1))
    initialFilms.push(new Film(2, "Transformers 2", false, dayjs("11-10-2009", "DD-MM-YYYY"), 3, 1))
    initialFilms.push(new Film(3, "Transformers 3", false, null, null, 1))

    const filters = ["All", "Favorites", "Best Rated", "Seen Last Month", "Unseen"]
    const [selectedFilter, setSelectedFilter] = useState('All')

    const [films, setFilms] = useState(initialFilms)

    const visibleFilms = getFilteredFilms(films, selectedFilter)

    const [showForm, setShowForm] = useState(false)
    
    return (
        <>
            <Header></Header>

            <Row className='flex-grow-1'>
                <Col xs={4} style={{background:"lightgray"}}>
                    <Sidebar 
                        filters={filters} 
                        selectedFilter={selectedFilter} 
                        onSelectedFilter={setSelectedFilter}/>
                </Col>

                <Col className='position-relative'>
                    <FilmTable 
                      films={visibleFilms}
                      onShowForm={setShowForm}
                      showForm={showForm}
                      onSave={handleSaveFilm}/>
                </Col>
            </Row>
            
            
        </>
    )
}
export default App

