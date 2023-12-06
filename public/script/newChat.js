const chatNowContainer = document.getElementById("chatNowContainer");
document.getElementById("chatButton").addEventListener("click", () => {
  const display = chatNowContainer.style.display;
  if (display == "flex") chatNowContainer.style.display = "none";
  else chatNowContainer.style.display = "flex";
});

chatNowContainer.children[0].addEventListener("click", () => {
  chatNowContainer.style.display = "none";
});
const chatNowButton = document.getElementsByClassName("chatNowButton")[0];

function errMessage(message) {
  const span = document.createElement("span");
  span.innerText = `${message}`;
  span.style.color = "red";
  span.style.display = "block";
  span.style.fontSize = "0.8rem";
  span.className = "err";
  const chatNow = document.getElementById("chatNow");
  chatNow.insertBefore(span, chatNow.children[1]);
}

chatNowButton.addEventListener("click", () => {
  const userId = document.getElementById("chatNow").firstChild;
  fetch(`http://localhost:8000/api/user/${userId.value}`)
    .then(async (response) => {
      if (response.ok) {
        if (document.getElementById("chatNow").children[1].tagName == "SPAN") {
          document
            .getElementById("chatNow")
            .removeChild(document.getElementById("chatNow").children[1]);
        }
        setTimeout(() => {
          chatNowContainer.style.display = "none";
          userId.value = "";
        }, 500);
        window.location.href = `/home`;
      } else {
        const message = await response.json();
        if (document.getElementById("chatNow").children[1].tagName == "SPAN") {
          const errorMessage = document.getElementsByClassName("err")[0];
          errorMessage.innerText = message.error;
        }
        else{
        errMessage(message.error);}
        userId.value = "";
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

// chat
const childs = document.getElementById("allChatContainer").childNodes;
Array.from(childs).forEach((child) => {
  const userId = child.children[0].innerText;
  child.addEventListener("click", () => {
    window.location.href = `/chat/${userId}`;
  });
});
