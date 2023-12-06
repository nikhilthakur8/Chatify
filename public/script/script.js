document.getElementsByTagName("form")[0].addEventListener("submit", (e) => {
  const emailId = document.getElementById("exampleInputEmail1").value;
  localStorage.setItem("emailId", emailId);
});