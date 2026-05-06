import { useContext } from "react"
import { Button, Container, Navbar } from "react-bootstrap"
import { Link } from 'react-router'

import UserContext from "../contexts/UserContext"

function Header(props) {

  const user = useContext(UserContext)

  const destination = user.id ? '/home' : '/'

  return (
    <Navbar bg='info' >
      <Container fluid>
        <h1 style={{ color: 'white' }} ><Link to={destination}>HeapOverrun</Link></h1>
        <p>{user.name || <LoginButton doLogin={props.doLogin} />}</p>
      </Container>
    </Navbar>)
}

function LoginButton(props) {
  return <Button onClick={() => props.doLogin()}>Log In</Button>
}


export default Header