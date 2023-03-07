document.getElementById("logoutButton").addEventListener("click", async () => {
    await fetch("logout").then(() => {
        window.location.href = "/"
    })
})