const attemptData = JSON.parse(sessionStorage.getItem("attemptData"))
let answers
let answersAmount


addEventListener("load", async () => {
    answers = await getAnswers(attemptData)
    answersAmount = answers.length

    answers.forEach(answer => {
        displayAnswer(answer)
    })
    
    calculateNotCheckedAnswersAmount()
})


document.querySelector("#saveButton").addEventListener("click", async () => {
    await fetch(`tests/${attemptData.userId}/${attemptData.attempt}/setMark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            test: attemptData.test,
            answers: getAnswersData()
        })
    }).then(response => {
        if (response.ok === true) {
            window.location.href = "studentsResults"
        }
    })
})



async function getAnswers(attemptData) {
    return await fetch(`tests/${attemptData.test.id}/${attemptData.userId}/${attemptData.attempt}`)
        .then(async response => {
            if (response.ok === true) {
                return await response.json()
            }
        })
}

function displayAnswer(answer) {
    const clone = document.querySelector("#questionTemplate")
        .content.cloneNode(true)
    
    clone.querySelector("#questionNumber").innerText = `${answers.indexOf(answer) + 1}/${answersAmount}`
    clone.querySelector("#question").innerText = answer.question.questionText

    const hasAnswer = !(answer?.answerText === null || answer.answerText.length == 0)
    clone.querySelector("#studentAnswer").innerText = hasAnswer ? answer.answerText : "Ответ не дан"

    const questionPanel = clone.querySelector(".questionPanel")
    const answerPanel = clone.querySelector("#answerPanel")

    questionPanel.dataset.id = answer.id
    questionPanel.dataset.isCorrect = answer.isCorrect

    if (answer.isCorrect !== null) {
        if (answer.isCorrect) {
            answerPanel.classList.add("correctAnswer")
            answerPanel.classList.remove("uncorrectAnswer")
        } else {
            answerPanel.classList.add("uncorrectAnswer")
            answerPanel.classList.remove("correctAnswer")
        }
    }

    clone.querySelector("#correctButton").addEventListener("click", () => {
        answerPanel.classList.add("correctAnswer")
        answerPanel.classList.remove("uncorrectAnswer")
        questionPanel.dataset.isCorrect = "true"
        calculateNotCheckedAnswersAmount()
    })
    clone.querySelector("#uncorrectButton").addEventListener("click", () => {
        answerPanel.classList.add("uncorrectAnswer")
        answerPanel.classList.remove("correctAnswer")
        questionPanel.dataset.isCorrect = "false"
        calculateNotCheckedAnswersAmount()
    })

    document.querySelector("#checkAnswersPanel").appendChild(clone)
}

function getAnswersData() {
    let answers = []

    document.querySelectorAll(".questionPanel").forEach(panel => {
        let isCorrect

        if (panel.querySelector("#answerPanel").classList.contains("correctAnswer")) {
            isCorrect = true
        } else {
            isCorrect = false
        }

        answers.push({
            id: panel.dataset.id,
            isCorrect: isCorrect
        })
    })

    return answers
}

function calculateNotCheckedAnswersAmount() {
    let notCheckedAnswersAmount = 0

    document.querySelectorAll(".questionPanel").forEach(panel => {
        if (panel.dataset.isCorrect === "null") {
            ++notCheckedAnswersAmount
        }
    })

    document.querySelector("#notCheckedAnswersAmount").innerText = notCheckedAnswersAmount
}