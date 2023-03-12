const currentTest = JSON.parse(window.sessionStorage.getItem("test"))

const addedStudentsTBody = document.getElementById("addedStudents").querySelector("tbody")
const notAddedStudentsTBody = document.getElementById("notAddedStudents").querySelector("tbody")


document.getElementById("testName").innerText = currentTest.name

addEventListener("load", async () => {
    await getStudents()
    await getAllGroups()
})



let allStudents
const searchStudentsInput = document.querySelector("#searchInput")

let studentsFilter = (student) => true

function setResultsFilter(searchMethod) {
    searchText = searchStudentsInput.value.toLowerCase()

    switch (searchMethod) {
        case "bySurname":
            studentsFilter = (student) => {
                if (student.surname.toLowerCase().search(searchText) === -1) {
                    return false
                }
                return true
            }
            break
        case "byGroup":
        studentsFilter = (student) => {
            if (student.group.toLowerCase().search(searchText) === -1) {
                return false
            }
            return true
        }
        break
        default:
            studentsFilter = (student) => true
    }

    displayStudents(allStudents)
}

searchStudentsInput.addEventListener("input", () => {
    const searchMethod = document.querySelector("#searchUsersSelect").value

    setResultsFilter(searchMethod)
})

document.getElementById("resetButton").addEventListener("click", () => {
    searchStudentsInput.value = ""
    setResultsFilter()
})

document.querySelector("#searchUsersSelect").addEventListener("change", e => {
    setResultsFilter(e.target.value)
})


document.querySelector("#addGroup").addEventListener("click", async () => {
    const group = document.querySelector("#groupsSelect").value
    
    await fetch(`tests/${currentTest.id}/addGroup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({group})
    }).then(response => {
        console.log(response.status)
        if (response.ok === true) {
            getStudents()
        }
    })
})


async function getAllGroups() {
    await fetch("users/allGroups").then(async response => {
        if (response.ok === true) {
            const groups = await response.json()
            displayGroups(groups)
        }
    })
}

async function getStudents() {
    await fetch(`tests/${currentTest.id}/getStudents`).then(async response => {
        if (response.ok === true) {
            allStudents = await response.json()
            displayStudents(allStudents)
        }
    })
}


function displayGroups(groups) {
    groups.forEach(group => {
        const clone = document.querySelector("#groupOptionTemplate").content
            .cloneNode(true)

        clone.querySelector("#group").innerText = group

        document.querySelector("#groupsSelect").appendChild(clone)
    })
}

function displayStudents(allStudents) {
    addedStudentsTBody.innerHTML = ""
    notAddedStudentsTBody.innerHTML = ""

    allStudents.notAddedStudents.forEach(student => {
        if (studentsFilter(student)) {
            displayNotAddedStudent(student)
        }
    })
    allStudents.addedStudents.forEach(student => {
        if (studentsFilter(student)) {
            displayAddedStudent(student)
        }
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