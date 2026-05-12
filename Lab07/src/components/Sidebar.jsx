import { Col, Container, ListGroup } from "react-bootstrap"

function Sidebar(props){
    const filtersList = props.filters
    return (
        <>
            <Container fluid>
                <h3 className="text-start">Filters</h3>

                <ListGroup>
                    {filtersList.map((f) => (
                    <ListGroup.Item
                        key={f}
                        action
                        active={props.selectedFilter === f}
                        onClick={() => props.onSelectedFilter(f)}
                    >
                        {f}
                    </ListGroup.Item>
                    ))}
                </ListGroup>
            </Container>
        </>
    )
}

export default Sidebar