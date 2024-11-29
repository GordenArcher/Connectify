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

