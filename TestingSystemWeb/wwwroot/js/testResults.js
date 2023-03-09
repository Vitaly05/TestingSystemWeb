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

    document.getElementById("resultsTable").querySelector("tbody")
        .appendChild(clone)
}