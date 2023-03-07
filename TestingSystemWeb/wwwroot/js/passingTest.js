

document.getElementById("candelButton").addEventListener("click", () => {
    window.location.href = "/"
})



function loadPage() {
    const currentTest = JSON.parse(window.sessionStorage.getItem("test"))
    const questions = currentTest.questions

    document.title = `Room - ${currentTest?.test?.name}`

    displayQuestions(questions)
}

function displayQuestions(questions) {
    questions.forEach(question => {
        displayQuestion(question)
    })
}
function displayQuestion(question) {
    const clone = document.getElementById("questionTemplate").content.cloneNode(true)
    const answersPanel = clone.getElementById("answersPanel")

    clone.getElementById("questionText").innerText = question.questionText

    if (question.incorrectAnswers === null) {
        const openAnswerClone = document.getElementById("openAnswerTemplate")
            .content.cloneNode(true)
        answersPanel.appendChild(openAnswerClone)
    } else {
        question.incorrectAnswers.forEach(incorrectAnswer => {
            answersPanel.appendChild(getCloseAnswerClone(incorrectAnswer, question.questionText))
        })
    }

    questionsPanel.appendChild(clone)
}

function getCloseAnswerClone(incorrectAnswer, questionText) {
    const clone = document.getElementById("closeAnswerTemplate")
        .content.cloneNode(true)

    clone.getElementById("answer").innerText = incorrectAnswer
    clone.getElementById("answerButton").name = questionText

    return clone
}