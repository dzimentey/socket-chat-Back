
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
//const io = new Server(server);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const initMessages = []

app.get('/', (req, res) => {
    res.send('Hellloooo WebSocket Server!!!');
});


const usersState = new Map()


io.on('connection', (socket) => {
    console.log('a user connected');

    usersState.set(socket, {id: new Date().getTime().toString(), name: 'anonymous'})

    socket.on('disconnect', () => {
        usersState.delete(socket)
    })

    socket.on('client-name-sent', (name) => {
           const user = usersState.get(socket)
           user.name = name
    })

    socket.on('client-typing', () => {
        socket.emit('user-typing', usersState.get(socket))
    })

    socket.on('message-sent', message => {
        console.log(message)

        const user = usersState.get(socket)

        let messageItem = {
            message: message,
            id: new Date().getTime(),
            user: {id: user.id, name: user.name}
        };
        initMessages.push(messageItem)
        socket.emit('new-message-sent', messageItem)
    })

    socket.emit('got-init-messages', initMessages)
});

// io.on('message-sent', (message) => {
//     console.log(message);
// });

server.listen(3009, () => {
    console.log('listening on *:3009');
});

