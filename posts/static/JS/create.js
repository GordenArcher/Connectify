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
            if (data.status === "sucess") {
                console.log(data)
                showAlert(data.message)
        
            const all_p_flex = document.querySelector(".all_p_flex");

            const postDiv = document.createElement('div');
            postDiv.classList.add('post_al');

            const postWrap = document.createElement('div');
            postWrap.classList.add('post_wrap');
            postDiv.appendChild(postWrap);

            const userDel = document.createElement('div');
            userDel.classList.add('user_del');
            postWrap.appendChild(userDel);

            const userWPDel = document.createElement('div');
            userWPDel.classList.add('user_w_p_del');
            userDel.appendChild(userWPDel);

            const userWPProf = document.createElement('div');
            userWPProf.classList.add('user_w_p_prof');
            userWPDel.appendChild(userWPProf);

            const profileImg = document.createElement('img');
            profileImg.src = data.profile ? data.profile : '/static/images/avatar-4.png';
            profileImg.alt = "Profile Picture";
            userWPProf.appendChild(profileImg);

            const userWPName = document.createElement('div');
            userWPName.classList.add('user_w_p_d_name');
            userWPDel.appendChild(userWPName);

            const userName = document.createElement('p');
            userName.textContent = data.payload.user;
            userWPName.appendChild(userName);

            const postMedia = document.createElement('div');
            postMedia.classList.add('post_media');
            postWrap.appendChild(postMedia);

            const mediaDiv = document.createElement('div');
            mediaDiv.classList.add('media');
            mediaDiv.style.cursor = 'pointer';
            mediaDiv.onclick = function() {
                location.assign(`/posts/feed/${data.payload.id}/view_post/`);
            };
            postMedia.appendChild(mediaDiv);

            if (data.payload.media_url && data.payload.media_url.startsWith("image")) {
                const imgTag = document.createElement('img');
                imgTag.src = data.payload.media_url;
                imgTag.alt = "Post media";
                mediaDiv.appendChild(imgTag);
            } else if (data.payload.media_url) {
                const videoTag = document.createElement('video');
                videoTag.controls = true;

                const sourceTag = document.createElement('source');
                sourceTag.src = data.payload.media_url;
                sourceTag.type = "video/mp4";

                videoTag.appendChild(sourceTag);
                mediaDiv.appendChild(videoTag);
            } else {
                const noMediaMessage = document.createElement('p');
                noMediaMessage.textContent = "No media available";
                mediaDiv.appendChild(noMediaMessage);
            }

            if (data.payload.content) {
                const postDesc = document.createElement('div');
                postDesc.classList.add('post_descc');
                postWrap.appendChild(postDesc);

                const descDiv = document.createElement('div');
                descDiv.classList.add('desp');
                postDesc.appendChild(descDiv);

                const descText = document.createElement('span');
                descText.textContent = data.payload.content;
                descDiv.appendChild(descText);
            }

            const attentDiv = document.createElement('div');
            attentDiv.classList.add('attent');
            postWrap.appendChild(attentDiv);

            const engageDiv = document.createElement('div');
            engageDiv.classList.add('engage');
            attentDiv.appendChild(engageDiv);

            // Like button section
            const likeButDiv = document.createElement('div');
            likeButDiv.classList.add('like_but', 'eng');
            engageDiv.appendChild(likeButDiv);

            const likeForm = document.createElement('form');
            likeForm.method = 'post';
            likeForm.classList.add('like_cou', 'engCount');
            likeForm.id = 'like-form';
            likeForm.setAttribute('data-url', `/posts/like-post/${data.payload.id}/`);
            likeButDiv.appendChild(likeForm);

            const likeButton = document.createElement('button');
            likeButton.id = 'like-btn';
            likeButton.name = 'like';
            likeForm.appendChild(likeButton);

            const likeIcon = document.createElement('i');
            likeIcon.classList.add('bi', 'bi-heart');
            likeButton.appendChild(likeIcon);

            const likeRedDiv = document.createElement('div');
            likeRedDiv.classList.add('red');
            likeIcon.appendChild(likeRedDiv);

            const likeCountDiv = document.createElement('div');
            likeCountDiv.classList.add('like_count', 'engactcou');
            likeForm.appendChild(likeCountDiv);

            const likeCountTextDiv = document.createElement('div');
            likeCountTextDiv.classList.add('li_c');
            likeCountDiv.appendChild(likeCountTextDiv);

            const likeCountText = document.createElement('span');
            likeCountText.id = 'likes-count';
            likeCountText.textContent = '0 . like';
            likeCountTextDiv.appendChild(likeCountText);

            const commentButDiv = document.createElement('div');
            commentButDiv.classList.add('comment_but', 'eng');
            engageDiv.appendChild(commentButDiv);

            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment_cou', 'engCount');
            commentDiv.style.cursor = 'pointer';
            commentDiv.onclick = function() {
                location.assign(`/posts/feed/${data.payload.id}/view_post/`);
            };
            commentButDiv.appendChild(commentDiv);

            const commentButton = document.createElement('button');
            commentButton.name = 'comments';
            commentDiv.appendChild(commentButton);

            const commentIcon = document.createElement('i');
            commentIcon.classList.add('bi', 'bi-chat');
            commentButton.appendChild(commentIcon);

            const commentCountDiv = document.createElement('div');
            commentCountDiv.classList.add('comment_count', 'engactcou');
            commentDiv.appendChild(commentCountDiv);

            const commentCountTextDiv = document.createElement('div');
            commentCountTextDiv.classList.add('co_c');
            commentCountDiv.appendChild(commentCountTextDiv);

            const commentCountText = document.createElement('span');
            commentCountText.textContent = '0 . comment';
            commentCountTextDiv.appendChild(commentCountText);

            all_p_flex.appendChild(postDiv, all_p_flex.firstChild);

                const uploadImagePopup = document.querySelector(".upload_image_popup");
                if (uploadImagePopup) {
                    uploadImagePopup.style.display = 'none';
                }


            } else {
                console.log(data)
                showAlert(data.message);
            }
        })
        .catch(error => console.error("Error:", error));
})

const imageInput = document.getElementById('image_post');
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