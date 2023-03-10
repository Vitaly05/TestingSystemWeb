addEventListener("load", async () => {
    const currentTest = JSON.parse(window.sessionStorage.getItem("test"))
    
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

    document.querySelector("#studentsResultsTable").querySelector("tbody")
        .appendChild(clone)
}