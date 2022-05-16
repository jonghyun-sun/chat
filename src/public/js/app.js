const socket = io()


// // //비디오 파트
// const myFace = document.getElementById("myFace");
// const muteBtn = document.getElementById("mute");
// const cameraBtn = document.getElementById("camera");

// let myStream;
// let muted = false;
// let cameraOff = false;

// async function getMedia() { //카메라 오디오 켜기 
//   try {
//     myStream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: true,
//     });
//     myFace.srcObject = myStream;
//   } catch (e) {
//     console.log(e);
//   }
// }

// getMedia();
// function handleMuteClick(){
//   if(!muted){
//     muteBtn.innerText = "Unmute"
//     muted = true
//   }else{
//     muteBtn.innerText = "Mute"
//     muted = false
//   }
// }
// function handleCameraClick(){
//   if(cameraOff){
//     cameraBtn.innerText = "Turn Camera Off" 
//   }else{
//     cameraBtn.innerText = "Turn Camera On"
//   }
// }

// muteBtn.addEventListener("click",handleMuteClick)
// cameraBtn.addEventListener("click",handleCameraClick)

// 채팅 부분


const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form") //pug 의 form 가져옴
const room = document.getElementById("room")

room.hidden = true//방에 들어가기 전에는 메세지 창 숨겨야함

let roomName;
function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}


function showRoom(){
  welcome.hidden = true
  room.hidden = false
  const h3 = room.querySelector("h3")
  h3.innerText = `Room ${roomName}` //룸네임 위에 적어줘
  const msgForm = room.querySelector("#msg")
  const nameForm = room.querySelector("#name")
  
  msgForm.addEventListener("submit",handleMessageSubmit)
  nameForm.addEventListener("submit",handleNicknameSubmit)
}

function handleRoomSubmit(event){
  event.preventDefault()
  const input = form.querySelector("input") //form의 input 값 가져옴 
  socket.emit("enter_room",input.value,showRoom) //(이벤트 이름,보내고 싶은 데이터,벡엔드에 있는 함수 모습)
  roomName = input.value
  input.value=""
}
function handleMessageSubmit(event){
  event.preventDefault()
  const input = room.querySelector("#msg input")
  const value = input.value //밑에서 ""으로 초기화 되기전에 message 보내 줄 수 있음
  socket.emit("new_message",input.value,roomName,()=>{
    addMessage(`You:${value}`)
  })//백엔드로 쓴 메세지 보내기
  input.value=""
}
function handleNicknameSubmit(event){
  event.preventDefault()
  const input = room.querySelector("#name input")
  const value = input.value //밑에서 ""으로 초기화 되기전에 message 보내 줄 수 있음
  socket.emit("nickname",input.value)
}
 
form.addEventListener("submit",handleRoomSubmit)

socket.on("welcome", (user,newCount) => {
  const h3 = room.querySelector("h3")
  h3.innerText = `Room ${roomName} (${newCount})` //룸네임 위에 변경해줘
  addMessage(`${user} arrived!`);
});
socket.on("bye", (left,newCount) => {
  const h3 = room.querySelector("h3")
  h3.innerText = `Room ${roomName} (${newCount})` //룸네임 위에 변경해줘
  addMessage(`${left} left!`);
});
socket.on("new_message",addMessage)//addMessage(msg) 호출

socket.on("room_change",(rooms)=>{ //열려있는 방 목록 보여주기
  const roomList = welcome.querySelector("ul")
  roomList.innerHTML = "" //룸 중복으로 보이지 않게 해주기
  if(rooms.length === 0){
    return;
  }//룸 없어지면 html에서 지워주기
  rooms.forEach((room)=>{
    const li = document.createElement("li")
    li.innerText = room;
    roomList.append(li)
  })
})



