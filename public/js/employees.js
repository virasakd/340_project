let addorderForm = document.getElementById('addEmployee');

addorderForm.addEventListener("submit",function(e){

    // prevent the user from submitting an invalid form

    e.preventDefault();

    // retrieve the object/tags from the input fields
    let inputEmp_name = document.getElementById("emp_name");
    let inputEmp_email = document.getElementById("emp_email");
    let inputEmp_phone = document.getElementById("emp_phone");
    let inputEmp_Salary = document.getElementById("emp_salary");


    // gather the data from the input objects.
    let name_employee = inputEmp_name.value;
    let email_employee = inputEmp_email.value;
    let phone_employee = inputEmp_phone.value;
    let salary_employee = inputEmp_Salary.value;
    // establish a javascript object.
    let data = {
        employee_name: name_employee,
        employee_email: email_employee,
        employee_phone: phone_employee,
        salary: salary_employee

    }

    // add ajax rquest
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-employees-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            // addRowToTable(xhttp.response);


            // Clear the input fields for another transaction
            
            inputEmp_name.value = '';
            inputEmp_email.value = '';
            inputEmp_phone.value = '';
            inputEmp_Salary.value = '';
            location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));


});
