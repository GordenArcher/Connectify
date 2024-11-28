const edit_profile_button = document.querySelector(".edit_profile_button")

edit_profile_button.addEventListener("click", () => {
   document.location.pathname = location.pathname + "edit"
})

document.addEventListener("submit", (e) => {
    e.preventDefault()
})