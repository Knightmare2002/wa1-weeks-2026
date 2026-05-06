import {Row, Col, Table, Button, Form} from "react-bootstrap"
import {ArrowUpSquare, Pencil, Trash, Plus} from "react-bootstrap-icons"
import { useState } from "react";


function AnswersTable (props){

    const answers = props.answers;
    const enableButtons = (props.mode=='display')
    const [editedAnswer, setEditedAnswer] = useState() ;

    const enterEditMode = (answer) => {
        props.setMode('edit')
        setEditedAnswer(answer)
    }

    return <><Table >
        <thead >
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Text</th>
                <th scope="col">Author</th>
                <th scope="col">Score</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
                {answers.map((a)=><AnswerRow key ={a.id} a={a}
                 upVote={props.upVote} delAnswer={props.delAnswer}
                 enableButtons={enableButtons}
                 enterEditMode={enterEditMode}></AnswerRow>)}
                <tr><td colspan='4'></td><td><Button variant='success' onClick={()=>props.setMode('add')}><Plus/></Button> <></></td></tr>
            </tbody>
    </Table>

    {/* { props.mode == 'add' && <AddOrEditAnswerForm goal='add' addAnswer={props.addAnswer} setMode={props.setMode}/> }
    { props.mode == 'edit' && <AddOrEditAnswerForm key={editedAnswer.id} goal='edit' editedAnswer={editedAnswer} updateAnswer={props.updateAnswer} setMode={props.setMode}/> } */}

    { (props.mode == 'edit' || props.mode=='add') && <AddOrEditAnswerForm key={editedAnswer?.id} goal={props.mode} editedAnswer={editedAnswer} addAnswer={props.addAnswer} updateAnswer={props.updateAnswer} setMode={props.setMode}/> }


    </>

}

function AddOrEditAnswerForm(props) {

    const [text, setText] = useState(props.goal=='edit' ? props.editedAnswer.text : '')

    // otherwise props?.editedAnswer?.text

    const submitAction = (event) => {
        event.preventDefault()

        // validate data

        // update the list of Answers in the main state
        if(props.goal=='add')
            props.addAnswer(text)
        else
            props.updateAnswer(props.editedAnswer.id, text)

        // close the form
        props.setMode('display')
    }

    // return <form onSubmit={submitAction}>
    //     <Row><Col>
    //         Text: <input type='text' value={text} onChange={(e) => setText(e.target.value)} />
    //     </Col></Row>
    //     <Row><Col>
    //         <input type='submit' value='Add Answer' />
    //     </Col></Row>
    // </form>

    return <Form onSubmit={submitAction}>
        <Form.Group>
            <Form.Label>Answer text</Form.Label>
            <Form.Control type='text' placeholder="your answer" value={text} onChange={(e) => setText(e.target.value)}></Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
            {props.goal=='add'? "Add": "Update" }
        </Button>
        <Button type="cancel" onClick={()=>props.setMode("display")}>
            Cancel
        </Button>
    </Form>

 
}

function AddAnswerFormUncontrolled(props) {

    const submitAction = (event) => {
        event.preventDefault()

        // console.log(event.target)
        // console.log(event.target.text)
        // console.log(event.target.text.value)
        const text = event.target.text.value

        // // validate data

        // // update the list of Answers in the main state
        props.addAnswer(text)

        // // close the form
        props.setMode('display')
    }

    return <Form onSubmit={submitAction}>
        <Form.Group>
            <Form.Label>Answer text</Form.Label>
            <Form.Control name='text' type='text' placeholder="your answer" ></Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
            Submit
        </Button>

    </Form>

 
}


function AnswerRow (props){
    const ans = props.a;
    return(
        <tr>
                <td>{ans.date.format('YYYY-MM-DD')}</td>
                <td>{ans.text}</td>
                <td>{ans.email}</td>
                <td>{ans.score}</td>
                <AnswerActionButtons enterEditMode={props.enterEditMode} enableButtons={props.enableButtons} answer={ans} upVote={props.upVote} delAnswer={props.delAnswer}/>
              </tr>
    )
}

function AnswerActionButtons(props) { 
    return <td>
        <Button disabled={!props.enableButtons} variant='primary' onClick={()=>props.upVote(props.answer.id)}><ArrowUpSquare/></Button> <></>
        <Button variant='warning'><Pencil onClick={()=>props.enterEditMode(props.answer)}/></Button> <></>
        <Button variant='danger' onClick={()=>props.delAnswer(props.answer.id)}><Trash/></Button>
    </td>
}

function AnswersDisplay (props){

    const [mode, setMode] = useState('display') ;

    return (
        <>
        <Row>
            <Col as='h2' className='text-start'>Answers:</Col>
            
        </Row>
        <Row>
            <AnswersTable mode={mode} setMode={setMode} answers={props.answers} upVote={props.upVote} delAnswer={props.delAnswer} addAnswer={props.addAnswer} updateAnswer={props.updateAnswer}></AnswersTable>
        </Row>
        </>
    )

}

export default AnswersDisplay