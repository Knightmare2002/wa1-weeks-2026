import { Container, ListGroup } from "react-bootstrap"
import { NavLink } from "react-router"

function Sidebar(props){
    const filtersList = props.filters
    return (
        <>
            <Container fluid>
                <h3 className="text-start">Filters</h3>

                <ListGroup>
                    {filtersList.map((f) => (
                    <ListGroup.Item
                        key={f.path}
                        as={NavLink}
                        to={f.path === "all" ? "/app" : `/app/filter/${f.path}`}
                        end={f.path === 'all'}
                        action
                        // Non abbiamo più bisogno della logica state-based in quanto ora la truth arriva direttamente dall'URL (logica Router-based)
                         
                        //active={props.selectedFilter === f}
                        //onClick={() => props.onSelectedFilter(f)}
                    >
                        {f.label}
                    </ListGroup.Item>
                    ))}
                </ListGroup>
            </Container>
        </>
    )
}

export default Sidebar