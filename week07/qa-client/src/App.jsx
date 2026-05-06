

import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css'

import { Question, Answer } from './models/QAModels.js'
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx'
import QuestionDisplay from './components/QuestionDisplay.jsx';
import AnswersDisplay from './components/AnswersDisplay.jsx'
import { useState } from 'react';

import dayjs from 'dayjs';
import { Container } from 'react-bootstrap';


function App() {
  const fakeQuestion = new Question(1, 'how are you?', 'me@mail.com', 24, '2025-04-01')
  const fakeAnswers = []
  fakeAnswers.push( new Answer(10, 'ok', 'a@b.com', 100, '2025-04-01', 1) )
  fakeAnswers.push( new Answer(11, 'it crashes', 'c@b.com', 101, '2025-03-31') )

  const [question, setQuestion] = useState(fakeQuestion)
  const [answers, setAnswers] = useState(fakeAnswers)


  const upVote = (id) => {
    setAnswers( ans => ans.map( a => (a.id==id ? {...a, score: a.score+1} : a)))
  }

  const delAnswer = (id) => {
    setAnswers( ans => ans.filter( a => a.id != id)) 
  }

  const addAnswer = (text) => {
    const newId = Math.max( ... answers.map(a=>a.id) ) + 1

    const ans = new Answer(
        newId, // the ID must be assigned by whoever is managing the list
        text, // coming from the user (the form)
        'a@b.com', // must come from user login
        1, // userId -> from login
        dayjs(), // date: today
        0 // score
    )

    setAnswers( (oldAnswers) => [...oldAnswers, ans] )
  }

  const updateAnswer = (id, text) => {


    setAnswers( oldAnswers => oldAnswers.map(ans => ans.id!=id ? ans : {...ans, text: text} ))
    
  }

  return (
    <Container>
    <Header></Header>
    
    <QuestionDisplay question={question}></QuestionDisplay>
    
    <AnswersDisplay answers={answers} upVote={upVote} delAnswer={delAnswer} addAnswer={addAnswer} updateAnswer={updateAnswer}></AnswersDisplay>
    {/* <Footer></Footer> */}
      
    </Container>
  )
}

export default App
