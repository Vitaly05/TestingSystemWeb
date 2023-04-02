addEventListener("load", async () => {
    document.querySelector(".progress-bar").style.display = "block"
    document.querySelector("#testsPanel").style.display = "none"
    
    const testsInfos = await getTestsInfos()
    displayTests(testsInfos)

    document.querySelector(".progress-bar").style.display = "none"
    document.querySelector("#testsPanel").style.display = "flex"
})


async function getTestsInfos() {
    return await fetch("tests/forMe").then(async response => {
        if (response.ok === true) {
            return await response.json()
        }
    })
}

function displayTests(testsInfos) {
    if (testsInfos.length === 0) {
        document.querySelector("#testsPanel").style.display = "none"
        document.querySelector("#noOneTest").style.display = "flex"
    }
    testsInfos.reverse()
    testsInfos.forEach(testInfo => {
        displayTest(testInfo)
    })
}
function displayTest(testInfo) {
    const testClone = getTestTemplateClone(testInfo)
    appendTest(testClone)
}

function getTestTemplateClone(testInfo) {
    const testTemplate = document.getElementById("testTemplate")
    const clone = testTemplate.content.cloneNode(true)

    clone.getElementById("testName").innerText = testInfo.test.name
    clone.getElementById("testDescription").innerText = testInfo.test.description
    clone.getElementById("testMaxMark").innerText = testInfo.test.maxMark

    clone.querySelector("#passedOnce").innerText = `${testInfo.passedOnce} из ${testInfo.test.amountOfAttampts}`
    clone.querySelector("#maxMark").innerText = testInfo.maxMark ?? "Нет"

    clone.querySelector(".startTestButton").addEventListener("click", async () => {
        await startTest(testInfo.test.id, testInfo.passedOnce <  testInfo.test.amountOfAttampts)
    })

    clone.querySelector(".getResultsButton").addEventListener("click", async () => {
        await getTestResult(testInfo.test)
    })

    return clone
}

function appendTest(testClone) {
    document.querySelector(".tests").appendChild(testClone)
}


async function startTest(testId, canStart) {
    if (canStart) {
        window.sessionStorage.setItem("testId", testId)
        window.location.href = "passingTest"
    } else {
        alert("Вы больше не можете пройти этот тест")
    }
}

async function getTestResult(test) {
    window.sessionStorage.setItem("test", JSON.stringify(test))
    window.location.href = "/testResults"
}