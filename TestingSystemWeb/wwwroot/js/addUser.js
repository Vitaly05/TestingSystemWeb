document.querySelector("#addUserButton").addEventListener("click", async e => {
    e.preventDefault()


    const formData = new FormData(addUserForm)
    const userData = Object.fromEntries(formData.entries());

    let role
    document.querySelectorAll("input[name='role']").forEach(radioButton => {
        if (radioButton.checked) {
            role = radioButton.value;
        }
    })
    userData.role = role

    await fetch("users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    }).then(response => {
        if (response.ok === true) {
            window.location.href = "/"
        }
    })
})

document.querySelectorAll(".js-input").forEach(jsInput => {
    jsInput.addEventListener("click", e => {
        e.preventDefault()
    })
})