const password_view = document.getElementById("password")
const togglepassword = document.getElementById("switch")

togglepassword.addEventListener("click", () => {
    if(password_view.type == "password"){
        password_view.type = "text"
    }
    else{
        password_view.type = "password"
    }
})

// window.document.getElementById("click", () => {
//     alert()
// })