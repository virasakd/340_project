let addorderForm = document.getElementById('addCustomer');

addorderForm.addEventListener("submit",function(e){

    // prevent the user from submitting an invalid form

    e.preventDefault();

    // retrieve the object/tags from the input fields
    let inputCust_name = document.getElementById("cust_name");
    let inputCust_email = document.getElementById("cust_email");
    let inputCust_phone = document.getElementById("cust_phone");
    let inputCust_address = document.getElementById("cust_address")


    // gather the data from the input objects.
    let name_customer = inputCust_name.value;
    let email_customer = inputCust_email.value;
    let phone_customer = inputCust_phone.value;
    let address_customer = inputCust_address.value;

    // establish a javascript object.
    let data = {
        customer_name: name_customer,
        customer_email: email_customer,
        phone_number: phone_customer,
        address: address_customer

    }

    // add ajax rquest
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            // addRowToTable(xhttp.response);


            // Clear the input fields for another transaction
            
            inputCust_name.value = '';
            inputCust_email.value = '';
            inputCust_phone.value = '';
            inputCust_address.value = '';
            location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));


});
