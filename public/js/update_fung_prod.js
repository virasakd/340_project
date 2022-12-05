/* 
Citation for update_fung_prod.js
Date: 12/05/2022 
Adapted from Node JS Starter App
https://github.com/osu-cs340-ecampus/nodejs-starter-app 
*/

let updateFung_prodForm = document.getElementById('updateFungusProd');

updateFung_prodForm.addEventListener("submit", function (e) {


    // Prevent the form from submitting
    e.preventDefault();

    let inputfung_prodID = document.getElementById("updatefungusprodID");
    let inputfungusID = document.getElementById("updatefungusID");
    let inputproductID = document.getElementById("updateproductID");


    let id_Value = inputfung_prodID.value;
    let fungID_value = inputfungusID.value;
    let prodID_value = inputproductID.value;
    console.log(prodID_value,"milly rock", fungID_value, 'last', id_Value)

    let data = {

        upFung_prod_id : id_Value,
        upfungus_id: fungID_value,
        upProd_id : prodID_value

    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-fung-prod-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, id_Value);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});


function updateRow(data, fung_prodID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("fungus_products_table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       // Iterate through rows
       // Rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == fung_prodID) {

            // Get the location of the row where we found the matching order ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of order_date, total cost, employee id and customer id
            let td_fungid = updateRowIndex.getElementsByTagName("td")[1];
            let td_prodid = updateRowIndex.getElementsByTagName("td")[2];
            // console.log(td_fungid," new", td_prodid)

            // Reassign order date to our value we updated to
            td_fungid.innerHTML = parsedData[0].upfungus_id; 
	        td_prodid.innerHTML = parsedData[0].upProd_id;
	   
	   // Reload the page
            location.reload();
        }
    }
}
