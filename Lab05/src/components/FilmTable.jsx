import { Button, Container, Row, Table } from "react-bootstrap";

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
                <div>
                    <Button style={{border:'none', background:'white'}}>
                        <i class="bi bi-pencil" style={{color:'black'}}></i>
                    </Button>
                    <Button style={{border:'none', background:'white'}}>
                        <i class="bi bi-trash" style={{color:'black'}}></i>
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
                    {films.map((film) => <TableRow key={film.ID} film={film}/>)}
                </tbody>
            </Table>

            <Button className="position-absolute bottom-0 end-0 m-4 shadow rounded-circle">
                <i class="bi bi-plus fs-6"></i>
            </Button>
        </>

    )
}

export default FilmTable