
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

document.querySelectorAll('#like-btn i').forEach((like) => {
    like.addEventListener('click', (event) => {
        event.preventDefault(); 

        const form = like.closest("form");
        const url = form.getAttribute("data-url")
        const csrfToken = form.querySelector("input[name=csrfmiddlewaretoken]").value; 

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                console.log(data)

                if (data.liked) {
                    like.classList.add("bi-heart-fill"); 
                    like.classList.remove("bi-heart");
                } else {
                    like.classList.add("bi-heart");
                    like.classList.remove("bi-heart-fill");
                }

                const likesCount = form.querySelector("#likes-count");
                if (likesCount) {
                    likesCount.textContent = `${data.likes_count} ${data.likes_count === 1 ? "like" : "likes"}`;
                }

                showAlert(data.message)


            } else {
                showAlert(data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    });
});

document.querySelectorAll("#follow").forEach((follow) => {
    follow.addEventListener("click", (e) => {
        e.preventDefault()

        const url = document.getElementById("follow").getAttribute("data-url")
    
        const form = document.querySelector(".follow_form")
    
        const csrfToken = form.querySelector("input[name=csrfmiddlewaretoken]").value; 
    
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type":"application/json",
                "X-CSRFToken": csrfToken
            }
        })
        .then(response => response.json())

        .then((data) => {
            console.log(data)
            if(data.status == "success"){
                showAlert(data.message)
            }
        })
    })
})
