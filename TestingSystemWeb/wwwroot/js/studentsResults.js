const currentTest = JSON.parse(window.sessionStorage.getItem("test"))

addEventListener("load", async () => {
    document.querySelector("#testNameText").innerText = currentTest.name
    
    await getStudentsResults(currentTest)
})


async function getStudentsResults(test) {
    await fetch(`tests/${test.id}/results`).then(async response => {
        const studentsResult = await response.json()
        studentsResult.forEach(result => {
            displayStudentResult(result)
        })
    })
}

function displayStudentResult(result) {
    const clone = document.querySelector("#studentResultRowTemplate").content.cloneNode(true)

    clone.querySelector("#surname").innerText = result.student.surname
    clone.querySelector("#name").innerText = result.student.name
    clone.querySelector("#patronymic").innerText = result.student.patronymic
    clone.querySelector("#group").innerText = result.student.group

    clone.querySelector("#attempt").innerText = result.testResult.attempt
    clone.querySelector("#mark").innerText = result.testResult.mark ?? "Не проверено"

    clone.querySelector("#checkButton").addEventListener("click", () => {
        checkAnswers(result.student.id, result.testResult.attempt)
    })

    document.querySelector("#studentsResultsTable").querySelector("tbody")
        .appendChild(clone)
}

function checkAnswers(userId, attempt) {
    sessionStorage.setItem("attemptData", JSON.stringify({
        test: currentTest,
        userId: userId,
        attempt: attempt
    }))
    location.href = "checkAnswers"
}