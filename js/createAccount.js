"use strict";

//Requests the server to create an account based on the data from the document.
async function createAccount(data) {
  try {
    let responseObject = await fetch("/signup", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedJSON = await responseObject.json();
    if (parsedJSON.status === "fail") {
      document.getElementById("createErrorMsg").innerHTML = parsedJSON.msg;
    } else {
      window.location.replace("/login");
    }

  } catch (error) {
  }
}

//Creates a click event to create an account when the create button is pressed.
ready(document.getElementById("createBtn").addEventListener("click", function(e) {
  if((document.getElementById("usernameBox").value) && (document.getElementById("passwordBox").value) && (document.getElementById("firstNameBox").value) && (document.getElementById("lastNameBox").value) && (document.getElementById("email").value)){
    createAccount({
      "username": document.getElementById("usernameBox").value,
      "password": document.getElementById("passwordBox").value,
      "firstName": document.getElementById("firstNameBox").value,
      "lastName":document.getElementById("lastNameBox").value,
      "email":document.getElementById("email").value,
      "role_id":0
    });
  } else {
    e.preventDefault();
    document.getElementById("createErrorMsg").innerText = "Please fill out all fields.";
  }
}))

//Executes callback when the document is loaded.
function ready(callback) {
  if (document.readyState != "loading") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}