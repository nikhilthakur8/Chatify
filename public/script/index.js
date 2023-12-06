const socket = io();
// event Listening of submit and clicking event of send message
const sendBtn = document.getElementById("sendBtn");
sendBtn.addEventListener("submit", (e) => textExtractor(e));
document
  .getElementById("button-addon2")
  .addEventListener("click", (e) => textExtractor(e));

socket.on("user-message", (message) => {
  messageAppend(message, "left");
});
// Chat Now button
const windowLocation = window.location.href;
const urlParts = windowLocation.split("/");
const user = urlParts[urlParts.length-1];

document.addEventListener("DOMContentLoaded",()=>{
  chatContainer.scrollTop = chatContainer.scrollHeight;
})

socket.on("status",(status)=>{
  document.getElementsByClassName("status")[0].innerText = status;
})


// function

function personalMessageEmitter(user,message) {
  socket.emit("user-message",user,message);
}
function textExtractor(e) {
  e.preventDefault();
  const text = document.getElementById("message");
  messageAppend(text.value, "right");
  personalMessageEmitter(user,text.value);
  text.value = "";
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
function messageAppend(message, position) {
  const div = document.createElement("div");
  if(message==="") return;
  div.innerText = message;
  if (message.length < 80)
    div.setAttribute("class", `${position} chat mb-2 mt-2`);
  else div.setAttribute("class", `${position} long-chat chat mb-2 mt-2`);
  document.getElementById("chatContainer").appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
