addEventListener("load", async () => {
    document.querySelector("#username").innerText = window.localStorage.getItem("username")
    setInputsEvents()
})

document.querySelector("#logoutButton")?.addEventListener("click", async () => {
    await fetch("logout").then(() => {
        window.location.href = "/"
    })
})

document.querySelector("#homeButton")?.addEventListener("click", () => {
    window.location.href = "/"
})


function setInputsEvents() {
    document.querySelectorAll(".js-input")?.forEach(jsInput => {
        const input = jsInput.querySelector("input")
        const clearButton = jsInput.querySelector("input[type='image']")
    
        checkInputState(input, clearButton)
        
        clearButton.addEventListener("click", () => {
            input.value = ""
            clearButton.style.display = "none"
        })
    
        input.addEventListener("input", () => {
            input.parentNode.classList.remove("invalid-field")
            checkInputState(input, clearButton)
        })
    })
}

function checkInputState(input, clearButton) {
    if (input.value === "") {
        clearButton.style.display = "none"
    } else {
        clearButton.style.display = "inline-block"
    }
}