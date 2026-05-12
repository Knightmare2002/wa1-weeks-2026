import { Button, Container, Row, Table } from "react-bootstrap";
import AddFilmForm from "./addFilmForm";
import { useState } from "react";



function TableRow(props){
    const film = props.film
    const date = film.watchDate
    return(
        <tr>
            <td className="text-start">
                <div className="d-flex align-items-center justify-content-start gap-2">
                    <Button style={{background:'white', border:'none'}}>
                        <i className="bi bi-heart" style={{color:'black'}}></i>
                    </Button>
                    {film.title}
                </div>                
            </td>

            <td>{date ? date.format('DD-MM-YYYY') : ""}</td>

            <td>
                <div className="d-flex gap-1">
                    <Button 
                        variant="warning" 
                        style={{border:'none'}}
                        onClick={() => props.onEditFilm(film)}>
                            <i className="bi bi-pencil" style={{color:'black'}}></i>
                    </Button>

                    <Button 
                        variant="danger" 
                        style={{border:'none'}}
                        onClick={() => props.onDelete(film)}>
                            <i className="bi bi-trash" style={{color:'black'}}></i>
                    </Button>
                </div>
            </td>
        </tr>
    )
}

function FilmTable(props){
        const films = props.films
    return (
        <>
            <Table>
                <tbody>
                    {films.map((film) => <TableRow key={film.ID} film={film} onEditFilm={props.onEditFilm} onDelete={props.onDelete}/>)}
                </tbody>
            </Table>
            {!props.showForm ? (
                <Button className="position-absolute bottom-0 end-0 m-4 shadow rounded-circle" onClick={() => {props.onShowForm(true); props.onEditFilm(null)}}>
                    <i className="bi bi-plus fs-6"></i>
                </Button>
            ) : (
                <AddFilmForm
                    filmToEdit={props.editingFilm} 
                    onCancel={() => props.onShowForm(false)}
                    onSave={props.onSave}
                    />

            )}
            
            
        </>

    )
}

export default FilmTable