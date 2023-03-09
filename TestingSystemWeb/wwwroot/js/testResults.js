const results = JSON.parse(window.sessionStorage.getItem("testResults"))

document.getElementById("testNameText").innerText = window.sessionStorage.getItem("testName")

results?.forEach(result => {
    displayResult(result)
})


function displayResult(result) {
    const clone = document.getElementById("resultRowTemplate")
        .content.cloneNode(true)
    
    clone.getElementById("attempt").innerText = result.attempt
    clone.getElementById("mark").innerText = result.mark

    clone.getElementById("checkAttemptButton").addEventListener("click", async () => {
        await checkAttempt(result.testId, result.attempt)
    })

    document.getElementById("resultsTable").querySelector("tbody")
        .appendChild(clone)
}

async function checkAttempt(testId, attempt) {
    await fetch(`tests/${testId}/${attempt}`).then(async response => {
        if (response.ok === true) {
            const answersModel = JSON.stringify(await response.json())
            window.sessionStorage.setItem("answersModel", answersModel)
            window.location.href = "/viewingAttempt"
        }
    })
}