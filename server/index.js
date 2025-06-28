const express = require('express');
const app = express();
const path = require('path');

const http = require('http').createServer(app);
const io = require('socket.io')(http);


const port = 3000;

// Serve static files from the parent directory (for index.html, style.css, etc.)
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..','public', 'index.html'));
});

// Store users in an object
const users = {};

//  show no. of users online
app.get('/users', (req, res) => {
    res.json(Object.values(users)); 
    // Return the list of users
});

// socketIO part:-
// builds connection
io.on('connection', socket=>{
    // notify users about new user
    socket.on('new-user-joined',name=>{
        socket.broadcast.emit('user-joined',name);
        users[socket.id] = name; 
    });

    // notify users about user left
    // socketIO emits disconnect event automatically on refresh
    // socket.on('disconnect',()=>{
    //     socket.broadcast.emit('user-left',users[socket.id]);
    //     delete users[socket.id];
    //      // remove user from the list
    // });

    // leaving room
    socket.on('leave-room', ()=>{
        socket.broadcast.emit('user-left', users[socket.id]);
        delete users[socket.id];
        // Optionally, disconnect the socket:
    })

    // handle message sending
    socket.on('send', message=>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });


});




http.listen(3000, () => {
  console.log(`CORVO app is running on port:`);
  console.log("LOCAL machine")
  console.log(`http://localhost:${port}`);
  console.log("or")
  console.log("External machine")
  console.log(`http://192.168.29.55:${port}`)
})