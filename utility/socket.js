
let io;
let activeUsers = [];
const db = require('../models/index')
const user = db.user;

function init(http){    
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
            if(!activeUsers.some(user => user.id === newUserId)){                             
                activeUsers.push({
                    id:newUserId,
                    name: userDetail.dataValues.displayName,
                    socketId:socket.id
                })
            }
            io.emit('get-users',activeUsers)
        })
        socket.on('disconnect', () => {
            activeUsers = activeUsers.filter(user => user.socketId!== socket.id)
            console.log('user disconnected',activeUsers);
            io.emit('get-users',activeUsers)
        })
    });    
}


module.exports ={
    init
}