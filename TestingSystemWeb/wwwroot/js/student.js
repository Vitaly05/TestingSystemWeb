


async function loadPage() {
    const testsInfos = await getTestsInfos()
    displayTests(testsInfos)
}

async function getTestsInfos() {
    return await fetch("tests/forMe").then(async response => {
        if (response.ok === true) {
            return await response.json()
        }
    })
}

function displayTests(testsInfos) {
    testsInfos.forEach(testInfo => {
        displayTest(testInfo)
    })
}
function displayTest(testInfo) {
    const testRowClone = getTestTemplateClone(testInfo)
    appendTest(testRowClone)
}

function getTestTemplateClone(testInfo) {
    const testRowTemplate = document.getElementById("testRowTemplate")
    const clone = testRowTemplate.content.cloneNode(true)

    clone.getElementById("testName").innerText = testInfo.test.name
    clone.getElementById("testDescription").innerText = testInfo.test.description
    clone.getElementById("testMaxMark").innerText = testInfo.test.maxMark

    clone.querySelector("#passedOnce").innerText = `${testInfo.passedOnce} из ${testInfo.test.amountOfAttampts}`
    clone.querySelector("#maxMark").innerText = testInfo.maxMark ?? 
        (testInfo.passedOnce > 0 ? "Ни одна попытка ещё не проверена" : "Вы ещё не проходили тест")

    clone.querySelector(".startTestButton").addEventListener("click", async () => {
        await startTest(testInfo.test)
    })

    clone.querySelector(".getResultsButton").addEventListener("click", async () => {
        await getTestResult(testInfo.test)
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
            window.sessionStorage.setItem("questionsModel", JSON.stringify(await response.json()))
            window.location.href = "passingTest"
        } else {
            alert("Вы больше не можете пройти этот тест")
        }
    })
}

async function getTestResult(test) {
    window.sessionStorage.setItem("test", JSON.stringify(test))
    window.location.href = "/testResults"
}