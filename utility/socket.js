let io;
function init(http){
    io = require('socket.io')(http, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
          credentials: true,
        },
        allowEIO3: true, // false by default
    })
    io.on('connection', (socket) => {
        console.log('a user connected');
    });    
}

module.exports ={
    init
}