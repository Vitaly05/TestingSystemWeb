const answersModel = JSON.parse(window.sessionStorage.getItem("answersModel"))

addEventListener("load", () => {
    const mark = window.sessionStorage.getItem("mark")
    document.querySelector("#mark").innerText = mark
})

answersModel.forEach(model => {
    const clone = document.querySelector("#questionTemplate")
        .content.cloneNode(true)
    clone.querySelector("#question").innerText = model.question.questionText

    const hasAnswer = !(model?.answerText === null || model.answerText.length == 0)
    clone.querySelector("#studentAnswer").innerText = hasAnswer ? model.answerText : "Ответ не дан"

    const questionPanel = clone.querySelector(".questionPanel")
    const answerPanel = clone.querySelector("#answerPanel")
    questionPanel.dataset.isCorrect = model.isCorrect

    if (model.isCorrect !== null) {
        if (model.isCorrect) {
            answerPanel.classList.add("correctAnswer")
            answerPanel.classList.remove("uncorrectAnswer")
        } else {
            answerPanel.classList.add("uncorrectAnswer")
            answerPanel.classList.remove("correctAnswer")
        }
    }
    document.querySelector(".main-div").appendChild(clone)
})


document.querySelector("#backButton").addEventListener("click", () => {
    window.location.href = "testResults"
})