
-- Group 27 Initial Database. Desmond Virasak-Holmes and Mark Daniloff
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

CREATE OR REPLACE TABLE Customers (
    customer_id int NOT NULL AUTO_INCREMENT,
    customer_name varchar(255) NOT NULL,
    customer_email varchar(255) NOT NULL,
    phone_number varchar(20) NOT NULL,
    address varchar(255) NOT NULL,
    PRIMARY KEY (customer_id)
);

CREATE OR REPLACE TABLE Employees (
    employee_id int NOT NULL AUTO_INCREMENT,
    employee_name varchar(255) NOT NULL,
    employee_email varchar(255) NOT NULL,
    employee_phone varchar(255) NOT NULL,
    salary decimal(18,2) NOT NULL,
    PRIMARY KEY (employee_id)
);

CREATE OR REPLACE TABLE Products (
    product_id int NOT NULL AUTO_INCREMENT,
    product_name varchar(255) NOT NULL,
    price decimal(18,2) NOT NULL,
    main_ingredient varchar(255) NOT NULL,
    PRIMARY KEY(product_id)
);


CREATE OR REPLACE TABLE Fungi (
    fungus_id int NOT NULL AUTO_INCREMENT,
    fungus_name varchar(255) NOT NULL,
    PRIMARY KEY (fungus_id)

);

CREATE OR REPLACE TABLE Orders (
    order_id int NOT NULL AUTO_INCREMENT,
    order_date date NOT NULL,
    total_cost decimal(18,2) NOT NULL,
    employee_id int,
    customer_id int NOT NULL,
    PRIMARY KEY (order_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id) ON DELETE SET NULL,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE
);

CREATE OR REPLACE TABLE Ordered_Products (
    ordered_product_id int NOT NULL AUTO_INCREMENT,
    product_id int NOT NULL,
    order_id int NOT NULL,
    quantity int,
    cost decimal(18,2),
    PRIMARY KEY (ordered_product_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE
);

CREATE OR REPLACE TABLE Fungus_Products (
    fungus_product_id int NOT NULL AUTO_INCREMENT,
    product_id int NOT NULL,
    fungus_id int NOT NULL,
    PRIMARY KEY (fungus_product_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE, 
    FOREIGN KEY (fungus_id) REFERENCES Fungi(fungus_id) ON DELETE CASCADE
);

INSERT INTO Customers (customer_name, customer_email, phone_number, address)
VALUES ('John Smith', 'jsmith@gmail.com', '503 442 5666', '1375 NW Farm Way, Tangent OR 17854'),
('Robert Jones', 'rj22@gmail.com', '315 678 7654', '2222 SW 4th Street, Jacksonville FL 86621'),
('Timothy Cooper', 'timc84@yahoo.com', '987 123 1543', '1234 Alsea Road, Philomath OR 99981');

INSERT INTO Employees (employee_name, employee_email, employee_phone, salary)
VALUES ('Karolina Martins', 'kcmartins@gmail.com', '823 321 1235', 45000.25),
('Jimmy McGill', 'jmm23@yahoo.com', '989 123 5555', 100000.00),
('Deborah Williams', 'dbw2@gmail.com', '888 811 4241', 14000.73);

INSERT INTO Products (product_name, price, main_ingredient)
VALUES ('Redtail', 500.35, 'Sulfur'),
('Hyper Galaxy', 200.73, 'Bromine'),
('Microdigest',780.11, 'Cobalt');

INSERT INTO Fungi (fungus_name)
VALUES ('Auricularia cornea'),
('Boletus'),
('Agaricus augustus');

INSERT INTO Orders (order_date, total_cost, employee_id, customer_id)
VALUES ('2022-08-09', 800.23, (SELECT employee_id FROM Employees WHERE employee_id = '2'), (SELECT customer_id FROM Customers WHERE customer_id = '1')),
('2022-08-23', 2230.54, (SELECT employee_id FROM Employees WHERE employee_id = '2'), (SELECT customer_id FROM Customers WHERE customer_id = '2')),
('2022-09-24', 50000.23, (SELECT employee_id FROM Employees WHERE employee_id = '3'), (SELECT customer_id FROM Customers WHERE customer_id = '3'));

INSERT INTO Ordered_Products(product_id, order_id, quantity, cost)
VALUES ((SELECT product_id FROM Products WHERE product_id = '1'), (SELECT order_id FROM Orders WHERE order_id = '3'), 5, 500.35),
((SELECT product_id FROM Products WHERE product_id = '2'), (SELECT order_id FROM Orders WHERE order_id = '3'), 14, 15000.78),
((SELECT product_id FROM Products WHERE product_id = '3'), (SELECT order_id FROM Orders WHERE order_id = '1'), 67, 50000.34);

INSERT INTO Fungus_Products(product_id, fungus_id)
VALUES ((SELECT product_id FROM Products WHERE product_id = '1'), (SELECT fungus_id FROM Fungi WHERE fungus_id = '1')),
((SELECT product_id FROM Products WHERE product_id = '2'), (SELECT fungus_id FROM Fungi WHERE fungus_id = '2')),
((SELECT product_id FROM Products WHERE product_id = '3'), (SELECT fungus_id FROM Fungi WHERE fungus_id = '3'));


SELECT * from Customers;
SELECT * from Employees;
SELECT * from Products;
SELECT * from Orders;
SELECT * from Ordered_Products;
SELECT * from Fungi;
SELECT * from Fungus_Products;

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
