const express = require('express');
const app = express();
const path = require('path');

const http = require('http').createServer(app);
const io = require('socket.io')(http);


const port = 8000;

// Serve static files from the parent directory (for index.html, style.css, etc.)
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..','public', 'index.html'));
});

// Store users in an object
const users = {};

//  show no. of users online
app.get('/users', (req, res) => {
    res.json(Object.values(users).map(u => u.name)); // returns array of user names

});

const waitingQueue = [];
const chatPairs = {};

// builds connection
io.on('connection', socket=>{

    socket.on('user-online', profile => {
        socket.data.name = profile.name;
        socket.data.age = profile.age;
        socket.data.sex = profile.sex;
        users[socket.id] = profile; // store the whole profile
    });

    socket.on('new-user-joined', profile => {
    // Save profile if not already saved
    if (!socket.data.name) {
        socket.data.name = profile.name;
        socket.data.age = profile.age;
        socket.data.sex = profile.sex;
        users[socket.id] = profile;
    }
    // add user to waiting queue
    if (!waitingQueue.includes(socket)) {
        waitingQueue.push(socket);
    }
    tryPairUsers();
    });

    // leaving room
    socket.on('leave-room', ()=>{
        handleLeave(socket);
    });

    // handle message sending
    socket.on('send', message => {
        const partnerId = chatPairs[socket.id];
        if (partnerId) {
            io.to(partnerId).emit('receive', { name: socket.data.name, message });
        }
    });

    // handle private messages
    socket.on('disconnect', () => {
        handleLeave(socket);
    });

    

    function tryPairUsers() {
        // Pair users randomly while at least 2 are waiting
        while (waitingQueue.length >= 2) {
            // Pick two random users
            const idx1 = Math.floor(Math.random() * waitingQueue.length);
            const user1 = waitingQueue.splice(idx1, 1)[0];
            const idx2 = Math.floor(Math.random() * waitingQueue.length);
            const user2 = waitingQueue.splice(idx2, 1)[0];

            // if got connected to self lol, this wont happen but still. as a precaution
            if (user1.id === user2.id) {
                waitingQueue.push(user1);
                break;
            }
            // Pair them
            chatPairs[user1.id] = user2.id;
            chatPairs[user2.id] = user1.id;

            user1.emit('paired', { partner: user2.data.name });
            user2.emit('paired', { partner: user1.data.name });
        }
    }

    function handleLeave(socket) {
        // Remove from waiting queue if present
        const idx = waitingQueue.indexOf(socket);
        if (idx !== -1) waitingQueue.splice(idx, 1);

        // If in a chat, notify partner and unpair both
        const partnerId = chatPairs[socket.id];
        if (partnerId) {
            const partner = io.sockets.sockets.get(partnerId);
            if (partner) {
                partner.emit('partner-left', { msg: `Your partner ${socket.data.name} left the chat. Hit NEW button to talk to someone.` });
        }
            socket.emit('you-left', { msg: `You left. Hit NEW to talk to someone.` });
            delete chatPairs[partnerId];
        }
        delete chatPairs[socket.id];
        // delete users[socket.id]; 
    }


// closing bracet for socket.on('connection')
});



http.listen(port, () => {
  console.log(`CORVO app is running on port:`);
  console.log("LOCAL machine")
  console.log(`http://localhost:${port}`);
  console.log("or")
  console.log("External machine")
  console.log(`http://192.168.29.55:${port}`)
});