const express = require('express');
const bodeParser = require('body-parser');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./user');


var cors = require('cors')
const app = express();

app.use(cors());
app.use(bodeParser.json({limit: '5000kb'}))


app.get('/', function (req, res) {
    res.send({hello: 'hello'})
})

const server = require('http').createServer(app);
const options = { /* ... */};
const io = require('socket.io')(server, options);


io.on('connection', (socket) => {
    socket.on('join_room', room => {
        socket.join(room)
        rooms = room;
    })
    socket.on('new_user_joined', data => {
        const {user} = addUser({id: socket.id, name: data.name, room: rooms});
        if (user) {
            socket.to(user.room).broadcast.emit('user_joined', {
                message: `${user.name} joined the chat `,
                time: new Date().toLocaleTimeString(),
                name: 'Admin',
                type:'text',
            });

            socket.emit('welcome', {
                message: `${user.name} welcome to the chat `,
                time: new Date().toLocaleTimeString(),
                name: 'Admin',
                type:'text',
            });


         let users=   getUsersInRoom(user.room)
            io.to(user.room).emit('roomData', {room: user.room, users });

        }
        else {
            socket.emit('sameNameError', 'This User is already exist please select a different name');
        }
    });
    socket.on('writing', message => {
        const user = getUser(socket.id);
        if (user) {
            socket.to(user.room).broadcast.emit('some_one_writing', {
                message: `${user.name} is writing`,

            });
        }
    });
    socket.on('sendMessage', message => {
        const user = getUser(socket.id);
        if (user) {
            socket.to(user.room).broadcast.emit('receiveMessage', {
                message: message.message,
                time: message.time,
                name: user.name,
                type:message.type
            });
        }

    });
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            let users=   getUsersInRoom(user.room)
            socket.to(user.room).emit('roomDataDisconnect', {users});
            socket.to(user.room).broadcast.emit('leave', {
                message: `${user.name} has left the chat `,
                time: new Date().toLocaleTimeString(),
                name: 'admin',
                type:'text',
            });


        }


    });


});


app.set('port', process.env.PORT || 4000);
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});

