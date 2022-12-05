/* 
Citation for add_fungus.js
Date: 12/05/2022 
Adapted from Node JS Starter App
https://github.com/osu-cs340-ecampus/nodejs-starter-app 
*/

// Get the objects we need to modify
let addFungusForm = document.getElementById('addFungus');

// Modify the objects we need
addFungusForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("addFungusName");

    // Get the values from the form fields
    let nameValue = inputName.value;

    // Put our data we want to send in a javascript object
    let data = {
	fungus_name: nameValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-fungus-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Clear the input fields for another transaction
            inputName.value = '';
	    location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})
