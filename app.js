/*
    SETUP
*/
var express = require('express');   
var app     = express();           
PORT        = 60322;                 

// import the database connector file.
var db = require('./database/db-connector');

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars') 
app.engine('.handlebars', engine ({
    extname: ".handlebars"
}));
app.set('view engine', 'handlebars');  
app.engine('handlebars', engine({defaultLayout:'main'}));  // Create an instance of the handlebars engine to process templates

// setup section for inserting data
app.use(express.json())
app.use(express.urlencoded({extended: true}))


/*
    ROUTES
*/

// load in the static css and other files in public
app.use(express.static('public'))


// routes for the home page
app.get(['/','/index'], function(req, res)
    {
        res.render('index');
    });

// route for customers
app.get('/customers', function(req, res)
{
    // instantiate a select query for the customers page.
    let query1 = `SELECT * FROM Customers;`;

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('customers', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                    

    
});

app.post('/add-customer-ajax', function(req,res){

    let data = req.body

    let name = data.customer_name;
    let email = data.customer_email;
    let phone_num = data.phone_number;
    let address = data.address;

    // store each of the data fields from the submission forms.
    let value_list = [name,email,phone_num,address]
  

    // if any of the submission field are missing, skip the request.
    if (value_list.includes("") == false){

        query1 = `INSERT INTO Customers (customer_name, customer_email, phone_number, address) VALUES ('${data.customer_name}', '${data.customer_email}', '${data.phone_number}','${data.address}')`;

        db.pool.query(query1, function(error, rows, fields) {
    
            // check for an error
            if (error) {
                // if there is an error, send a 404 error to the customer table.
                console.log(error)
                res.sendStatus(400);
            }
            else {
                // otherwise, perform a redirect. However the location.reload, will refresh the page and show the updates.
                res.redirect('/');
            }
    
        })
    }
    else{
        // console.log("submission has not been added, all thie fields must be entered.");
    }
    

});


// route for the employees page.
app.get('/employees', function(req, res)
{
       // ues a select query to populate the data table.
    let query1 = `SELECT * FROM Employees;`

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('employees', {data: rows});                  
    })

});

// route for adding employess to the employee's database.
app.post('/add-employees-ajax', function(req, res){

    let data = req.body;

    let name_em = data.employee_name
    let email_em = data.employee_email
    let phone_number = data.employee_phone

    let salary_em = data.salary;

    // convert an undefineded salary to zero.
    if (isNaN(salary_em)){
        salary_em = 0;
    }

    let list_input = [name_em, email_em, phone_number];

    if(list_input.includes("") == false) {

        query1 = `INSERT INTO Employees(employee_name, employee_email, employee_phone, salary) VALUES ('${name_em}','${email_em}','${phone_number}','${salary_em}')`;

        db.pool.query(query1, function(error, rows, fields) {
    
            // check for an error
            if (error) {
                // if there is an error, send a 404 error to the employee table.
                console.log(error)
                res.sendStatus(400);
            }
            else {
                // otherwise, perform a redirect. However the location.reload will refresh the page and show the updates.
                res.send(rows);
            }
    
        })
    }
    else{
        // console.log("employee insert was not completely filled out.");
    }
});


//Route to delete employee
app.delete('/delete-employee-ajax/', function(req,res,next){
  let data = req.body;
  let empID = parseInt(data.employee_id);
  let deleteEmp = `DELETE FROM Employees WHERE employee_id = ?`;

  db.pool.query(deleteEmp, [empID], function(error, rows, fields) {
      if (error) {
	  console.log(error);
	  res.sendStatus(400);
      }
      else {
	  res.sendStatus(204);
      }
})});

// route for the fungi page.
app.get('/fungi', function(req, res)
{
    let query1 = "SELECT * FROM Fungi;";
    db.pool.query(query1, function(error, rows, fields) {
	res.render('fungi', {data:rows});
    })
});

//Route to add fungus
app.post('/add-fungus-ajax', function(req, res) {
    let data = req.body

    let name = data.fungus_name
    if (name !== "") {
	query1 = `INSERT INTO Fungi (fungus_name) VALUES ('${data.fungus_name}')`
	db.pool.query(query1, function(error, rows,fields) {
	    if (error) {
		console.log(error)
		res.sendStatus(400);
	    }
	    else {
		res.send(rows);
	    }
	})
    }
});


