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


document.getElementById("sub_req").addEventListener("click", (e) => {
    e.preventDefault()

    const form = document.querySelector(".form_class");
    const url = form.getAttribute("data-url")
    const csrfToken = form.querySelector("input[name=csrfmiddlewaretoken]").value; 

    const email = document.getElementById("email")

    const emailSub = email.value
    console.log(emailSub)

    if(!emailSub.trim()){
        return showAlert("Email field required")
    }

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken
        },
        body: JSON.stringify({
            "email":emailSub
        })
    })

    .then((response => response.json()))


    .then(data => {
        if(data.status == 'sucess'){
            showAlert(data.message)
        }

        setInterval(() => {
            location.href= '/email_sent/'
        }, 3000)
    })


    .catch(Err => {
        console.log(Err)
    })
})

const em = document.querySelector(".em button")

em.addEventListener("click", () => {
    location.href = "/"
})