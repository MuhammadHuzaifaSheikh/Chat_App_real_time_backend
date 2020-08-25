const express = require('express');
const bodeParser = require('body-parser');


var cors = require('cors')
const app = express();

app.use(cors());
app.use(bodeParser.json({limit: '5000kb'}))


app.get('/', function (req, res) {
    console.log('listen');
    res.send({hello:'hello'})
})


const server = require('http').createServer(app);
const options = { /* ... */ };
const io = require('socket.io')(server, options);

let users = {}
let usersName = []

io.on('connection', (socket) => {

    socket.on('new_user_joined', data => {
        users[socket.id]=data.name
        usersName.push(users[socket.id])
        console.log(usersName, ' add');


        socket.broadcast.emit('user_joined', {message:`${users[socket.id]} joined the chat `,time:new Date().toLocaleTimeString(),name:'Admin'});
            socket.emit('welcome', {message:`${users[socket.id]} welcome to the chat `,time:new Date().toLocaleTimeString(),name:'Admin'});
        io.emit('users',usersName);


    });
    socket.on('sendMessage', message => {
        socket.broadcast.emit('receiveMessage', {message: message.message,time:message.time,name:message.name});


    });


    socket.on('disconnect', () => {
        // socket.rooms === {}
        socket.broadcast.emit('leave', {message:`${users[socket.id]} has left the chat `,time:new Date().toLocaleTimeString(),name:'admin'});
        var usernameIndex= usersName.indexOf(users[socket.id])
        usersName.splice(usernameIndex,1)
        console.log(usersName,' removed');
        io.emit('userDisconnect',usersName);
        delete users[socket.id]




    });








});



app.set('port', process.env.PORT || 4000);
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});

