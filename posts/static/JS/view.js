function showToast(message) {
    const toastContainer = document.getElementById("toast-container") || document.createElement("div");
    if (!toastContainer.id) {
        toastContainer.id = "toast-container";  
        document.body.appendChild(toastContainer); 
    }

    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = message;

    toastContainer.appendChild(toast);

    toast.style.transition = "opacity 0.5s ease";
    toast.style.opacity = 1;

    setTimeout(() => {
        toast.style.opacity = 0;  

        setTimeout(() => {
            toast.remove();
        }, 500); 
    }, 2000);  
}
const back_button = document.querySelector(".back_button")
const likebtn = document.getElementById("likebtn")
const send_comment = document.getElementById("comment_on_post")

back_button.addEventListener("click", () => {
    location.pathname = "/posts/feed/"
})

likebtn.addEventListener('click', (event) => {
    event.preventDefault(); 

    const form = document.querySelector(".form")
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

            const likeIcon = document.getElementById("likeIcon")
            if (data.liked) {
                likeIcon.classList.add("bi-heart-fill"); 
                likeIcon.classList.remove("bi-heart");
            } else {
                likeIcon.classList.add("bi-heart");
                likeIcon.classList.remove("bi-heart-fill");
            }

            const likesCount = document.querySelector(".likes_number");
            if (likesCount) {
                likesCount.textContent = `${data.likes_count} ${data.likes_count === 1 ? "like" : "likes"}`;
            }

            showToast(data.message)


        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error("Error:", error));
});


send_comment.addEventListener('click', (event) => {
    event.preventDefault(); 

    const form = document.querySelector(".comment_form")
    const url = form.getAttribute("data-url")
    const csrfToken = form.querySelector("input[name=csrfmiddlewaretoken]").value; 
    const commentContent = form.querySelector("textarea[name='comment']").value;

    if (!commentContent.trim()) {
        showToast("Comment cannot be empty.");
        return;
    }

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken
        }, 
        body: JSON.stringify({ "comment": commentContent })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.status === "success") {
            console.log(data)

            const commentCount = document.getElementById("comment-count");
            if (commentCount) {
                commentCount.textContent = `${data.comment_count} ${data.comment_count === 1 ? "comment" : "comments"}`;
            }

            form.querySelector("textarea[name='comment']").value = "";

            showToast("Your comment was added successfully.");


        } else {
            console.log(data.message + " error")
            showToast(data.message);
        }
    })
    .catch(error => console.error("Error:", error));
});