// File: public/client.js
const socket = io();

// fetching DOM 
const form = document.getElementById('form');
const inpMsg = document.getElementById('inpMsg');
const messageContainer = document.querySelector('.container');
const toggleBtn = document.getElementById('toggleBtn');



let name = "";
while (!name) {
    name = prompt("Enter your name to join the chat");
    if(name){
        break;
    }
}


socket.on('user-joined', name =>{
    appendMessage(name, "Joined the Chat");
});

socket.on('user-left', name =>{
    appendMessage(`${name}`, "Left the Chat");
});

socket.on('receive', data =>{
    appendMessage(`${data.name}`, data.message);
});


form.addEventListener('submit', (e)=>{
    e.preventDefault();
    // prevents reloading page everytime when user sends message, thats it we dont need 'e' anymore

    const msg = inpMsg.value;
    if (!msg) return; 
    //dont send if msg is empty

    appendMessage("You:", msg);
    socket.emit('send', msg);
    inpMsg.value = ''; // clear input field after sending message 

});


//function to append message to the container
function appendMessage(sender, message){
    // text block
    const textBlock = document.createElement('div');

    // ...
    // textBlock.classList.add('message', position);
    // ...

    // sender name
    const senderElement = document.createElement('span');
    senderElement.innerText = sender + ": ";

    // message data 
    const messageElement = document.createElement('span');
    messageElement.innerText = message;

    // appending
    textBlock.appendChild(senderElement);
    textBlock.appendChild(messageElement);
    messageContainer.appendChild(textBlock);

}


// FUNCTION user online count
function updateUserCount() {
    fetch('/users')
        .then(res => res.json())
        .then(users => {
            document.getElementById('userCount').innerText = `Users online: ${users.length}`;
            document.getElementById('userList').innerText = `Users list: ${users.join(', ')}`;
        });
}
// update usercount
updateUserCount();
setInterval(updateUserCount, 400);


let NEW = false;
toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!NEW) {
        // new chat logic
        socket.emit('new-user-joined', name);
        NEW = true;
        toggleBtn.innerText = "Leave";
    } else {
        // Leave logic
        socket.emit('leave-room');
        NEW = false;
        toggleBtn.innerText = "NEW";
        alert('You have left the chat.');
    }
});