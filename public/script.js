const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
})
.then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    console.log('My Peer ON Call')
    call.answer(stream)
    console.log('Peer Call Answer ')
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
    console.log('user connectd :', userId)
  })

})

socket.on('user-disconnected', userId => {
  console.log('user disconnected :', userId)
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  console.log('PEER On alone')
  socket.emit('join-room', ROOM_ID, id)
  console.log('Emit JoinRoom')
  console.log('user :', id)
})

function connectToNewUser(userId, stream) {
  console.log('Ftc Connex New User')
  const call = myPeer.call(userId, stream)
  console.log('user :', userId)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    console.log('addVideo Will Start')
    video.play()
  })
  videoGrid.append(video)
}