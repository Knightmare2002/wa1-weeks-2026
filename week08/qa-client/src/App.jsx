

import 'bootstrap/dist/css/bootstrap.min.css';

import dayjs from 'dayjs';

import { useContext, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router';

import AnswersDisplay from './components/AnswersDisplay.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import { QuestionsList } from './components/QuestionDisplay.jsx';

import UserContext from './contexts/UserContext.js';

import { Answer, Question } from './models/QAModels.js';

function App() {
  const fakeQuestion = new Question(1, 'how are you?', 'me@mail.com', 24, '2025-04-01')
  const fakeAnswers = []
  fakeAnswers.push(new Answer(10, 'ok', 'a@b.com', 100, '2025-04-01', 1))
  fakeAnswers.push(new Answer(11, 'it crashes', 'c@b.com', 101, '2025-03-31'))

  const [question, setQuestion] = useState(fakeQuestion)
  const [answers, setAnswers] = useState(fakeAnswers)

  const navigate = useNavigate()

  // Currently logged-in user
  const [user, setUser] = useState({ id: undefined, email: undefined, name: undefined })

  const doLogin = () => {
    setUser({ id: 100, email: 'a@b.com', name: 'User-A' })
    navigate('/home')
  }

  const upVote = (id) => {
    setAnswers(ans => ans.map(a => (a.id == id ? { ...a, score: a.score + 1 } : a)))
  }

  const delAnswer = (id) => {
    setAnswers(ans => ans.filter(a => a.id != id))
  }

  const addAnswer = (text) => {

    if (user.id == undefined) {
      throw new Error("No User ID")
    }
    const newId = Math.max(...answers.map(a => a.id)) + 1

    const ans = new Answer(
      newId, // the ID must be assigned by whoever is managing the list
      text, // coming from the user (the form)
      user.email, // must come from user login
      user.id, // userId -> from login
      dayjs(), // date: today
      0 // score
    )

    setAnswers((oldAnswers) => [...oldAnswers, ans])
  }

  const updateAnswer = (id, text) => {


    setAnswers(oldAnswers => oldAnswers.map(ans => ans.id != id ? ans : { ...ans, text: text }))

  }

  return (
    <UserContext.Provider value={user}>
      <Container>
        <Routes>
          <Route path='/' element={<MainLayout doLogin={doLogin} />}>
            <Route index element={<LoginView />} />
            <Route path='home' element={<HomeView questions={[question]} />} />
            <Route path='answers/:questionId' element={<AnswersDisplay answers={answers}
              upVote={upVote} delAnswer={delAnswer} addAnswer={addAnswer} updateAnswer={updateAnswer} />} />
            {/* <Route path='answers/:questionId/new' element={<AddAnswerForm/>}/> */}
          </Route>
        </Routes>
      </Container>
    </UserContext.Provider>
  )
}

function MainLayout(props) {
  return <>
    <Header doLogin={props.doLogin}></Header>
    <Outlet />
    <Footer></Footer>
  </>
}

function LoginView(props) {

  // if user.id is not undefined, navigate to /home
  const user = useContext(UserContext)
  if (user.id)
    return <Navigate to='/home' />

  return "Login View : main welcome page for anonymous users"
}

function HomeView(props) {

  // if user.id is not defined, navigate to /
  const user = useContext(UserContext)

  // if you want to navigate "away", just render a Navigate component
  if (!user.id)
    return <Navigate to='/' />

  // otherwise render normal page content
  return <QuestionsList questions={props.questions} />
}




export default App


// <Header doLogin={doLogin}></Header>

// <QuestionDisplay question={question}></QuestionDisplay>

// <AnswersDisplay answers={answers} upVote={upVote} delAnswer={delAnswer} addAnswer={addAnswer} updateAnswer={updateAnswer}></AnswersDisplay>
// {/* <Footer></Footer> */}


