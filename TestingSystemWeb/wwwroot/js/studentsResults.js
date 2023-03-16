const currentTest = JSON.parse(window.sessionStorage.getItem("test"))

addEventListener("load", async () => {
    document.querySelector("#testNameText").innerText = currentTest.name
    
    await getStudentsResults(currentTest)
})




let allResults
const searchResultsInput = document.querySelector("#searchInput")

let resultsFilter = (result) => true

function setResultsFilter(searchMethod) {
    searchText = searchResultsInput.value.toLowerCase()

    switch (searchMethod) {
        case "bySurname":
            resultsFilter = (result) => {
                if (result.student.surname.toLowerCase().search(searchText) === -1) {
                    return false
                }
                return true
            }
            break
        case "byGroup":
            resultsFilter = (result) => {
                if (result.student.group.toLowerCase().search(searchText) === -1) {
                    return false
                }
                return true
            }
            break
        case "onlyUnchecked":
            resultsFilter = (result) => {
                if (result.testResult.mark === null) {
                    return true
                }
                return false
            }
            break
        default:
            resultsFilter = (result) => true
    }

    displayStudentsResults(allResults)
}

searchResultsInput.addEventListener("input", () => {
    const searchMethod = document.querySelector("#searchUsersSelect").value

    setResultsFilter(searchMethod)
})

document.getElementById("resetButton").addEventListener("click", () => {
    searchResultsInput.value = ""
    setResultsFilter()
})

document.querySelector("#searchUsersSelect").addEventListener("change", e => {
    setResultsFilter(e.target.value)
})


document.querySelector("#onlyUnchecked").addEventListener("change", e => {
    if (e.target.checked) {
        setResultsFilter("onlyUnchecked")
    } else {
        setResultsFilter()
    }
})




async function getStudentsResults(test) {
    await fetch(`tests/${test.id}/results`).then(async response => {
        allResults = await response.json()
        allResults.reverse()
        displayStudentsResults(allResults)
    })
}

function displayStudentsResults(results) {
    document.querySelector("#studentsResultsTable").querySelector("tbody")
        .innerHTML = ""

    results.forEach(result => {
        if (resultsFilter(result)) {
            displayStudentResult(result)
        }
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