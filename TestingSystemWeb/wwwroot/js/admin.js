const usersPanel = document.getElementById("usersPanel")

// const addUserForm = document.getElementById("addUserForm")


addEventListener("load", async () => {
    document.querySelector(".progress-bar").style.display = "block"
    document.querySelector("#usersPanel").style.display = "none"
    document.querySelector("#addUserButton").disabled = true

    await loadUsers()

    document.querySelector(".progress-bar").style.display = "none"
    document.querySelector("#usersPanel").style.display = "flex"
    document.querySelector("#addUserButton").disabled = false
})


document.getElementById("addUserButton").addEventListener("click", async e => {
    window.location.href = "/addUser"
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


document.querySelector("#searchUsersSelect").addEventListener("change", e => {
    setUsersFilter(e.target.value)
})

document.getElementById("filterUsersSelect").addEventListener("change", async (e) => {
    const role = e.target.value
    setRolesFilter(role)
})

document.getElementById("clearButton").addEventListener("click", () => {
    setUsersFilter()
})



async function loadUsers() {
    await fetch("users").then(async response => {
        if (response.ok === true) {
            allUsers = await response.json()
            allUsers.reverse()
            displayUsers(allUsers)
        }
    })
}

function displayUsers(users) {
    usersPanel.innerHTML = ""
    
    let thereIsAtLeastOneUser = false

    users.forEach(user => {
        if (usersFilter(user) && rolesFilter(user)) {
            displayUser(user)
            thereIsAtLeastOneUser = true
        }
    })

    if (thereIsAtLeastOneUser) {
        usersPanel.style.display = "flex"
        document.querySelector("#noOneUser").style.display = "none"
    } else {
        usersPanel.style.display = "none"
        document.querySelector("#noOneUser").style.display = "block"
    }
}

function displayUser(user) {
    const userTemplate = document.getElementById("userTemplate")
    const clone = userTemplate.content.cloneNode(true)

    clone.getElementById("login").innerText = user.login
    clone.getElementById("surname").innerText = user.surname
    clone.getElementById("name").innerText = user.name
    clone.getElementById("patronymic").innerText = user.patronymic

    let group
    if (user.group === null || user.group.length === 0) {
        group = "-"
    } else {
        group = user.group
    }
    clone.getElementById("group").innerText = group
    
    clone.getElementById("role").innerText = user.role

    clone.getElementById("removeUserButton").addEventListener("click", async () => {
        await removeUser(user)
    })
    usersPanel.appendChild(clone)
}

async function removeUser(user) {
    if (confirm(`Вы точно хотите удалить пользователя "${user.surname} ${user.name} ${user.patronymic}?"`)) {
        await fetch(`users/remove/${user.id}`, {
            method: "DELETE"
        }).then(async response => {
            if (response.ok === true) {
                await loadUsers();
            }
        })
    }
}