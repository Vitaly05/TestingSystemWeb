const loginInput = document.getElementById("login")
const passwordInput = document.getElementById("password")

document.getElementById("loginButton").addEventListener("click", async (e) => {
    e.preventDefault()
    
    await fetch("login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            login: loginInput.value,
            password: passwordInput.value
        })
    }).then(response => {
        if (response.ok === true) {
            window.location.href = getReturnUrl() ?? "/"
        }
    })
})


function getReturnUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('ReturnUrl');
}