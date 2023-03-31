const currentTest = JSON.parse(window.sessionStorage.getItem("test"))
let results


addEventListener("load", async () => {
    results = await getTestResult(currentTest)
    
    results?.forEach(result => {
        displayResult(result)
    })
})



async function getTestResult(test) {
    return await fetch(`tests/${test.id}/results`).then(async response => {
        if (response.ok === true) {
            return await response.json()
        }
    })
}

function displayResult(result) {
    const clone = document.getElementById("resultTemplate")
        .content.cloneNode(true)
    
    clone.getElementById("attempt").innerText = `Попытка: ${result.attempt}`
    clone.getElementById("mark").innerText = `Оценка: ${result.mark ?? "Не проверено"}`

    const checkAttemptButton = clone.getElementById("checkAttemptButton")
    if (result.mark === null) {
        checkAttemptButton.setAttribute("disabled", true)
    }

    checkAttemptButton.addEventListener("click", async () => {
        await checkAttempt(result.testId, result.attempt, result?.mark)
    })

    document.getElementById("results-panel").appendChild(clone)
}

async function checkAttempt(testId, attempt, mark) {
    await fetch(`tests/${testId}/${attempt}`).then(async response => {
        if (response.ok === true) {
            const answersModel = JSON.stringify(await response.json())
            window.sessionStorage.setItem("answersModel", answersModel)
            window.sessionStorage.setItem("mark", mark)
            window.location.href = "/viewingAttempt"
        }
    })
}