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

document.getElementById("filterUsersSelect").addEventListener("change", async (e) => {
    const role = e.target.value
    await fetch(`users/${role}`).then(async response => {
        if (response.ok === true) {
            const users = await response.json()
            displayUsers(users)
        }
    })
})

document.getElementById("searchButton").addEventListener("click", async e => {
    e.preventDefault()

    const filter = document.getElementById("searchUsersSelect").value
    const searchText = document.getElementById("searchInput").value

    await fetch("users/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            filter: filter,
            searchText: searchText
        })
    }).then(async response => {
        if (response.ok === true) {
            const users = await response.json()
            displayUsers(users)
        }
    })
})

document.getElementById("resetButton").addEventListener("click", (e) => {
    loadUsers()
})



async function loadUsers() {
    await fetch("users").then(async response => {
        if (response.ok === true) {
            const users = await response.json()
            displayUsers(users)
        }
    })
}

function displayUsers(users) {
    usersTable.innerHTML = ""
    
    users.forEach(user => {
        displayUser(user)
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