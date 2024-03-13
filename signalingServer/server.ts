const port = process.env.PORT || 4000;
const io = require('socket.io')(port, {
    cors: {
        origin: '*'
    }
})


io.on('connection', (socket: any) => {
    console.log('A peer connected with socket id', socket.id)
    socket.on('offer', (sender: any, reciever: any, offer: any) => {
        console.log("an offer was made");

        socket.broadcast.emit('offer', sender, reciever, offer)
    })
    socket.on('answer', (sender: any, reciever: any, answer: any) => {
        console.log("an answer  was sent back");
        socket.broadcast.emit('answer', sender, reciever, answer)
    })
    socket.on('new-ice-candidate', async (iceCandidate: any) => {
        console.log("new ice candidate was sent");
        socket.broadcast.emit('new-ice-candidate', iceCandidate)
    })
    socket.on('SDP_complete', () => {
        console.log("SDP EXCHANGE COMPLETED!");

        socket.broadcast.emit('SDP_complete')
    })
    socket.on('disconnect', () => {
        console.log('A peer disconnected with socket id', socket.id)

    })

})