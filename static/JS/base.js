const navigate = () => {
    document.location.pathname = "/"
}

const removeSide = () => {
    document.querySelector('.sidebar').classList.remove('active');
}

const showSide = () => {
    document.querySelector('.sidebar').classList.add('active');
}

const welcomeGreetings = document.getElementById("welcome")

const date = new Date()
const hours = date.getHours()

if(hours > 0 && hours <12){
    welcomeGreetings.textContent = "Good morning"
}else if(hours > 12 && hours < 16){
    welcomeGreetings.textContent = "Good Afternoon"
}
else{
    welcomeGreetings.textContent = "Good evening"
}
