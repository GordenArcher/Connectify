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


const chat_iput_box_imoji = document.querySelector(".chat_iput_box_imoji")
const show_emoji = document.querySelector("#show_emoji")


show_emoji.addEventListener("click", (event) => {
    event.stopPropagation();
    chat_iput_box_imoji.classList.toggle("show_emoji")
})

document.addEventListener("click", () => {
    chat_iput_box_imoji.classList.remove("show_emoji")
})



const roomName = JSON.parse(document.getElementById('room-name').textContent);

const socket = new WebSocket(`ws://${window.location.host}/ws/messages/chat/${roomName}/`)


function getLastMessageId() {
    return localStorage.getItem('lastMessageId') || null;
}


socket.onopen = () => {
    socket.send(JSON.stringify({ type: 'sync', lastReceivedMessageId: getLastMessageId() }));
    console.log("websocket opened")
}

socket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    console.log(data)
    console.log(socket.readyState);

    if (data.type === 'new_message_notification') {
        console.log('New message notification received: ', data.notification);
    }
    
    if (data.error) {
        console.error(data.error)
        return
    }

    const message = data.message;
    const sender = data.sender;
    const media = data.media
    const recipient = data.recipient;
    const loggedInUser = data.loggedInUser;
    console.log(recipient)

    const isSentByUser = sender === loggedInUser;
    console.log(isSentByUser)

    const chatWrapper = document.querySelector(".user_chat__wrapper");
    const vieww = document.querySelector(".vieww span");
    const numcount = document.querySelector(".numcount")

    if(isSentByUser == false){
        numcount.style.display = 'flex'
        numcount.textContent = data.incomingMessageCount
    }

    if(recipient === loggedInUser){
        vieww.textContent = message
    }

    const messageDiv = document.createElement("div");
    messageDiv.classList.add(isSentByUser ? "user_chat_sent" : "user_chat_receive_wrapper");

    const currentDateTime = new Date().toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const Timeset = document.querySelector(".Timeset p")
    Timeset.textContent = currentDateTime

    let dis;

    if(media){
        dis = `<img src="${media}" />`
    }else if(message){
        dis = `<div>${message}</div>`
    }

    const messageTemplate = `
        ${isSentByUser ? `
            <div class="user_chat_sender_box chat-animation">
                <div class="user_chat_sender_cont">
                    <div class="chat_inbox_send">
                        ${dis}
                    </div>
                </div>
                <div class="user_chat_send_name">
                    <span class="send_">${currentDateTime}</span>
                </div>
            </div>
        ` : `
            <div class="user_chat_receive_box chat-animation">
                <div class="user_chat_receive_cont">
                    <div class="chat_inbox_receive">
                        <div class="user_chat_receive">
                            ${dis}
                        </div>
                    </div>
                </div>
                <div class="user_chat_receiver_name">
                    <span class="inbox">${currentDateTime}</span>
                </div>
            </div>
        `}
    `;

    messageDiv.innerHTML = messageTemplate;

    chatWrapper.appendChild(messageDiv);

    chatWrapper.scrollTop = chatWrapper.scrollHeight;

    const newMessage = chatWrapper.querySelector('.chat-animation:last-child');
    if (newMessage) {
        newMessage.addEventListener('animationend', () => {
            newMessage.classList.remove('chat-animation');
        });
    }
};


socket.onclose = () => {
    console.log("Websocket closed")
}


document.querySelector('emoji-picker').addEventListener('emoji-click', (event) =>  {
    const inputField = document.getElementById("sender_chat");
    inputField.value += event.detail.unicode;
    console.log(event.detail)

});

const image_preview = document.querySelector("#media-prev")
const media_choose = document.querySelector(".media_choose")
const send_media = document.getElementById("send_media")

send_media.addEventListener("change", () => {
    const file = send_media.files[0]

    if (file) {
        const fileType = file.type;

        if (fileType.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const mDiv = document.createElement('div')
                mDiv.className = 'pre_i_s'
                const sDiv = document.createElement('div')
                sDiv.className = 'm_pre'
                mDiv.appendChild(sDiv)
                const mImage = document.createElement('img')
                mImage.id = 'media-prev'
                mImage.src = e.target.result;
                sDiv.appendChild(mImage)
                media_choose.appendChild(mDiv)
            };
            reader.readAsDataURL(file);
        } else if (fileType.startsWith("video/")) {
            const videoURL = URL.createObjectURL(file); 
            videoPreview.src = videoURL;
        } else {
            alert("Unsupported file type. Please upload an image or video.");
        }

    }  
})

const send_message = () => {
    const sender_chat = document.getElementById("sender_chat");
    const send_media = document.getElementById("send_media"); // Ensure this exists

    if (!sender_chat || !send_media) {
        return console.error("Required elements not found.");
    }

    const textMessage = sender_chat.value.trim();
    const file = send_media.files[0];

    console.log("Selected file:", file);

    if (!textMessage && !file) {
        return showAlert("No message or media was entered");
    }

    const messageData = {
        message: textMessage || null,
        media: null,
    };

    if (file) {

        const reader = new FileReader();
        reader.onload = function (event) {
            messageData.media = event.target.result;

            socket.send(JSON.stringify(messageData));
        };
        reader.readAsDataURL(file);
    } else {
        socket.send(JSON.stringify(messageData));
    }

    // Clear the input fields
    sender_chat.value = "";
    send_media.value = ""; // Reset file input
};


document.getElementById("send_message").addEventListener("click", () => {
    send_message()
})  

document.addEventListener("keypress", (e) => {
    if(e.key === 'Enter'){
        e.preventDefault()
        send_message()
    }
})

function updateStatusIndicator() {
    const statusIndicator = document.getElementById('status-indicator');
    if (navigator.onLine) {
        statusIndicator.textContent = 'Online';
        statusIndicator.style.color = 'green';
    } else {
        statusIndicator.textContent = 'Offline';
        statusIndicator.style.color = 'red';
    }
}

window.addEventListener('online', updateStatusIndicator);
window.addEventListener('offline', updateStatusIndicator);
updateStatusIndicator();
