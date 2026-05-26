import { Navbar, Container, Form } from "react-bootstrap";

function Header(){
    return (
        <Navbar bg='primary'>
            <Container fluid>
                <Navbar.Brand className="d-flex align-items-center gap-2">
                    <i className="bi bi-film" style={{color:"white"}}></i>
                    <h2 style={{color:'white'}}>Film Library</h2>
                </Navbar.Brand>

                <div className="ms-auto d-flex align-item-center gap-3">
                    <Form>
                        <Form.Control type="search" placeholder="Search" aria-label="Search">
                        </Form.Control>
                    </Form>
                    <i className="bi bi-person-circle fs-3" style={{color:"white"}}></i>
                </div>
            </Container>
        </Navbar>
    )
}

export default Header