// Get the objects we need to modify
let addProductForm = document.getElementById('addProduct');

// Modify the objects we need
addProductForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("inputName");
    let inputPrice = document.getElementById("inputPrice");
    let inputMI = document.getElementById("mainIng");


    // Get the values from the form fields
    let nameValue = inputName.value;
    let priceValue = inputPrice.value;
    let MIValue = inputMI.value;

    // Put our data we want to send in a javascript object
    let data = {
	product_name: nameValue,
	price: priceValue,
	main_ingredient: MIValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-product-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Clear the input fields for another transaction
            inputName.value = '';
            inputPrice.value = '';
            inputMI.value = '';
	    location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})
