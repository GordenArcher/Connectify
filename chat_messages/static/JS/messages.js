const liscontainer = document.querySelectorAll(".c_f_fle .liscontainer")
const search_friends = document.getElementById("chat_friends_search")

search_friends.addEventListener("input", () => {

    const search = search_friends.value.toLowerCase();
    liscontainer.forEach(list => {
        const friendNameElement = list.querySelector(".friendname");
        const friendName = friendNameElement ? friendNameElement.textContent.toLowerCase() : "";

        if(friendName.includes(search)){
            list.style.display = 'inline-flex'
        }
        else{
            list.style.display = 'none'
        }
    })
})