let questionsModel
let timeToPassTest

let questionsAmount

document.getElementById("saveAnswersButton").addEventListener("click", () => {
    window.removeEventListener("beforeunload", beforeunloadHandler)
    window.location.href = "/"
})



addEventListener("load", async () => {
    document.querySelector("#progress-bar").style.display = "block"
    document.querySelector("#questionsPanel").style.display = "none"
    
    await loadPage()

    document.querySelector("#progress-bar").style.display = "none"
    document.querySelector("#questionsPanel").style.display = "grid"
})

async function loadPage() {
    await fetch(`tests/${window.sessionStorage.getItem("testId")}`).then(async response => {
        if (response.ok === true) {
            questionsModel = await response.json()
        } else {
            window.location.href = "/"
        }
    })

    const questions = questionsModel.questions
    questionsAmount = questions.length

    document.title = `Room - ${questionsModel?.testName ?? "Тест без названия"}`

    displayQuestions(questions)

    setInputsEvents()

    const timeToPass = questionsModel.test.timeToPass
    if (!(timeToPass === null || timeToPass <= 0)) {
        timeToPassTest = timeToPass
        showTime()
        setTimeout(timeOut, timeToPass * 1000);
        setInterval(showTime, 1000)
    } else {
        document.querySelector("#time-separator").innerText = "--:--"
    }
}

function timeOut() {
    timerOut = true;
    window.location.href = "/"
}

window.addEventListener("unload", async e => {
    e.preventDefault()
    await saveAnswers()
})

var timerOut = false

window.addEventListener("beforeunload", beforeunloadHandler)

function beforeunloadHandler(e) {
    if (timerOut)
        return
    e.preventDefault();
    e.returnValue = "";
}


function showTime() {
    const minuts = Math.floor(timeToPassTest / 60)
    const minutsText = minuts > 9 ? `${minuts}` : `0${minuts}`
    const seconds = timeToPassTest % 60
    const secondsText = seconds > 9 ? `${seconds}` : `0${seconds}`

    document.querySelector("#minuts").innerText = minutsText
    document.querySelector("#seconds").innerText = secondsText

    --timeToPassTest
}

function displayQuestions(questions) {
    questions.forEach(question => {
        displayQuestion(question)
    })
}
function displayQuestion(question) {
    const clone = document.getElementById("questionTemplate").content.cloneNode(true)
    const answersPanel = clone.getElementById("answersPanel")

    clone.querySelector("#questionNumber").innerText = `${questionsModel.questions.indexOf(question) + 1}/${questionsAmount}`
    clone.querySelector(".question").dataset.questionId = question.id

    clone.getElementById("questionText").innerText = question.question

    if (question.answersVariants.length == 0) {
        const openAnswerClone = document.getElementById("openAnswerTemplate")
            .content.cloneNode(true)
        answersPanel.appendChild(openAnswerClone)
    } else {
        question.answersVariants.forEach(answerVariant => {
            answersPanel.appendChild(getCloseAnswerClone(answerVariant, question.id))
        })
    }

    questionsPanel.appendChild(clone)
}

function getCloseAnswerClone(answerVariant, questionId) {
    const clone = document.getElementById("closeAnswerTemplate")
        .content.cloneNode(true)

    clone.getElementById("answerVariantText").innerText = answerVariant
    clone.querySelector(".answerVariantButton").dataset.answerVariant = answerVariant
    clone.querySelector(".answerVariantButton").name = questionId

    return clone
}



async function saveAnswers() {
    await fetch("tests/writeAnswers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getAnswersModel())
    }).then(() => {
        window.location.href = "/"
    })
}

function getAnswersModel() {
    return {
        test: questionsModel.test,
        answers: getAnswers()
    }
}
function getAnswers() {
    let answers = []

    document.querySelectorAll(".question").forEach(questionPanel => {
        const questionId = questionPanel.dataset.questionId
        const answerText = getAnswer(questionPanel)
        answers.push({
            questionId: questionId,
            answerText: answerText,
            testId: questionsModel.test.id
        })
    })

    return answers
}
function getAnswer(panel) {
    const openAnswer = panel.querySelector("input.answer")

    if (openAnswer !== null) {
        return openAnswer.value
    } else {
        let answer
        panel.querySelectorAll(".answerVariantButton").forEach(button => {
            if (button.checked == true) {
                answer = button.dataset.answerVariant
            }
        })
        return answer
    }
}