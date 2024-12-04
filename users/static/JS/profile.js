const edit_profile_button = document.querySelector(".edit_profile_button")

edit_profile_button.addEventListener("click", () => {
   document.location.pathname = location.pathname + "edit"
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
// const save_edit = document.getElementById("save_edit_b")

// save_edit.addEventListener("click", (e) => {
//     e.preventDefault()
//     const toast = document.querySelector(".toast").textContent

//     if(toast){
//         setTimeout(() => {
//             showAlert(toast)
//         }, 2000)
        
//     }
// })

const tabs = document.querySelectorAll(".tab_ul li")
const tabButton = document.querySelectorAll(".tab-icon")

tabButton.forEach((tab, index) => {

    tab.addEventListener("click", () => {
        const btn = tabs[index]
        if(btn){
            tabs.forEach((rm) => {
                rm.classList.remove("activeTab")
            })
            btn.classList.add("activeTab")
        }
        
    })


})