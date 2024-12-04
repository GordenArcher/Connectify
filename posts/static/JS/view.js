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


const back_button = document.querySelector(".back_button")
const likebtn = document.getElementById("likebtn")
const send_comment = document.getElementById("comment_on_post")

back_button.addEventListener("click", () => {
    history.go(-1)
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

            showAlert(data.message)


        } else {
            showAlert(data.message);
        }
    })
    .catch(error => console.error("Error:", error));
});


send_comment.addEventListener('click', (event) => {
    event.preventDefault(); 

    const form = document.querySelector(".comment_form");
    const url = form.getAttribute("data-url");
    const csrfToken = form.querySelector("input[name=csrfmiddlewaretoken]").value; 
    const commentContent = form.querySelector("textarea[name='comment']").value;

    if (!commentContent.trim()) {
        showAlert("Comment cannot be empty.");
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
            const commentCount = document.getElementById("comment-count");
            if (commentCount) {
                commentCount.textContent = `${data.comment_count} ${data.comment_count === 1 ? ". comment" : ". comments"}`;
            }

            form.querySelector("textarea[name='comment']").value = "";
            

            const commentList = document.querySelector(".comment_flex");
            if (commentList) {
                const newComment = document.createElement("div");
                newComment.classList.add("all_coments", "fade-in")

                newComment.innerHTML = `
                    <div class="comments_all">
                        <div class="comment_user_profile">
                            <div class="comment_profile">
                                <img src="${data.user_profile}" alt="Your profile picture" />
                            </div>
                        </div>
                        <div class="user_comment">
                            <div class="u_c_usn">
                                <div class="u_c_n">
                                    <div class="user-name">
                                        <span>You</span>
                                    </div>
                                </div>
                                <div class="actua_comme">
                                    <div class="comment_text">
                                        <span>${commentContent}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                commentList.appendChild(newComment);
                newComment.scrollIntoView({ behavior: "smooth", block: "nearest" });

                showAlert("Comment added successfully!");
            }
        } else {
            showAlert(data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        showAlert("An error occurred. Please try again.");
    });
});