// route for the fungus_products page.
app.get('/fungus_products', function(req, res)
{
    let query1 = "SELECT Fungus_Products.fungus_product_id, Fungus_Products.fungus_id,Fungi.fungus_name, Fungus_Products.product_id,Products.product_name From Fungus_Products INNER JOIN Fungi ON Fungus_Products.fungus_id = Fungi.fungus_id INNER JOIN Products ON Fungus_Products.product_id = Products.product_id;";
    
    // select query for the products drop down table;

    let query2 = `SELECT product_id,product_name FROM Products;`;
    // select query for the fungus drop down.

    let query3 = 'SELECT fungus_id,fungus_name FROM Fungi;';

    // generate page table.
    db.pool.query(query1, function(error, rows, fields) {
        let fung_prod_table = rows;

        // create drop down query for products
        db.pool.query(query2, function(error, rows, fields) {
            let prod_drop = rows;

            // create dropdown query for fungi.
            db.pool.query(query3, function(error, rows, fields) {

                let fung_dropdown = rows;
                // render fungus_products page
                res.render('fungus_products', {data: fung_prod_table, fungDrop:fung_dropdown ,prodDrop: prod_drop});
            })
        })	
    })
});


// route for adding data to fungus_products page.
app.post('/add-fungus-products-ajax', function(req, res){

    // get query for the body;
    let data = req.body;

    let query1 = `INSERT INTO Fungus_Products(product_id,fungus_id) VALUES ('${data.productID}', '${data.fungusID}');`;
    db.pool.query(query1, function(error, rows, fields) {
        // check for an error
        if (error) {

            // if there is an error, send a 404 error to the fungus_products table.
            console.log(error)
            res.sendStatus(400);
        }
        else {

            // otherwise, perform a redirect. However, the location.reload will refresh the page and show the updates.
            res.redirect('/');
        }

    })
});

app.put('/put-fung-prod-ajax', function(req,res){

    let update_data = req.body

    let main_id = parseInt(update_data.upFung_prod_id)
    let fung_id = parseInt(update_data. upfungus_id)
    let prod_id = parseInt(update_data.upProd_id)

    let updateTable = `UPDATE Fungus_Products SET Fungus_Products.product_id = ?, Fungus_Products.fungus_id = ? WHERE Fungus_Products.fungus_product_id = ? `;
    let selectUpdate = `SELECT * FROM Fungus_Products WHERE Fungus_Products.fungus_product_id = ?`;

    db.pool.query(updateTable, [prod_id,fung_id, main_id], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else
        {
            // Run the second query
            db.pool.query(selectUpdate, [main_id], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
})

});


// route for the orders page.
app.get('/orders', function(req, res)
{
    let query1;

    // if there is no query string, perform a SELECT
    if (req.query.order_date === undefined) {
	query1 = 'SELECT order_id, order_date, total_cost, Orders.employee_id, Employees.employee_name, Orders.customer_id, Customers.customer_name From Orders LEFT JOIN Employees ON Orders.employee_id = Employees.employee_id LEFT JOIN Customers ON Orders.customer_id = Customers.customer_id;'
    }

    // if there is a query string, treat it as a search and return the desired results
    else {
	query1 = 'SELECT order_id, order_date, total_cost, Orders.employee_id, Employees.employee_name, Orders.customer_id, Customers.customer_name From Orders LEFT JOIN Employees ON Orders.employee_id = Employees.employee_id LEFT JOIN Customers ON Orders.customer_id = Customers.customer_id WHERE order_date LIKE "${req.query.order_date}%";'
    
    }
    
    // the second query will popluate the employee drop downs.
    let query2  = 'SELECT employee_id, employee_name from Employees;' 

    // the third query, will populate the customer drop down.
    let query3 = 'SELECT customer_id, customer_name from Customers;'

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        let orders_table = rows;
       
        db.pool.query(query2, function(error, rows, fields){

            let employee_dropdown = rows;

            db.pool.query(query3, function(error, rows, fields){
                // store the customers drop down.
                let customer_dropdown = rows

                // render the orders page once everything has been retrieved from the database
                res.render('orders',{data: orders_table, empInfo: employee_dropdown, custInfo: customer_dropdown});
            })

        })

    });
   
});

