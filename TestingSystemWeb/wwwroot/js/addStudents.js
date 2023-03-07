const currentTest = JSON.parse(window.sessionStorage.getItem("test"))

const addedStudentsTBody = document.getElementById("addedStudents").querySelector("tbody")
const notAddedStudentsTBody = document.getElementById("notAddedStudents").querySelector("tbody")

document.getElementById("testName").innerText = currentTest.name

addEventListener("load", async () => {
    await getStudents()
})


document.getElementById("toHomeButton").addEventListener("click", () => {
    window.location.href = "/"
})


async function getStudents() {
    await fetch(`tests/${currentTest.id}/getStudents`).then(async response => {
        if (response.ok === true) {
            const allStudents = await response.json()
            displayStudents(allStudents)
        }
    })
}

function displayStudents(allStudents) {
    addedStudentsTBody.innerHTML = ""
    notAddedStudentsTBody.innerHTML = ""

    allStudents.notAddedStudents.forEach(student => {
        displayNotAddedStudent(student)
    })
    allStudents.addedStudents.forEach(student => {
        displayAddedStudent(student)
    })
}
function displayNotAddedStudent(student) {
    const clone = document.getElementById("notAddedStudentsTableRowTemplate")
        .content.cloneNode(true)

    setStudentInfo(clone, student)

    clone.querySelector("#addButton").addEventListener("click", async () => {
        await addStudent(student)
    })

    notAddedStudentsTBody.appendChild(clone)
}
function displayAddedStudent(student) {
    const clone = document.getElementById("addedStudentsTableRowTemplate")
        .content.cloneNode(true)

    setStudentInfo(clone, student)

    clone.querySelector("#removeButton").addEventListener("click", async () => {
        await removeStudent(student)
    })

    addedStudentsTBody.appendChild(clone)
}

function setStudentInfo(clone, student) {
    clone.querySelector("#surname").innerText = student.surname
    clone.querySelector("#name").innerText = student.name
    clone.querySelector("#patronymic").innerText = student.patronymic
    clone.querySelector("#group").innerText = student.group
}

async function addStudent(student) {
    await fetch("tests/addStudent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            testId: currentTest.id,
            userId: student.id
        })
    }).then(async response => {
        if (response.ok === true) {
            await getStudents()
        }
    })
}

async function removeStudent(student) {
    await fetch("tests/removeStudent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            testId: currentTest.id,
            userId: student.id
        })
    }).then(async response => {
        if (response.ok === true) {
            await getStudents()
        }
    })
}