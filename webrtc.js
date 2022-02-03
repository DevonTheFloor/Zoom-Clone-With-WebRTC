const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    console.log('Socket ON join room')
    socket.join(roomId)
    console.log('Room Id :', roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)
    console.log('BroadCast EMiT !!')

    socket.on('disconnect', () => {
      console.log('Socket ON DISCONNECT')
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(3030)