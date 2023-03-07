


async function loadPage() {
    const tests = await getTests()
    displayTests(tests)
}

async function getTests() {
    return await fetch("tests/forMe").then(async response => {
        if (response.ok === true) {
            return await response.json()
        }
    })
}

function displayTests(tests) {
    tests.forEach(test => {
        displayTest(test)
    })
}
function displayTest(test) {
    const testRowClone = getTestTemplateClone(test)
    appendTest(testRowClone)
}

function getTestTemplateClone(test) {
    const testRowTemplate = document.getElementById("testRowTemplate")
    const clone = testRowTemplate.content.cloneNode(true)

    clone.getElementById("testName").innerText = test.name
    clone.getElementById("testDescription").innerText = test.description
    clone.getElementById("testMaxMark").innerText = test.maxMark

    clone.querySelector(".startTestButton").addEventListener("click", () => {
        startTest(test)
    })

    return clone
}

function appendTest(testRowClone) {
    document.getElementById("testsTable").querySelector("tbody")
        .appendChild(testRowClone)
}


async function startTest(test) {
    await fetch(`tests/${test.id}`).then(async response => {
        if (response.ok === true) {
            window.sessionStorage.setItem("test", JSON.stringify(await response.json()))
            window.location.href = "passingTest"
        }
    })
}