app.post('/add-order-ajax', function(req,res){
    let data = req.body;
    // grab the total cost.
    let tot_cost_var = data.total_cost;


    // check and see if user entered in a proper cost value
    if (isNaN(tot_cost_var)){
        tot_cost_var = 0;
    }

    query1 = `INSERT INTO Orders (order_date,total_cost, employee_id, customer_id) VALUES ('${data.date}', '${data.total_cost}','${data.employee_id}','${data.customer_id}')`;
    
    db.pool.query(query1, function(error, rows, fields) {

        // check for an error
        if (error) {


            // if there is an error, send a 404 error to the orders table.
            console.log(error)
            res.sendStatus(400);
        }
        else {

            // otherwise, perform a redirect. However, the location.reload will refresh the page and show the updates.
            res.redirect('/');
        }

    })
});

//Delete route for Orders
app.delete('/delete-order-ajax', function(req,res,next) {
  let data = req.body;
  let orderID = parseInt(data.order_id);

  let deleteOrderedProducts = `DELETE FROM Ordered_Products WHERE order_id = ?`;
  let deleteOrders= `DELETE FROM Orders WHERE order_id = ?`;


        // Run the 1st query
        db.pool.query(deleteOrderedProducts, [orderID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                // Run the second query
                db.pool.query(deleteOrders, [orderID], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
})});


//Update route for Orders
app.put('/put-order-ajax', function(req,res,next) {
  let data = req.body;

  let id = parseInt(data.order_id);
  let date = data.order_date;
  let cost = parseInt(data.total_cost);
  let empid = parseInt(data.employee_id);
  let custid = parseInt(data.customer_id);
  

 let queryUpdateWorld = `UPDATE Orders SET order_date = ?, total_cost = ?, employee_id = ?, customer_id = ? WHERE Orders.order_id = ?`;

let selectOrder = `SELECT * FROM Orders WHERE Orders.order_id = ?`

        // Run the 1st query
        db.pool.query(queryUpdateWorld, [date, cost, empid, custid, id], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectOrder, [id], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

// route for the products page.
app.get('/products', function(req, res)
{
    let query1 = "SELECT * FROM Products;";
    db.pool.query(query1, function(error, rows, fields) {
	res.render('products', {data:rows});
    })
});



// route for the ordered_products page.
app.get('/ordered_products', function(req, res)
{
    let query1 = "SELECT ordered_product_id, order_id, Ordered_Products.product_id, Products.product_name, quantity, cost FROM Ordered_Products INNER JOIN Products ON Ordered_Products.product_id = Products.product_id;";
    
    //Second query populates the product drop down
    let query2 = "SELECT product_id, product_name FROM Products;"

    //Third query populates the order drop down
    let query3 = "SELECT order_id FROM Orders;"

    //Run 1st query
    db.pool.query(query1, function(error, rows, fields) {
	let ordered_products_table = rows;

	db.pool.query(query2, function(error, rows, fields) {
	    let product_dropdown = rows;

	    db.pool.query(query3, function(error, rows, fields) {
		let order_dropdown = rows;

		res.render('ordered_products', {data: ordered_products_table, prodInfo: product_dropdown, orderInfo: order_dropdown });
	})
      })
   });
});

//Route to add ordered product
app.post('/add-ordered-product-ajax', function(req, res) {
    let data = req.body

    let cost = data.cost
    if (isNaN(cost)) {
	cost = 'NULL'
    }
    let quantity = data.quantity
    if (isNaN(quantity)) {
	quantity = 'NULL'
    }

    query1 = `INSERT INTO Ordered_Products (order_id, product_id, quantity, cost) VALUES ('${data.order_id}', '${data.product_id}', '${data.quantity}', '${data.cost}')`
    db.pool.query(query1, function(error, rows, fields) {
	if (error) {
	    console.log(error);
	    res.sendStatus(400);
	}
	else {
	    res.send(rows);
	}
    })
});
  
    


//Route to add products
app.post('/add-product-ajax', function(req, res) {
    let data = req.body;
    
    let name = data.product_name;
    let price = data.price;
    let mainIng = data.main_ingredient;

    let value_list = [name, price, mainIng];

    //Run the query if all forms are filled out
    if (value_list.includes("") == false) {
	query1 = `INSERT INTO Products (product_name, price, main_ingredient) VALUES ('${data.product_name}', '${data.price}', '${data.main_ingredient}')`;
	db.pool.query(query1, function(error, rows, fields) {
	    if (error) {
		console.log(error);
		res.sendStatus(400);
	    }
	    else  {
		res.send(rows);
	    }
	})
    }
    else {
	console.log("All fields must be filled out.");
    }
});

app.get('*', function(req, res)
{
    res.status(404).render('404');
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});


// path: http://flip2.engr.oregonstate.edu/60231
