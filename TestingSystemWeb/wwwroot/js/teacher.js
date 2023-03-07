const testsTable = document.getElementById("testsTable")

const addTestForm = document.getElementById("addTestForm")


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
        displayTests(tests)
    })
}

function displayTests(tests) {
    testsTable.innerHTML = ""

    tests.forEach(test => {
        displayTest(test)
    })
}

function displayTest(test) {
    const testsTableRowTemplate = document.getElementById("testsTableRowTemplate")
    const clone = testsTableRowTemplate.content.cloneNode(true)

    clone.getElementById("name").innerText = test.name
    clone.getElementById("description").innerText = test.description
    clone.getElementById("maxMark").innerText = test.maxMark

    addButtonEvents(clone, test)

    testsTable.appendChild(clone)
}

function addButtonEvents(clone, test) {
    clone.getElementById("removeTestButton").addEventListener("click", async () => {
        await removeTest(test)
    })

    clone.getElementById("editTestButton").addEventListener("click", async () => {
        await editTest(test)
    })

    clone.getElementById("addStudentsButton").addEventListener("click", () => {
        addStudents(test)
    })
}

async function removeTest(test) {
    await fetch(`tests/remove/${test.id}`, {
        method: "DELETE"
    }).then(response => {
        if (response.ok === true) {
            getAllTests()
        }
    })
}

async function editTest(test) {
    await fetch(`tests/${test.id}`).then(async response => {
        if (response.ok === true) {
            window.sessionStorage.setItem("test", JSON.stringify(await response.json()))
            window.location.href = "testConfiguration"
        }
    })
}

async function addStudents(test) {
    window.sessionStorage.setItem("test", JSON.stringify(test))
    window.location.href = "addStudents"
}