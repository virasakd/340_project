/* 
Citation for orders.js
Date: 12/05/2022 
Adapted from Node JS Starter App
https://github.com/osu-cs340-ecampus/nodejs-starter-app 
*/

let addorderForm = document.getElementById('addOrder');

addorderForm.addEventListener("submit",function(e){

    // Prevent the user from submitting an invalid form
    e.preventDefault();

    // Retrieve the object/tags from the input fields
    let inputDate = document.getElementById("date_input");
    let inputTotalCost = document.getElementById("cost_input");
    let inputEmployee = document.getElementById("empID");
    let inputCustomer = document.getElementById("custID")


    // Gather the data from the input objects.
    let inputDateValue = inputDate.value;
    let inputTotalcostValue = inputTotalCost.value;
    let inputEmpValue = inputEmployee.value;
    let inputCustValue = inputCustomer.value;

    // Establish a javascript object.
    let data = {

        date: inputDateValue,
        total_cost: inputTotalcostValue,
        employee_id: inputEmpValue,
        customer_id: inputCustValue

    }

    // Add ajax rquest
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Clear the input fields for another transaction
            inputDate.value = '';
            inputTotalCost.value = '';
            inputEmployee.value = '';
            inputCustomer.value = '';
            location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});
