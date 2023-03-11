document.querySelector("#logoutButton")?.addEventListener("click", async () => {
    await fetch("logout").then(() => {
        window.location.href = "/"
    })
})

document.querySelector("#homeButton")?.addEventListener("click", () => {
    window.location.href = "/"
})