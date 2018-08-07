CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (department_id)
);

ALTER TABLE products ADD COLUMN product_sales DECIMAL(10, 2) NULL;

SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(IFNULL(products.product_sales, 0)) 
FROM products RIGHT JOIN departments ON products.department_name=departments.department_name 
GROUP BY departments.department_name;