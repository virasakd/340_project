// Get the objects we need to modify
let addOPForm = document.getElementById('addOrderedProd');

// Modify the objects we need
addOPForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrder = document.getElementById("orderID");
    let inputProd = document.getElementById("prodID");
    let inputQuan = document.getElementById("quantity");
    let inputCost = document.getElementById("cost");

    // Get the values from the form fields
    let orderValue = inputOrder.value;
    let prodValue = inputProd.value;
    let quanValue = inputQuan.value;
    let costValue = inputCost.value;

    // Put our data we want to send in a javascript object
    let data = {
        order_id: orderValue,
        product_id: prodValue,
        quantity: quanValue,
        cost: costValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-ordered-product-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Clear the input fields for another transaction
            inputOrder.value = '';
            inputProd.value = '';
            inputQuan.value = '';
            inputCost.value = '';
	    location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})
