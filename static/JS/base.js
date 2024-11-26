const navigate = () => {
    document.location.pathname = "/"
}

const removeSide = () => {
    document.querySelector('.sidebar').classList.remove('active');
}

const showSide = () => {
    document.querySelector('.sidebar').classList.add('active');
}