

let addorderForm = document.getElementById('addOrder');

addorderForm.addEventListener("submit",function(e){

    // prevent the user from submitting an invalid form

    console.log("desmond is here");

    e.preventDefault();

    // retrieve the object/tags, the from the input fields
    let inputDate = document.getElementById("date_input");
    let inputTotalCost = document.getElementById("cost_input");
    let inputEmployee = document.getElementById("empID");
    let inputCustomer = document.getElementById("custID")


    // gather the data from the input objects.
    let inputDateValue = inputDate.value;
    let inputTotalcostValue = inputTotalCost.value;
    let inputEmpValue = inputEmployee.value;
    let inputCustValue = inputCustomer.value;

    // establish a javascript object.
    let data = {

        date: inputDateValue,
        total_cost: inputTotalcostValue,
        employee_id: inputEmpValue,
        customer_id: inputCustValue

    }

    // ad ajax rquest
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            // addRowToTable(xhttp.response);


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


// addRowToTable = (data) => {

//     let currentTable = document.getElementById("orders_table")

//     let newRowIndex = currentTable.rows.length;

//     let parsedData = JSON.parse(data);
//     let newRow = parsedData[parsedData.length -1]

//     let row = document.createElement("TR");
//     let idCell = document.createElement("TD"); 
//     let dateCell = document.createElement("TD");
//     let totCostCell = document.createElement("TD");
//     let EmpIdCell = document.createElement("TD");
//     let EmpNameCell = document.createElement("TD");
//     let CustIdCell = document.createElement("TD");
//     let CustNameCell = document.createElement("TD");

//     idCell.innerText = newRow.order_id;
//     dateCell.innerText = newRow.order_date;
//     totCostCell.innerText = newRow.total_cost;
//     EmpIdCell.innerText = newRow.employee_id;
//     EmpNameCell.innerText = newRow.employee_name;
//     CustIdCell.innerText = newRow.customer_id;
//     CustNameCell.innerText = newRow.customer_name;

//     row.appendChild(idCell);
//     row.appendChild(dateCell);
//     row.appendChild(totCostCell);
//     row.appendChild(EmpIdCell);
//     row.appendChild(EmpNameCell);
//     row.appendChild(CustIdCell);
//     row.appendChild(CustNameCell);

//     currentTable.appendChild(row);

// }
