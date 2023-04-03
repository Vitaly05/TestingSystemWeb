const loginInput = document.getElementById("login")
const passwordInput = document.getElementById("password")

const errorMessageElement = document.querySelector("#error-message")

document.getElementById("loginButton").addEventListener("click", async (e) => {
    e.preventDefault()
    
    
    if (fieldsAreValid()) {
        e.target.disabled = true
        document.querySelector("#js-login-text").style.display = "none"
        document.querySelector(".progress-bar").style.display = "block"

        await fetch("login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                login: loginInput.value,
                password: passwordInput.value
            })
        }).then(async response => {
            if (response.ok === true) {
                window.localStorage.setItem("username", await response.text())
                window.location.href = getReturnUrl() ?? "/"
            } else {
                document.querySelector("#js-login-text").style.display = "block"
                document.querySelector(".progress-bar").style.display = "none"
                e.target.disabled = false

                errorMessageElement.style.display = "block"
                loginInput.focus()
            }
        })
    }
})

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", e => {
        e.target.classList.remove("invalid-field")
        errorMessageElement.style.display = "none"
    })
})


function getReturnUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('ReturnUrl');
}


function fieldsAreValid() {
    let allFieldsAreValid = true

    fieldIsValid(document.querySelector("#login")) ? undefined : allFieldsAreValid = false
    fieldIsValid(document.querySelector("#password")) ? undefined : allFieldsAreValid = false

    return allFieldsAreValid
}

function fieldIsValid(field) {
    if (field.value === null || field.value.trim() === "") {
        field.classList.add("invalid-field")
        field.focus()
        return false
    } else {
        field.classList.remove("invalid-field")
        return true
    }
}