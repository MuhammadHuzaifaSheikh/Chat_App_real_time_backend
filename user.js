const users = [];
const addUser = ({id, name, room}) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const user = {id, name, room};

    let usersInRoom=   getUsersInRoom(room)
    const found = usersInRoom.some(el => el.name === name);
    if (!found) {
        console.log('match nahi hoa');
        users.push(user);

        return {user};

    }

    else {
        console.log('match hogia ha');
        return false
    }
    // users.push(user);
    //  return {user};


}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) =>
    user.room === room,
);
module.exports = {addUser, removeUser, getUser, getUsersInRoom};
