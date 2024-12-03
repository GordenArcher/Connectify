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

const cancel = document.querySelector(".cancel button")
const upload_popup = document.querySelector(".upload_image_popup")
const upload_video_popup = document.querySelector(".upload_video_popup")
const uplod_img = document.querySelector("#uplod_img")


cancel.addEventListener("click", () => {
    upload_popup.style.display = "none"
})

uplod_img.addEventListener("click", () => {
    upload_popup.style.display = "initial"
})

document.querySelector("#post_image").addEventListener("click", (e) => {
    e.preventDefault()

        const form = document.querySelector(".image_form");
        const url = form.getAttribute("data-url")
        const csrfToken = form.querySelector("input[name=csrfmiddlewaretoken]").value;
        
        const imageInput = document.getElementById('image_post');
        const caption = document.getElementById("caption").value;

        const formData = new FormData()
        formData.append("media", imageInput.files[0])
        formData.append("caption", caption)

        if (!imageInput.files.length) {
            showAlert("Please select a file to upload.");
            return;
        }


        fetch(url, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrfToken
            },
            body : formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                console.log(data)
                showAlert(data.message)

                upload_popup.style.display = "none"
            } else {
                console.log(data)
                showAlert(data.message);
            }
        })
        .catch(error => console.error("Error:", error));
})

const imageInput = document.getElementById('image_post');
const imagePreview = document.getElementById('image-preview');
const main_image_display = document.querySelector(".main_image_display")

imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  const imagePreview = document.getElementById("image-preview");
    const videoPreview = document.getElementById("video-preview");

    imagePreview.style.display = "none";
    imagePreview.src = "";
    videoPreview.style.display = "none";
    videoPreview.src = "";

    if (file) {
        const fileType = file.type;

        if (fileType.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (e) {
                main_image_display.style.display = "none"
                imagePreview.style.display = "block";
                imagePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else if (fileType.startsWith("video/")) {
            const videoURL = URL.createObjectURL(file); 
            main_image_display.style.display = "none"
            videoPreview.style.display = "block";
            videoPreview.src = videoURL;
        } else {
            alert("Unsupported file type. Please upload an image or video.");
        }
    }
});

const something = document.getElementById("something")

something.addEventListener("input", () => {
    if(something.value.length <= 0 || !something.value.trim()){
        document.querySelector(".post_text").style.display = 'none'
    }else{
        document.querySelector(".post_text").style.display = 'block'
    }
})


document.getElementById("create_text_post").addEventListener("click", (e) => {
    e.preventDefault()
    PostText()

})

const PostText = async () => {

    const post = something.value

    const form = document.querySelector(".what_on_mind")
    const url = form.getAttribute("data-url")
    const csrfToken = form.querySelector("input[name=csrfmiddlewaretoken]").value;

    if(!post.trim()){
        return showAlert("Enter something to post")
    }
    
    try {

        const response = await fetch(url, {
            method:"POST",
            headers: {
                'Content-Type':'application/json',
                "X-CSRFToken": csrfToken
            },
            body: JSON.stringify({
                "something":post
            })
        })

        if(response.ok){
            const data = await response.json()

            if (data.status === "sucess") {
            const all_p_flex = document.querySelector(".all_p_flex");

            const postAl = document.createElement("div");
            postAl.className = "post_al";

            const postWrap = document.createElement("div");
            postWrap.className = "post_wrap";
            postAl.appendChild(postWrap);
            const userDel = document.createElement("div");
            userDel.className = "user_del";

            const userWPDel = document.createElement("div");
            userWPDel.className = "user_w_p_del";

            const userWPProf = document.createElement("div");
            userWPProf.className = "user_w_p_prof";

            const profileImg = document.createElement("img");
            profileImg.src = data.payload.profile_picture || "/static/images/avatar-4.png";
            profileImg.alt = `${data.payload.username}'s profile`;
            userWPProf.appendChild(profileImg);

            const userName = document.createElement("div");
            userName.className = "user_w_p_d_name";

            const userNameText = document.createElement("p");
            userNameText.textContent = data.payload.username;
            userName.appendChild(userNameText);

            userWPDel.appendChild(userWPProf);
            userWPDel.appendChild(userName);
            userDel.appendChild(userWPDel);
            postWrap.appendChild(userDel);

            const postMedia = document.createElement("div");
            postMedia.className = "post_media";
            const mediaContent = document.createElement("div");
            const postText = document.createElement("div");
            postText.textContent = data.payload.text_post;
            mediaContent.appendChild(postText);

            postMedia.appendChild(mediaContent);
            postWrap.appendChild(postMedia);

            const attentDiv = document.createElement("div");
            attentDiv.className = "attent";

            const engageDiv = document.createElement("div");
            engageDiv.className = "engage";
            const likeDiv = document.createElement("div");
            likeDiv.className = "like_but eng";

            const likeForm = document.createElement("form");
            likeForm.method = "post";
            likeForm.className = "like_cou engCount";
            likeForm.id = "like-form";
            likeForm.setAttribute("data-url", `/posts/feed/${data.payload.id}/like_post/`);

            const csrfTokenInput = document.createElement("input");
            csrfTokenInput.type = "hidden";
            csrfTokenInput.name = "csrfmiddlewaretoken";
            csrfTokenInput.value = csrfToken;

            likeForm.appendChild(csrfTokenInput);

            const likeButton = document.createElement("button");
            likeButton.id = "like-btn";
            likeButton.name = "like";

            const likeIcon = document.createElement("i");
            likeIcon.className = "bi bi-heart";
            likeIcon.id = "likeIcon"
            const redDiv = document.createElement("div");
            redDiv.className = "red";
            likeIcon.appendChild(redDiv);
            likeButton.appendChild(likeIcon);

            likeForm.appendChild(likeButton);

            const likeCountDiv = document.createElement("div");
            likeCountDiv.className = "like_count engactcou";
            const likeCountText = document.createElement("span");
            likeCountText.textContent = `${data.payload.likes_count} like${data.payload.likes_count === 1 ? '' : 's'}`;
            likeCountDiv.appendChild(likeCountText);

            likeDiv.appendChild(likeForm);
            likeDiv.appendChild(likeCountDiv);
            engageDiv.appendChild(likeDiv);

            const commentDiv = document.createElement("div");
            commentDiv.className = "comment_but eng";

            const commentContentDiv = document.createElement("div");
            commentContentDiv.className = "comment_cou engCount";

            const commentButton = document.createElement("button");
            commentButton.name = "comments";
            commentButton.className = "commentButton";

            const commentIcon = document.createElement("i");
            commentIcon.className = "bi bi-chat";
            commentIcon.id = "commentIcon"
            commentButton.appendChild(commentIcon);

            const commentCountDiv = document.createElement("div");
            commentCountDiv.className = "comment_count engactcou";
            const commentCountText = document.createElement("span");
            commentCountText.textContent = `${data.payload.comments_count} comment${data.payload.comments_count === 1 ? '' : 's'}`;
            commentCountDiv.appendChild(commentCountText);

            commentContentDiv.appendChild(commentButton);
            commentContentDiv.appendChild(commentCountDiv);

            commentDiv.appendChild(commentContentDiv);
            engageDiv.appendChild(commentDiv);

            attentDiv.appendChild(engageDiv);
            postWrap.appendChild(attentDiv);

            all_p_flex.insertBefore(postAl, all_p_flex.firstChild);
            
                console.log(data);

            }    
        }

        else{
            const errorData = await response.json()
            console.log(errorData)
        }
    
    } catch (error) {
        console.log(error)
    }
}