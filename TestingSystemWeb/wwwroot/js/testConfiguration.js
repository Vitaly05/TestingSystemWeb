let testConfigurationType = "add"
let currentTest
let allQuestions

const questionTemplate = document.getElementById("questionTemplate")
const incorrectAnswerTemplate = document.getElementById("incorrectAnswerTemplate")

const questionsPanel = document.querySelector(".main-div")



addEventListener("load", () => {
    loadPage()
})

document.getElementById("addQuestionButton").addEventListener("click", addQuestion)

document.getElementById("saveTestButton").addEventListener("click", async () => {
    await fetch(`tests/${testConfigurationType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getTestData())
    }).then(response => {
        if (response.ok === true) {
            window.location.href = "/"
        }
    })
})




function addQuestion() {
    const clone = getQuestionPanelClone()

    questionsPanel.appendChild(clone)

    setQuestionsNumbers()
}


function getQuestionPanelClone() {
    const clone = questionTemplate.content.cloneNode(true)

    clone.getElementById("addIncorrectAnswerButton").addEventListener("click", (e) => {
        const incorrectAnswerClone = getIncorrectAnswerClone()

        e.target.parentNode.querySelector("#incorrectAnswersPanel").appendChild(incorrectAnswerClone)
    })

    clone.getElementById("removeQuestionButton").addEventListener("click", e => removeCurrentChild(".questionPanel", e))

    return clone
}

function setQuestionsNumbers() {
    const questionsPanels = document.querySelectorAll(".questionPanel")
    const questionsNumber = questionsPanels.length
    document.querySelector("#questionsNumber").innerText = questionsNumber

    questionsPanels.forEach(questionPanel => {
        const questionsPanels = Array.from(document.querySelectorAll(".questionPanel"))
        const questionNumber = questionsPanels.indexOf(questionPanel) + 1
        questionPanel.querySelector(".questionNumber").innerText = questionNumber

    })
}

function getIncorrectAnswerClone() {
    const incorrectAnswerClone = incorrectAnswerTemplate.content.cloneNode(true)
        
    incorrectAnswerClone.getElementById("removeIncorrectAnswer")
        .addEventListener("click", e => {
            removeCurrentChild(".incorrectAnswerPanel", e)
        })

    return incorrectAnswerClone
}

function removeCurrentChild(parentSelector, e) {
    const child = e.target.closest(parentSelector)
    child.parentNode.removeChild(child)

    setQuestionsNumbers()
}

function getTestData() {
    const name = document.getElementById("testName").value
    const description = document.getElementById("testDescription").value
    const maxMark = document.getElementById("testMaxMark").value
    const timeToPass = getTimerValue()
    const autoCheck = !(document.getElementById("manualCheckCheckbox").checked)
    const amountOfAttampts = document.getElementById("amountOfAttampts").value

    
    const testData = {
        name: name,
        description: description,
        maxMark: maxMark,
        autoCheck: autoCheck,
        timeToPass: timeToPass,
        amountOfAttampts: amountOfAttampts,
        id: currentTest?.test?.id
    }
    const questions = getQuestionsData()
    
    return {
        test: testData,
        questions: questions
    }
}

function getQuestionsData() {
    let questions = []

    document.querySelectorAll(".questionPanel").forEach(questionPanel => {
        const questionText = questionPanel.querySelector("#question").value 
        const questionId = questionPanel.querySelector("#question").dataset.questionId
        const answer = questionPanel.querySelector("#answer").value 

        if (questionText.trim().length === 0 ||
            answer.trim().length === 0) {
                return
            }

        let question = {
            questionText: questionText,
            Id: questionId,
            answer: answer
        }

        let incorrectAnswers = []

        const incorrectAnswersPanel = questionPanel.querySelector("#incorrectAnswersPanel")
        incorrectAnswersPanel.querySelectorAll(".incorrectAnswerPanel").forEach(incorrectAnswerPanel => {
            const incorrectAnswer = incorrectAnswerPanel.querySelector("#incorrectAnswer").value
            if (incorrectAnswer.trim().length !== 0) {
                incorrectAnswers.push(incorrectAnswer)
            }
        })
        
        if (incorrectAnswers.length === 0) {
            question.incorrectAnswers = null
        } else {
            question.incorrectAnswers = JSON.stringify(incorrectAnswers)
        }

        questions.push(question)
    })
    
    return questions
}

function getTimerValue() {
    const timerSetupPanel = document.getElementById("timerSetupPanel")
    if (timerSetupPanel.querySelector("#setTimerCheckbox").checked == true) {
        const minutes = timerSetupPanel.querySelector("#minutes").value
        const seconds = timerSetupPanel.querySelector("#seconds").value
        return Number(minutes) * 60 + Number(seconds)
    } else {
        return null
    }
}


function loadPage() {
    currentTest = JSON.parse(window.sessionStorage.getItem("test"))
    if (currentTest !== null) {
        testConfigurationType = "update"
        document.title = `Room - ${currentTest.test?.name ?? "Новый тест"}`

        fillTestInfo(currentTest.test)
    
        if (currentTest.questions !== null) {
            allQuestions = currentTest.questions
            displayQuestions(allQuestions)
        }

        setQuestionsNumbers()
    }
}

function displayQuestions(questions) {
    questions.forEach(question => {
        const questionClone = getQuestionPanelClone()
        fillQuestionPanel(questionClone, question)
        
        questionsPanel.appendChild(questionClone)
    })
}

function displayOpenQuestion(question) {
    const questionClone = questionTemplate.content.cloneNode(true)
    fillQuestionPanel(questionClone, question)

    const addQuestionClone = getQuestionPanelClone(questionClone)
    
    addQuestionClone.appendChild(questionClone)
    questionsPanel.appendChild(addQuestionClone)
}
function displayCloseQuestion(question) {
    const closeQuestionClone = getCloseQuestionClone()
    fillCloseQuestionPanel(closeQuestionClone, question)

    const addQuestionClone = getQuestionPanelClone(closeQuestionClone)
    
    addQuestionClone.appendChild(closeQuestionClone)
    questionsPanel.appendChild(addQuestionClone)
}

function fillTestInfo(test) {
    document.getElementById("testName").value = test.name
    document.getElementById("testDescription").value = test.description
    document.getElementById("testMaxMark").value = test.maxMark
    document.getElementById("amountOfAttampts").value = test.amountOfAttampts

    if (test.timeToPass !== null) {
        const timerSetupPanel = document.getElementById("timerSetupPanel")

        const minutes = Math.trunc(test.timeToPass / 60)
        const seconds = test.timeToPass % 60

        timerSetupPanel.querySelector("#setTimerCheckbox").checked = true
        timerSetupPanel.querySelector("#minutes").value = minutes
        timerSetupPanel.querySelector("#seconds").value = seconds
    }

    if (!test.autoCheck) {
        document.querySelector("#manualCheckCheckbox").checked = true
    }
}

function fillQuestionPanel(panel, question) {
    panel.querySelector(".questionNumber").innerText = allQuestions.indexOf(question) + 1
    panel.getElementById("question").value = question.questionText
    panel.getElementById("question").dataset.questionId = question.id
    panel.getElementById("answer").value = question.answer

    const incorrectAnswersPanel = panel.getElementById("incorrectAnswersPanel")

    const incorrectAnswers = JSON.parse(question.incorrectAnswers)

    incorrectAnswers?.forEach(incorrectAnswer => {
        const clone = getIncorrectAnswerClone()
        clone.querySelector("#incorrectAnswer").value = incorrectAnswer
        incorrectAnswersPanel.appendChild(clone)
    })
}