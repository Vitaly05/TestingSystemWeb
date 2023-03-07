let testConfigurationType = "add"
let currentTest

const addQuestionTemplate = document.getElementById("addQuestionTemplate")
const openQuestionTemplate = document.getElementById("openQuestionTemplate")
const closeQuestionTemplate = document.getElementById("closeQuestionTemplate")
const incorrectAnswerTemplate = document.getElementById("incorrectAnswerTemplate")

const questionsPanel = document.getElementById("questionsPanel")


document.getElementById("cancelButton").addEventListener("click", () => {
    window.location.href = "/"
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
    const clone = getQuestionPanelClone(getOpenQuestionClone())

    questionsPanel.appendChild(clone)
}


function getQuestionPanelClone(qustionTypeClone) {
    const clone = addQuestionTemplate.content.cloneNode(true)
    
    const questionSettings = clone.getElementById("questionSettings")

    questionSettings.appendChild(qustionTypeClone)

    clone.getElementById("selectQuestionType").addEventListener("change", (e) => {
        const oldChild = questionSettings.querySelector("div")

        switch (e.target.value) {
            case "openQuestion":
                questionSettings.replaceChild(getOpenQuestionClone(), oldChild)
                break;
            case "closeQuestion":
                questionSettings.replaceChild(getCloseQuestionClone(), oldChild)
                break;
        }
    })

    clone.getElementById("removeQuestionButton").addEventListener("click", e => removeCurrentChild(".questionPanel", e))

    return clone
}

function getOpenQuestionClone() {
    return openQuestionTemplate.content.cloneNode(true)
}
function getCloseQuestionClone() {
    const clone = closeQuestionTemplate.content.cloneNode(true)

    clone.getElementById("addIncorrectAnswerButton").addEventListener("click", (e) => {
        const incorrectAnswerClone = getIncorrectAnswerClone()

        e.target.closest(".closeQuestionPanel").querySelector("#incorrectAnswersPanel")
            .appendChild(incorrectAnswerClone)
    })

    return clone
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
}

function getTestData() {
    const name = document.getElementById("testName").value
    const description = document.getElementById("testDescription").value
    const maxMark = document.getElementById("testMaxMark").value
    const timeToPass = getTimerValue()
    const autoCheck = !(document.getElementById("manualCheckCheckbox").checked)

    
    const testData = {
        name: name,
        description: description,
        maxMark: maxMark,
        autoCheck: autoCheck,
        timeToPass: timeToPass,
        id: currentTest?.test?.id
    }
    const questions = getQuestionsData()

    console.log({
        test: testData,
        questions: questions
    })
    
    return {
        test: testData,
        questions: questions
    }
}

function getQuestionsData() {
    let questions = []

    document.querySelectorAll(".questionPanel").forEach(questionPanel => {
        const questionType = questionPanel.querySelector("#selectQuestionType").value
        const questionSettings = questionPanel.querySelector("#questionSettings")
        const questionText = questionSettings.querySelector("#question").value 
        const answer = questionSettings.querySelector("#answer").value 

        let question = {
            questionText: questionText,
            answer: answer
        }

        if (questionType == "closeQuestion") {
            let incorrectAnswers = []

            const incorrectAnswersPanel = questionPanel.querySelector("#incorrectAnswersPanel")
            incorrectAnswersPanel.querySelectorAll(".incorrectAnswerPanel").forEach(incorrectAnswerPanel => {
                const incorrectAnswer = incorrectAnswerPanel.querySelector(".incorrectAnswer").value
                incorrectAnswers.push(incorrectAnswer)
            })

            question.incorrectAnswers = JSON.stringify(incorrectAnswers)
        } else {
            question.incorrectAnswers = null
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
            displayQuestions(currentTest.questions)
        }
    }
}

function displayQuestions(questions) {
    questions.forEach(question => {
        if (question.incorrectAnswers === null) {
            displayOpenQuestion(question)
        } else {
            displayCloseQuestion(question)
        }
    })
}

function displayOpenQuestion(question) {
    const openQuestionClone = getOpenQuestionClone()
    fillOpenQuestionPanel(openQuestionClone, question)

    const addQuestionClone = getQuestionPanelClone(openQuestionClone)
    addQuestionClone.getElementById("selectQuestionType").value = "openQuestion"
    
    addQuestionClone.appendChild(openQuestionClone)
    questionsPanel.appendChild(addQuestionClone)
}
function displayCloseQuestion(question) {
    const closeQuestionClone = getCloseQuestionClone()
    fillCloseQuestionPanel(closeQuestionClone, question)

    const addQuestionClone = getQuestionPanelClone(closeQuestionClone)
    addQuestionClone.getElementById("selectQuestionType").value = "closeQuestion"
    
    addQuestionClone.appendChild(closeQuestionClone)
    questionsPanel.appendChild(addQuestionClone)
}

function fillTestInfo(test) {
    document.getElementById("testName").value = test.name
    document.getElementById("testDescription").value = test.description
    document.getElementById("testMaxMark").value = test.maxMark

    if (test.timeToPass !== null) {
        const timerSetupPanel = document.getElementById("timerSetupPanel")

        const minutes = Math.trunc(test.timeToPass / 60)
        const seconds = test.timeToPass % 60

        timerSetupPanel.querySelector("#setTimerCheckbox").checked = true
        timerSetupPanel.querySelector("#minutes").value = minutes
        timerSetupPanel.querySelector("#seconds").value = seconds
    }
}

function fillOpenQuestionPanel(panel, question) {
    panel.getElementById("question").value = question.questionText
    panel.getElementById("answer").value = question.answer
}
function fillCloseQuestionPanel(panel, question) {
    fillOpenQuestionPanel(panel, question)

    const incorrectAnswersPanel = panel.getElementById("incorrectAnswersPanel")

    const incorrectAnswers = JSON.parse(question.incorrectAnswers)

    incorrectAnswers.forEach(incorrectAnswer => {
        const clone = getIncorrectAnswerClone()
        clone.querySelector(".incorrectAnswer").value = incorrectAnswer
        incorrectAnswersPanel.appendChild(clone)
    })
}