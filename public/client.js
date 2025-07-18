// File: public/client.js
const socket = io();


// fetching login DOM
const profileModal = document.getElementById('profileModal');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const nameInput = document.getElementById('nameInput');
const ageInput = document.getElementById('ageInput');
const sexInput = document.getElementById('sexInput');
const chatSection = document.getElementById('chatSection');
let name = "";
let age =''
let sex =''

// when user saves profile
saveProfileBtn.addEventListener('click', () => {
    name = nameInput.value.trim();
    age = ageInput.value.trim();
    sex = sexInput.value;
    if (!name || !age || !sex) {
        alert("Please fill all fields!");
        return;
    }
    profileModal.style.display = 'none';
    chatSection.style.display = 'block';
    socket.emit('user-online', { name, age, sex }); //tells user isOnline
    appendMessage("System", "Hit Join button to start chatting with someone.");
});


// message form DOM 
const form = document.getElementById('form');
const inpMsg = document.getElementById('inpMsg');
const messageContainer = document.querySelector('.container');
const toggleBtn = document.getElementById('toggleBtn');



socket.on('user-joined', name =>{
    appendMessage(name, "Joined the Chat");
});

socket.on('user-left', name =>{
    appendMessage(`${name}`, "Left the Chat");
});

socket.on('receive', data =>{
    appendMessage(`${data.name}`, data.message);
});

// When paired
socket.on('paired', ({ partner }) => {
    appendMessage("System", `You are now chatting with: ${partner}`);
    toggleBtn.innerText = "Leave";
    NEW = true;
});

// When partner leaves
socket.on('partner-left', (data) => {
    appendMessage("System", data.msg);
    toggleBtn.innerText = "NEW";
    NEW = false;
    // Optionally clear chat UI or disable input
});
socket.on('you-left', (data) => {
    appendMessage("System", data.msg);
    toggleBtn.innerText = "Join";
    NEW = false;
    // Optionally disable input here
});


socket.on('partner-left', () => {
    toggleBtn.innerText = "NEW";
    toggleBtn.disabled = false;
    // Optionally show a message: "Partner left. Click NEW to find another."
    // User must click NEW to rejoin the waiting queue.
});


form.addEventListener('submit', (e)=>{
    e.preventDefault();
    // prevents reloading page everytime when user sends message, thats it we dont need 'e' anymore

    const msg = inpMsg.value;
    if (!msg) return; 
    //dont send if msg is empty

    appendMessage("You", msg);
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


let NEW = false; // <-- start as false
toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!name || !age || !sex) {
        alert("Please fill your profile first!");
        return;
    }
    if (!NEW) {
        // User wants to join waiting queue
        socket.emit('new-user-joined', { name, age, sex });
        NEW = true;
        toggleBtn.innerText = "Leave";
    } else {
        // User wants to leave
        socket.emit('leave-room');
        NEW = false;
        toggleBtn.innerText = "Join";
        alert('You have left the chat.');
    }
});