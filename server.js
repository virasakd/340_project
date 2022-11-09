// server.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 60231;                 // Set a port number at the top so it's easy to change in the future


// setup section for inserting data
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// import the database connector file.
var db = require('./database/db-connector');

const { engine } = require('express-handlebars');
 
app.set('view engine', 'handlebars');  
app.engine('handlebars', engine({defaultLayout:'main'}));  // Create an instance of the handlebars engine to process templates




/*
    ROUTES
*/

// load in the static css and other files in public
app.use(express.static('public'))
/*
    ROUTES
*/
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


// route for the  orders page.
app.get('/orders', async function(req, res)
{
    // this first query will fill in the table.
    let query1 = 'SELECT order_id,order_date, total_cost, Orders.employee_id, Employees.employee_name, Orders.customer_id, Customers.customer_name From Orders INNER JOIN Employees ON Orders.employee_id = Employees.employee_id INNER JOIN Customers ON Orders.customer_id = Customers.customer_id;'
    
    // the second query will popluate the employee drop downs.
    let query2  = 'SELECT employee_id,employee_name from Employees;' 

    // the third query, will populate the customer drop down.
    let query3 = 'SELECT customer_id,customer_name from Customers;'

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        let orders_table = rows;
       
        db.pool.query(query2, function(error, rows, fields){

            let employee_dropdown = rows;

            db.pool.query(query3, function(error, rows, fields){
                // stoe the customers drop down.
                let customer_dropdown = rows

                // render the orders page once everything has be retrieved from the database
                res.render('orders',{data: orders_table, empInfo: employee_dropdown, custInfo: customer_dropdown});
            })

        })

    });
   
});

app.post('/add-order-ajax', function(req,res){

    let data = req.body;
    // grap the total cost.
    let tot_cost_var = data.total_cost;


    // check and see if user entered in a proper cost value
    if (isNaN(tot_cost_var)){
        tot_cost_var = 0;
    }

    query1 = `INSERT INTO Orders (order_date,total_cost, employee_id, customer_id) VALUES ('${data.date}', '${data.total_cost}','${data.employee_id}','${data.customer_id}')`;


    db.pool.query(query1, function(error, rows, fields){

        // check for an error
        if (error){


            // if there is an error, send a 404 error to the orders table.
            console.log(error)
            res.sendStatus(400);
        }
        else{

            // other wise, perform a redirect. However the location.reload, will refresh the page and show the updates.
            res.redirect('/');
        }

    })
});



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