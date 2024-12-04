const navigate = () => {
    document.location.pathname = "/"
}

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