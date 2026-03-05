import dayjs from 'dayjs' 

class Answer {
    constructor(text, id, score, date) {
        this.text = text
        this.id = id
        this.score = score
        this.date = dayjs(date)
    }
}

class Question{
    constructor(text, id, date){
        this.text = text
        this.id = id
        this.date = dayjs(date)
        
        this.answers = []
    }

    addAnswer = (ans) => {
        this.answers.push(ans)
    }

    getAnswer = (userID) => {
        return this.answers.filter(a => a.id == userID)
    }

    afterDate = (date) => {
        return this.answers.filter(a => a.date.isAfter(dayjs(date)))
    }

    listByDate = () => {
        return this.answers.sort((a, b) =>
        {
            const date1 = a.date
            const date2 = b.date

            return date1.diff(date2)
        })
    }

    listbyScore = () => {
        return this.answers.sort((a,b) => b.score - a.score)
    }

}

const q1 = new Question(
    "Mi reputi strano?",
    0,
    "2026-03-06"
)

const a1 = new Answer(
    "Sei un pò deficiente",
    0,
    10,
    "2026-03-07"
)

const a2 = new Answer(
    "Ma secondo me non sei strano",
    1,
    7,
    "2026-03-08"
)

q1.addAnswer(a2)
q1.addAnswer(a1)

//console.log(q1)

const userID = 0
//console.log("Answers of User ", userID, ": ", q1.getAnswer(userID))

const date = "2026-03-07"
//console.log("Answers After ", date, ": ", q1.afterDate(date))

//console.log("Answers sorted by Date: ", q1.listByDate())

console.log("Answers sorted by Score: ", q1.listbyScore())