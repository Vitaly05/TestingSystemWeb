const testsPanel = document.querySelector("#testsPanel")


addEventListener("load", async () => {
    await getAllTests()
})

document.getElementById("addTestButton").addEventListener("click", () => {
    if (window.sessionStorage.getItem("test") !== null)
        window.sessionStorage.removeItem("test")
    window.location.href = "testConfiguration"
})



async function getAllTests() {
    await fetch("tests", {
        method: "GET"
    }).then(async response => {
        const tests = await response.json()
        tests.reverse()
        displayTests(tests)
    })
}

function displayTests(tests) {
    testsPanel.innerHTML = ""

    if (tests.length === 0 || tests === null) {
        const clone = document.querySelector("#noOneTestTemplate").content.cloneNode(true)
        testsPanel.appendChild(clone)
    }

    tests.forEach(test => {
        displayTest(test)
    })
}

function displayTest(test) {
    const testTemplate = document.getElementById("testTemplate")
    const clone = testTemplate.content.cloneNode(true)

    clone.querySelector(".test-name").innerText = test.name
    clone.querySelector(".test-max-mark").innerText = `Максимальная оценка: ${test.maxMark}`
    clone.querySelector(".test-description").innerText = test.description

    addButtonEvents(clone, test)

    testsPanel.appendChild(clone)
}

function addButtonEvents(clone, test) {
    clone.querySelector("#removeTestButton").addEventListener("click", async () => {
        await removeTest(test)
    })

    clone.querySelector("#editTestButton").addEventListener("click", async () => {
        await editTest(test)
    })

    clone.querySelector("#addStudentsButton").addEventListener("click", () => {
        addStudents(test)
    })

    clone.querySelector("#resultsButton").addEventListener("click", () => {
        getResults(test)
    })
}

async function removeTest(test) {
    if (confirm(`Вы уверены, что хотите удалить тест "${test.name}?"`)) {
        await fetch(`tests/remove/${test.id}`, {
            method: "DELETE"
        }).then(response => {
            if (response.ok === true) {
                getAllTests()
            }
        })
    }
}

async function editTest(test) {
    await fetch(`tests/${test.id}`).then(async response => {
        if (response.ok === true) {
            window.sessionStorage.setItem("test", JSON.stringify(await response.json()))
            window.location.href = "testConfiguration"
        }
    })
}

function addStudents(test) {
    window.sessionStorage.setItem("test", JSON.stringify(test))
    window.location.href = "addStudents"
}

async function getResults(test) {
    window.sessionStorage.setItem("test", JSON.stringify(test))
    window.location.href = "studentsResults"
}