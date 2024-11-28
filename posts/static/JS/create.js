const input = document.querySelector('#media');
input.addEventListener('change', () => {
    const files = input.files; 
    for (const file of files) {
        console.log(file.name); 
    }
});


