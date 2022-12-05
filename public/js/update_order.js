/* 
Citation for update_order.js
Date: 12/05/2022 
Adapted from Node JS Starter App
https://github.com/osu-cs340-ecampus/nodejs-starter-app 
*/

// Get the objects we need to modify
let updateOrderForm = document.getElementById('updateOrder');

// Modify the objects we need
updateOrderForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputId = document.getElementById("updateOrderID");
    let inputDate = document.getElementById("updateOrderDate");
    let inputCost = document.getElementById("updateOrderCost");
    let inputEmp = document.getElementById("updateEmpID");
    let inputCust = document.getElementById("updateCustID");
    

    // Get the values from the form fields
    let IdValue = inputId.value;
    let DateValue = inputDate.value;
    let CostValue = inputCost.value;
    let EmpValue = inputEmp.value;
    let CustValue = inputCust.value;
    
   // If employee value is not a number make it null
   if (isNaN(EmpValue)) 
    {
        EmpValue = null
    }


    // Put our data we want to send in a javascript object
    let data = {
	order_id: IdValue,
	order_date: DateValue,
	total_cost: CostValue,
	employee_id: EmpValue,
	customer_id: CustValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, IdValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, orderID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("orders_table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       // Iterate through rows
       // Rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == orderID) {

            // Get the location of the row where we found the matching order ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of order_date, total cost, employee id and customer id
            let td_date = updateRowIndex.getElementsByTagName("td")[1];
	    let td_cost = updateRowIndex.getElementsByTagName("td")[2];
	    let td_emp =  updateRowIndex.getElementsByTagName("td")[3];
	    let td_cust =  updateRowIndex.getElementsByTagName("td")[5];

            // Reassign order date to our value we updated to
            td_date.innerHTML = parsedData[0].order_date; 
	    td_cost.innerHTML = parsedData[0].total_cost;
            td_emp.innerHTML = parsedData[0].employee_id;
            td_cust.innerHTML = parsedData[0].customer_id;

	   // Reload the apge
	   location.reload();

       }
    }
}
