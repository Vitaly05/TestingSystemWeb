const currentTest = JSON.parse(window.sessionStorage.getItem("test"))

const addedStudentsPanel = document.getElementById("addedStudentsPanel")
const notAddedStudentsPanel = document.getElementById("notAddedStudentsPanel")



addEventListener("load", async () => {
    await getStudents()
    await getAllGroups()

    addedStudentsPanel.style.display = "none"
})



let allStudents
let sortMethod
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

    displayStudents()
}

searchStudentsInput.addEventListener("input", () => {
    const searchMethod = document.querySelector("#searchUsersSelect").value
    setResultsFilter(searchMethod)
})
const clearButton = document.querySelector("#clearButton").addEventListener("click", () => {
    setResultsFilter()
})

document.querySelector("#searchUsersSelect").addEventListener("change", e => {
    setResultsFilter(e.target.value)
})


document.querySelectorAll(".radio-select").forEach(select => {
    select.addEventListener("change", e => {
        if (e.target.id === "notAddedStudents") {
            addedStudentsPanel.style.display = "none"
            notAddedStudentsPanel.style.display = "flex"
        } else if (e.target.id === "addedStudents") {
            addedStudentsPanel.style.display = "flex"
            notAddedStudentsPanel.style.display = "none"
        }
    })
})


const sortInAscendingButton = document.querySelector("#sortInAscending")
const sortInDescendingButton = document.querySelector("#sortInDescending")

sortInAscendingButton.addEventListener("click", () => {
    sortInAscendingButton.src = "img/sort_1-2.svg"
    sortInDescendingButton.src = "img/sort_2.svg"

    sortMethod = "sortInAscending"
    displayStudents()
})
sortInDescendingButton.addEventListener("click", () => {
    sortInDescendingButton.src = "img/sort_2-2.svg"
    sortInAscendingButton.src = "img/sort_1.svg"

    sortMethod = "sortInDescending"
    displayStudents()
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

document.querySelector("#removeGroup").addEventListener("click", async () => {
    const group = document.querySelector("#groupsSelect").value
    
    await fetch(`tests/${currentTest.id}/removeGroup`, {
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
            
            allStudents.addedStudents.reverse()
            allStudents.notAddedStudents.reverse()

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

function displayStudents() {
    addedStudentsPanel.innerHTML = ""
    notAddedStudentsPanel.innerHTML = ""

    if (sortMethod === "sortInAscending") {
        allStudents.notAddedStudents.sort(sortInAscending)
        allStudents.addedStudents.sort(sortInAscending)
    } else if (sortMethod === "sortInDescending") {
        allStudents.notAddedStudents.sort(sortInDescending)
        allStudents.addedStudents.sort(sortInDescending)
    }

    displayNotAddedStudents(allStudents)
    displayAddedStudents(allStudents)
}

function sortInAscending(a, b) {
    const surnameA = a.surname.toLowerCase()
    const surnameB = b.surname.toLowerCase()

    if (surnameA < surnameB) {
        return -1
    }
    if (surnameA > surnameB) {
        return 1
    }
    return 0
}
function sortInDescending(a, b) {
    const surnameA = a.surname.toLowerCase()
    const surnameB = b.surname.toLowerCase()

    if (surnameA < surnameB) {
        return 1
    }
    if (surnameA > surnameB) {
        return -1
    }
    return 0
}

function displayNotAddedStudents(allStudents) {
    allStudents.notAddedStudents.forEach(student => {
        if (studentsFilter(student)) {
            displayNotAddedStudent(student)
        }
    })
}
function displayAddedStudents(allStudents) {

    allStudents.addedStudents.forEach(student => {
        if (studentsFilter(student)) {
            displayAddedStudent(student)
        }
    })
}

function displayNotAddedStudent(student) {
    const clone = document.getElementById("notAddedStudentTemplate")
        .content.cloneNode(true)

    setStudentInfo(clone, student)

    clone.querySelector("#addButton").addEventListener("click", async () => {
        await addStudent(student)
    })

    notAddedStudentsPanel.appendChild(clone)
}
function displayAddedStudent(student) {
    const clone = document.getElementById("addedStudentTemplate")
        .content.cloneNode(true)

    setStudentInfo(clone, student)

    clone.querySelector("#removeButton").addEventListener("click", async () => {
        await removeStudent(student)
    })

    addedStudentsPanel.appendChild(clone)
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