const navigate = () => {
    document.location.pathname = "/"
}

const settings_pop = document.querySelector(".settings_pop")
document.querySelector(".setting_gear button").addEventListener("click", () => {
  settings_pop.classList.toggle("add_p")
})

document.querySelector(".cl").addEventListener('click', () => {
  settings_pop.classList.remove("add_p")
})

function showAlert( text ) {

    Toastify({
        text: text,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: false,
        gravity: "top", 
        position: "center",
        stopOnFocus: true, 
        style: {
          background: "#333",
        },
        onClick: function(){}
      }).showToast()
    
}

const toast = document.getElementById("toast")

if(toast){
    showAlert(toast.textContent)
}