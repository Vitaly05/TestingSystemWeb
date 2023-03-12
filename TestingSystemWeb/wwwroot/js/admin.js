const usersTable = document.getElementById("usersTable")

const addUserForm = document.getElementById("addUserForm")



document.getElementById("addUserButton").addEventListener("click", async e => {
    e.preventDefault()

    const formData = new FormData(addUserForm)
    const userData = Object.fromEntries(formData.entries());

    await fetch("users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    }).then(response => {
        if (response.ok === true) {
            addUserForm.reset()
            loadUsers()
        }
    })
})




let allUsers
const searchUserInput = document.querySelector("#searchInput")

let usersFilter = (user) => true
let rolesFilter = (user) => true

function setUsersFilter(searchMethod) {
    searchText = searchUserInput.value.toLowerCase()

    switch (searchMethod) {
        case "byLogin":
            usersFilter = (user) => {
                if (user.login.toLowerCase().search(searchText) === -1) {
                    return false
                }
                return true
            }
            break
        case "bySurname":
            usersFilter = (useer) => {
                if (useer.surname.toLowerCase().search(searchText) === -1) {
                    return false
                }
                return true
            }
            break
        case "byGroup":
        usersFilter = (user) => {
            if (user.group.toLowerCase().search(searchText) === -1) {
                return false
            }
            return true
        }
        break
        default:
            usersFilter = (user) => true
    }

    displayUsers(allUsers)
}
function setRolesFilter(role) {
    if (role === "all") {
        rolesFilter = (user) => true
    } else {
        rolesFilter = (user) => {
            if (user.role.toLowerCase() === role) {
                return true
            }
            return false
        }
    }

    displayUsers(allUsers)
}

searchUserInput.addEventListener("input", () => {
    const searchMethod = document.querySelector("#searchUsersSelect").value

    setUsersFilter(searchMethod)
})

document.getElementById("resetButton").addEventListener("click", () => {
    searchUserInput.value = ""
    setUsersFilter()
})

document.querySelector("#searchUsersSelect").addEventListener("change", e => {
    setUsersFilter(e.target.value)
})

document.getElementById("filterUsersSelect").addEventListener("change", async (e) => {
    const role = e.target.value
    setRolesFilter(role)
})



async function loadUsers() {
    await fetch("users").then(async response => {
        if (response.ok === true) {
            allUsers = await response.json()
            displayUsers(allUsers)
        }
    })
}

function displayUsers(users) {
    usersTable.innerHTML = ""
    
    users.forEach(user => {
        if (usersFilter(user) && rolesFilter(user)) {
            displayUser(user)
        }
    })
}

function displayUser(user) {
    const usersTableRowTemplate = document.getElementById("usersTableRowTemplate")
    const clone = usersTableRowTemplate.content.cloneNode(true)

    clone.getElementById("login").innerText = user.login
    clone.getElementById("surname").innerText = user.surname
    clone.getElementById("name").innerText = user.name
    clone.getElementById("patronymic").innerText = user.patronymic
    clone.getElementById("group").innerText = user.group
    clone.getElementById("role").innerText = user.role

    clone.getElementById("removeUserButton").addEventListener("click", async () => {
        await removeUser(user)
    })
    usersTable.appendChild(clone)
}

async function removeUser(user) {
    await fetch(`users/remove/${user.id}`, {
        method: "DELETE"
    }).then(async response => {
        if (response.ok === true) {
            await loadUsers();
        }
    })
}