/* 
Citation for delete_employee.js
Date: 12/05/2022 
Adapted from Node JS Starter App
https://github.com/osu-cs340-ecampus/nodejs-starter-app 
*/

function deleteEmployee(empID) {
    // Put our data we want to send in a javascript object
    let data = {
        employee_id: empID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-employee-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(empID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(empID){

    let table = document.getElementById("employees_table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       // Iterate through rows
       // Rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == empID) {
            table.deleteRow(i);
            break;
       }
    }
}
