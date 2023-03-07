

document.getElementById("saveAnswersButton").addEventListener("click", () => {
    
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

    clone.getElementById("questionText").innerText = question.question

    if (question.answersVariants.length == 0) {
        const openAnswerClone = document.getElementById("openAnswerTemplate")
            .content.cloneNode(true)
        answersPanel.appendChild(openAnswerClone)
    } else {
        question.answersVariants.forEach(answerVariant => {
            answersPanel.appendChild(getCloseAnswerClone(answerVariant, question.questionText))
        })
    }

    questionsPanel.appendChild(clone)
}

function getCloseAnswerClone(answerVariant, questionText) {
    const clone = document.getElementById("closeAnswerTemplate")
        .content.cloneNode(true)

    clone.getElementById("answer").innerText = answerVariant
    clone.getElementById("answerButton").name = questionText

    return clone
}