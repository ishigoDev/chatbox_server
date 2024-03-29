
let io;
let activeUsers = [];
const db = require('../models/index')
const user = db.user;

function init(http) {
    io = require('socket.io')(http, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        allowEIO3: true,
    })
    io.on('connection', (socket) => {
        socket.on('new-user-add', async (newUserId) => {
            const userDetail = await user.findByPk(newUserId)
            if (!activeUsers.some(user => user.id === newUserId)) {
                activeUsers.push({
                    id: newUserId,
                    name: userDetail.dataValues.displayName,
                    socketId: socket.id
                })
            }
            io.emit('get-users', activeUsers)
        })
        socket.on('send-message', async (data) => {            
            const { receiverId } = data;
            const recieverUser = activeUsers.find(user => user.id === receiverId);                                       
            if (recieverUser) {                                
                io.to(recieverUser.socketId).emit('receive-message', data.activeChatRoom);
            }
        })
        socket.on('typing', (data) => {
            const { receiverId } = data;
            const user = activeUsers.find(user => user.id === receiverId);
            if (user)
                io.to(user.socketId).emit('typing-user', data.typing);
        })
        socket.on('user-created',(data)=>{
            io.emit('user-created-data',data)            
        })
        socket.on('disconnect', () => {            
            const disconnect_user = activeUsers.filter(user => user.socketId === socket.id)
            activeUsers = activeUsers.filter(user => user.socketId !== socket.id)
            disconnect_user.map(userDetail => {
                user.saveLastSeen(userDetail.id)
            });            
            io.emit('get-users', activeUsers)
        })
    });
}


module.exports = {
    init
}