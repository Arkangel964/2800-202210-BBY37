"use strict";

//Initialization for tiny-editor.
tinymce.init({
  selector: '#mytextarea',
  plugins: [
    'a11ychecker', 'advlist', 'advcode', 'advtable', 'autolink', 'checklist', 'export',
    'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks',
    'powerpaste', 'fullscreen', 'formatpainter', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
  ],
  toolbar: 'undo redo | formatpainter casechange blocks | bold italic backcolor | ' +
    'alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help'
});

//Sends a request to the server to create a post based on the data in the document.
async function createPost(data) {
  //Save input box ids into two arrays to use later in the for-loop
  let inputBoxId = ["unitInput", "streetNumInput", "prefixInput", "streetNameInput", "streetTypeInput", "cityInput", "provinceInput"];
  try {
    let responseObject = await fetch("/submitPost", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedJSON = await responseObject.json();

    //If all required fields are filled and all the data are valid, page gets redirected
    if (parsedJSON.status === "success") {
      document.getElementById("msg").innerHTML = parsedJSON.msg;
      await sendFiles(parsedJSON.postID);
      window.location.replace(`/unitView?id=${parsedJSON.location_id}`);

      //If server finds any invalid data, highlight correpsonding input boxes with red border and display a message
    } else if (parsedJSON.status === "Invalid data") {
      for (let i = 0; i <= 6; i++) {
        if (!parsedJSON.validation[i]) {
          document.getElementById(inputBoxId[i]).setAttribute("style", "border: 3px solid #DB3A34");
        }
      }
      document.getElementById("msg").innerHTML = "You have entered invalid data, please correct the fields highlighted in red";
    } else {
      document.getElementById("msg").innerHTML = "Error,unable to create a post";
    }

  } catch (error) {}
}

//Sends image files from the file into the server.
async function sendFiles(postID) {

  const filesInput = document.getElementById("uploadBtn");
      
  if (filesInput.files.length > 0) {

    const formData = new FormData();
    formData.append("postID", postID);
    formData.append("submitType", "post");

    for (let i =0; i < filesInput.files.length; i++) {
        formData.append("images", filesInput.files[i]);
    }

    await fetch("/upload-images", {
      method: 'POST',
      body: formData
    });
  }
}

//Adds click events and tiny-editor support when the document is ready.
ready(() => {
  document.getElementById("btn").addEventListener("click", function (e) {
    //Remove red border on all input boxes generated by previous input validation
    let inputBoxes = document.querySelectorAll("input[type=text], select");
    inputBoxes.forEach((e)=>{
      e.removeAttribute("style","border: 3px solid #DB3A34");
    })
    tinymce.get("mytextarea").getContentAreaContainer().removeAttribute("style","border: 3px solid #DB3A34");
    //Store user inputs into variables
    let unitData = document.getElementById("unitInput").value;
    let streetNumData = document.getElementById("streetNumInput").value;
    let prefixData = document.getElementById("prefixInput").value;
    let streetNameData = document.getElementById("streetNameInput").value;
    let streetTypeData = document.getElementById("streetTypeInput").value;
    let cityData = document.getElementById("cityInput").value;
    let provinceData = document.getElementById("provinceInput").value;
    let reviewData = tinymce.get("mytextarea").getContent();
    if (streetNumData && streetNameData && cityData && provinceData && reviewData) {
      createPost({
        "unit_number": unitData,
        "street_number": streetNumData,
        "prefix": prefixData,
        "street_name": streetNameData,
        "street_type": streetTypeData,
        "city": cityData,
        "province": provinceData,
        "review": reviewData
      });
    } else {
      e.preventDefault();
      //Save user inputs and input box ids into two arrays to use in the for-loop
      let formData = [streetNumData, streetNameData, cityData, provinceData, reviewData];
      let inputBoxId = ["streetNumInput", "streetNameInput", "cityInput", "provinceInput", "mytextarea"];
      //use a for loop to hightlight all mandatory fields that have no data with red border
      for (let i = 0; i <= 4; i++) {
        if (formData[i] === null || formData[i].trim() === "") {
          if (i != 4) {
            document.getElementById(inputBoxId[i]).setAttribute("style", "border: 3px solid #DB3A34");
          } else {
            tinymce.get("mytextarea").getContentAreaContainer().setAttribute("style", "border: 3px solid #DB3A34");
          }
        };
        document.getElementById("msg").innerText = "Please fill in all required fields."
      }
    }
  })
})

//Executes callback when the document is loaded.
function ready(callback) {
  if (document.readyState != "loading") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}