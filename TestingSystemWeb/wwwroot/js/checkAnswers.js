const attemptData = JSON.parse(sessionStorage.getItem("attemptData"))


addEventListener("load", async () => {
    const answers = await getAnswers(attemptData)

    answers.forEach(answer => {
        displayAnswer(answer)
    })
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
    
    clone.querySelector("#question").innerText = answer.question.questionText

    const hasAnswer = !(answer?.answerText === null || answer.answerText.length == 0)
    clone.querySelector("#studentAnswer").innerText = hasAnswer ? answer.answerText : "Ответ не дан"

    const questionPanel = clone.querySelector(".questionPanel")
    const answerPanel = clone.querySelector("#answerPanel")

    questionPanel.dataset.id = answer.id

    if (answer.isCorrect !== null) {
        if (answer.isCorrect) {
            answerPanel.setAttribute("class", "correctAnswer")
        } else {
            answerPanel.setAttribute("class", "uncorrectAnswer")
        }
    }

    clone.querySelector("#correctButton").addEventListener("click", () => {
        answerPanel.setAttribute("class", "correctAnswer")
    })
    clone.querySelector("#uncorrectButton").addEventListener("click", () => {
        answerPanel.setAttribute("class", "uncorrectAnswer")
    })

    document.querySelector("#checkAnswersPanel").appendChild(clone)
}

function getAnswersData() {
    let answers = []

    document.querySelectorAll(".questionPanel").forEach(panel => {
        let isCorrect

        if (panel.querySelector("#answerPanel").getAttribute("class") == "correctAnswer") {
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