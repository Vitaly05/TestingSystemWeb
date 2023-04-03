const currentTest = JSON.parse(window.sessionStorage.getItem("test"))
let results


addEventListener("load", async () => {
    document.querySelector(".progress-bar").style.display = "block"
    document.querySelector("#results-panel").style.display = "none"
    
    results = await getTestResult(currentTest)
    
    if (results.length === 0) {
        document.querySelector("#noOneResult").style.display = "block"
    } else {
        results?.forEach(result => {
            displayResult(result)
        })
    }

    document.querySelector(".progress-bar").style.display = "none"
    document.querySelector("#results-panel").style.display = "grid"
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
        checkAttemptButton.disabled = true
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