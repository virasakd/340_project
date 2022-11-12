/*
    SETUP
*/
var express = require('express');   
var app     = express();           
PORT        = 50230;                 

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
    res.render('customers');
});

// route for the employees page.
app.get('/employees', function(req, res)
{
    res.render('employees');
});


// route for the fungi page.
app.get('/fungi', function(req, res)
{
    res.render('fungi');
});

// route for the fungus_products page.
app.get('/fungus_products', function(req, res)
{
    res.render('fungus_products');
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

            // otherwise, perform a redirect. However the location.reload, will refresh the page and show the updates.
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
    res.render('products');
});

// route for the ordered_products page.
app.get('/ordered_products', function(req, res)
{
    res.render('ordered_products');
});


app.get('/ordered_products', function(req, res)
{
    res.render('ordered_products');
});

app.get('/ordered_products', function(req, res)
{
    res.render('ordered_products');
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
