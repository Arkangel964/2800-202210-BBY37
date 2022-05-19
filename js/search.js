"use strict";
async function searchQuery(data) {
  try {
    let responseObject = await fetch("/search", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedJSON = await responseObject.json();

    if (parsedJSON.status === "success") {
      window.location.replace("/results");
    } else {
      console.log(parsedJSON.msg);
    }

  } catch (error) {
    console.log("An error occurred: " + error);
  }
}

ready(document.getElementById("btn").addEventListener("click", function(e) {
  e.preventDefault();
  let unit = document.getElementById("unitVal").value;
  let streetNum = document.getElementById("streetNumVal").value;
  let streetName = document.getElementById("streetNameVal").value;
  let city = document.getElementById("cityVal").value;

  if (unit === "") {
    unit = "%";
  }
  if (streetNum === "") {
    streetNum = "%";
  }
  if (streetName === "") {
    streetName = "%";
  }
  if (city === "") {
    city = "%";
  }

  searchQuery({
    "unit": unit,
    "streetNum": streetNum,
    "prefix": document.getElementById("prefixInput").value,
    "streetName": streetName,
    "streetType":document.getElementById("streetTypeInput").value,
    "city": city,
    "province":document.getElementById("provinceInput").value
  });
}))

function ready(callback) {
  if (document.readyState != "loading") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}