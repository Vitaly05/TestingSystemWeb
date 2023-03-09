const answersModel = JSON.parse(window.sessionStorage.getItem("answersModel"))

answersModel.forEach(model => {
    const clone = document.querySelector("#questionTemplate").content.cloneNode(true)

    clone.querySelector("#question").innerText = model.question.questionText
    const answerPanel = clone.querySelector("#answerPanel")

    const correctAnswer = model.question.answer
    if (model.answerText == correctAnswer) {
        answerPanel.appendChild(getCorrectAnswerClone(correctAnswer))
    } else {
        answerPanel.appendChild(getUncorrectAnswerClone(model.answerText, correctAnswer))
    }

    document.querySelector("#checkAttemptPanel").appendChild(clone)
})

function getCorrectAnswerClone(answer) {
    const clone = document.querySelector("#correctUserAnswerTemplate").content.cloneNode(true)

    clone.querySelector("#userAnswer").innerText = answer
    
    return clone
}
function getUncorrectAnswerClone(userAnswer, correctAnswer) {
    const clone = document.querySelector("#uncorrectUserAnswerTemplate").content.cloneNode(true)

    const hasAnswer = !(userAnswer === null || userAnswer.length == 0)
    clone.querySelector("#userAnswer").innerText = hasAnswer ? userAnswer : "Вы не дали ответ"
    clone.querySelector("#correctAnswer").innerText = correctAnswer
    
    return clone
}