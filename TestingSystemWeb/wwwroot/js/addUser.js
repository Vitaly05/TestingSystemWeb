document.querySelector("#addUserButton").addEventListener("click", async e => {
    e.preventDefault()

    let role
    document.querySelectorAll("input[name='role']").forEach(radioButton => {
        if (radioButton.checked) {
            role = radioButton.value;
        }
    })

    if (fieldsAreValid(role)) {
        const formData = new FormData(addUserForm)
        const userData = Object.fromEntries(formData.entries());
    
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
    }
})

document.querySelectorAll(".js-input").forEach(jsInput => {
    jsInput.addEventListener("click", e => {
        e.preventDefault()
    })
})


function fieldsAreValid(role) {
    let allFieldsAreValid = true

    Array.from(document.querySelectorAll("input[name]")).reverse().forEach(questionField => {
        if (role !== "Student" && questionField.name === "group") {
            undefined
        } else {
            fieldIsValid(questionField) ? undefined : allFieldsAreValid = false
        }
    })

    return allFieldsAreValid
}

function fieldIsValid(field) {
    if (field.value === null || field.value.trim() === "") {
        field.parentNode.classList.add("invalid-field")
        field.scrollIntoView({
            behavior: "smooth",
            block: "center"
        })
        
        return false
    } else {
        field.parentNode.classList.remove("invalid-field")
        return true
    }
}