const currentTest = JSON.parse(window.sessionStorage.getItem("test"))

addEventListener("load", async () => {
    document.querySelector(".progress-bar").style.display = "block"
    document.querySelector("#studentsResultsPanel").style.display = "none"
    document.querySelector(".sort-div").style.display = "none"
    
    await getStudentsResults(currentTest)

    document.querySelector(".progress-bar").style.display = "none"
    document.querySelector(".sort-div").style.display = "flex"
})




let allResults
let sortMethod = "sortInAscending"
const searchResultsInput = document.querySelector("#searchInput")

let resultsFilter = (result) => true

function setStudentsFilter(searchMethod) {
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

    displayStudentsResults()
}

searchResultsInput.addEventListener("input", () => {
    const searchMethod = document.querySelector("#searchUsersSelect").value

    setStudentsFilter(searchMethod)
})

document.getElementById("clearButton").addEventListener("click", () => {
    setStudentsFilter()
})

document.querySelector("#searchUsersSelect").addEventListener("change", e => {
    setStudentsFilter(e.target.value)
})


document.querySelector("#onlyUnchecked").addEventListener("change", e => {
    if (e.target.checked) {
        setStudentsFilter("onlyUnchecked")
    } else {
        setStudentsFilter()
    }
})


const sortInAscendingButton = document.querySelector("#sortInAscending")
const sortInDescendingButton = document.querySelector("#sortInDescending")

sortInAscendingButton.addEventListener("click", () => {
    sortInAscendingButton.src = "img/sort_1-2.svg"
    sortInDescendingButton.src = "img/sort_2.svg"

    sortMethod = "sortInAscending"
    displayStudentsResults()
})
sortInDescendingButton.addEventListener("click", () => {
    sortInDescendingButton.src = "img/sort_2-2.svg"
    sortInAscendingButton.src = "img/sort_1.svg"

    sortMethod = "sortInDescending"
    displayStudentsResults()
})




async function getStudentsResults(test) {
    await fetch(`tests/${test.id}/results`).then(async response => {
        allResults = await response.json()

        if (allResults.length === 0) {
            document.querySelector("#noOneResult").style.display = "flex"
        } else {
            document.querySelector("#studentsResultsPanel").style.display = "flex"
            allResults.reverse()
            displayStudentsResults()
        }

    })
}

function displayStudentsResults() {
    document.querySelector("#studentsResultsPanel").innerHTML = ""

    if (sortMethod === "sortInAscending") {
        allResults.sort(sortInAscending)
    } else if (sortMethod === "sortInDescending") {
        allResults.sort(sortInDescending)
    }

    let hasAtLeastOneStudent = false
    
    allResults.forEach(result => {
        if (resultsFilter(result)) {
            hasAtLeastOneStudent = true
            displayStudentResult(result)
        }
    })
    
    if (allResults.length !== 0) {
        if (!hasAtLeastOneStudent) {
            document.querySelector("#studentsResultsPanel").style.display = "none"
            document.querySelector("#allResultsChecked").style.display = "block"
        } else {
            document.querySelector("#studentsResultsPanel").style.display = "flex"
            document.querySelector("#allResultsChecked").style.display = "none"
        }
    }
}

function sortInAscending(a, b) {
    const surnameA = a.student.surname.toLowerCase()
    const surnameB = b.student.surname.toLowerCase()

    if (surnameA < surnameB) {
        return -1
    }
    if (surnameA > surnameB) {
        return 1
    }
    return 0
}
function sortInDescending(a, b) {
    const surnameA = a.student.surname.toLowerCase()
    const surnameB = b.student.surname.toLowerCase()

    if (surnameA < surnameB) {
        return 1
    }
    if (surnameA > surnameB) {
        return -1
    }
    return 0
}

function displayStudentResult(result) {
    const clone = document.querySelector("#studentResultTemplate").content.cloneNode(true)

    clone.querySelector("#surname").innerText = result.student.surname
    clone.querySelector("#name").innerText = result.student.name
    clone.querySelector("#patronymic").innerText = result.student.patronymic

    clone.querySelector("#group").innerText = result.student.group
    clone.querySelector("#attempt").innerText = result.testResult.attempt
    clone.querySelector("#mark").innerText = result.testResult.mark ?? "Нет"

    clone.querySelector("#checkButton").addEventListener("click", () => {
        checkAnswers(result.student.id, result.testResult.attempt)
    })

    document.querySelector("#studentsResultsPanel").appendChild(clone)
}

function checkAnswers(userId, attempt) {
    sessionStorage.setItem("attemptData", JSON.stringify({
        test: currentTest,
        userId: userId,
        attempt: attempt
    }))
    location.href = "checkAnswers"
}