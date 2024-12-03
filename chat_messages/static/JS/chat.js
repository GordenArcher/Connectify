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

document.querySelector('emoji-picker').addEventListener('emoji-click', event => console.log(event.detail));


const roomName = JSON.parse(document.getElementById('room-name').textContent);

const socket = new WebSocket(`ws://${window.location.host}/ws/messages/chat/${roomName}/`)

socket.onopen = () => {
    console.log("websocket opened")
}

socket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    console.log(data)
    
    if (data.error) {
        console.error(data.error);
        return;
    }

    const message = data.message;
    const sender = data.sender;
    const recipient = data.recipient;
    const loggedInUser = sender;
    console.log(loggedInUser, recipient)

    const isSentByUser = sender === loggedInUser;

    const chatWrapper = document.querySelector(".user_chat__wrapper");

    const messageDiv = document.createElement("div");
    messageDiv.classList.add(isSentByUser ? "user_chat_sent" : "user_chat_receive_wrapper");

    const currentDateTime = new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    const messageBox = `
        ${isSentByUser ? `
            <div class="user_chat_sender_box">
                <div class="user_chat_sender_cont">
                    <div class="chat_inbox_send">
                        <div class="user_chat_send">${message}</div>
                    </div>
                </div>
                <div class="user_chat_send_name">
                    <span class="send_">Sent at: ${currentDateTime}</span>
                </div>
            </div>
        ` : `
            <div class="user_chat_receive_box">
                <div class="user_chat_receive_cont">
                    <div class="chat_inbox_receive">
                        <div class="user_chat_receive">${message}</div>
                    </div>
                </div>
                <div class="user_chat_receiver_name">
                    <span class="inbox">Received at: ${currentDateTime}</span>
                </div>
            </div>
        `}
    `;

    messageDiv.innerHTML = messageBox;
    chatWrapper.appendChild(messageDiv);

    // Scroll to the bottom of the chat
    chatWrapper.scrollTop = chatWrapper.scrollHeight;
};


socket.onclose = () => {
    console.log("Websocket closed")
}




document.getElementById("send_message").addEventListener("click", () => {
    const sender_chat = document.getElementById("sender_chat");

    const message = sender_chat.value

    if(!message.trim()){
        return showAlert("No message was entered")
    }

    socket.send(JSON.stringify({
        'message':message
    }))

    sender_chat.value = ""
})  