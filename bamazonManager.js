const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazonDB"
})

connection.connect(err => {
    if (err) throw err;
    managerStart();
})

let managerStart = () => {
    inquirer.prompt([
        {
            message: "What process would you like to run?",
            name: "processSelection",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add Stock", "Add New Product", "Exit"]
        }
    ]).then(answer => {
        switch (answer.processSelection) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInv();
                break;
            case "Add Stock":
                restockChooseItem();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Exit":
                connection.end();
                break; 
        }
    })
}

function viewProducts() {
    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;
        res.forEach(product => {
            console.log(`ID: ${product.item_id} || NAME: ${product.product_name} || PRICE: ${product.price} || QUANTITY: ${product.stock_quantity}`)  
        })
        managerStart();
    })
}

function viewLowInv() {
    connection.query("SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 6", (err, res) => {
        if (err) throw err;
        res.forEach(product => {
            console.log(`ID: ${product.item_id} || NAME: ${product.product_name} || QUANTITY: ${product.stock_quantity}`)  
        })

        let choices = []; 
        res.forEach(product => {
            choices.push(product.item_id + " || " + product.product_name + " || " + product.stock_quantity);
        })

        inquirer.prompt([
            {
                message: "Would you like to add stock to any of these products?",
                name: "toAddStock",
                type: "confirm",
            }
        ]).then(answer => {
            switch (answer.toAddStock) {
                case true:
                    inquirer.prompt([
                        {
                            message: "Which item would you like to restock?",
                            name: "restockItem",
                            type: "list",
                            choices: choices
                        }
                    ]).then(answer => {
                        let ansArr = answer.restockItem.split(" || ");
                        addStock(ansArr[0], ansArr[1], ansArr[2]); 
                    })
                    break;
                case false:
                    managerStart();
                    break;
            }
        })
    })
}

function restockChooseItem() {
    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;

        let choices = []; 
        res.forEach(product => {
            choices.push(product.item_id + " || " + product.product_name + " || " + product.stock_quantity);
        })

        inquirer.prompt([
            {
                message: "Please choose a product to update.",
                name: "productToUpdate",
                type: "list",
                choices: choices
            }
        ]).then(answer => {
            console.log(answer);
            let ansArr = answer.productToUpdate.split(" || ");
            addStock(ansArr[0], ansArr[1], ansArr[2]); 
        })
    })
}

function addStock(itemID, itemName, currentUnits) {
    console.log(itemID, currentUnits);
    inquirer.prompt([
        {
            message: "How many units would you like to add to this item's inventory?",
            name: "unitsToAdd"
        }
    ]).then(answer => {
        let units = parseInt(answer.unitsToAdd);
        newQuantity = parseInt(currentUnits) + units;
        connection.query("UPDATE products SET ? WHERE ?", 
            [
                {stock_quantity: newQuantity},
                {item_id: itemID}
            ],
            (err, res) => {
                if (err) throw err;
                console.log(`You have added ${units} units to ${itemName}. There are now ${newQuantity} units of ${itemName}.`);
                managerStart();

            }
        )
    })
}

function addProduct() {
    inquirer.prompt([
        {
            message: "What item would you like to add?",
            name: "itemName"
        },
        {
            message: "What department does this item belong to?",
            name: "itemDepartment"
        },
        {
            message: "What is this item's price?",
            name: "itemPrice"
        },
        {
            message: "What is the initial stock quantity of this item?",
            name: "stockQuantity"
        }
    ]).then(answers => {
        connection.query("INSERT INTO products SET ?", 
            {
                product_name: answers.itemName,
                department_name: answers.itemDepartment,
                price: answers.itemPrice,
                stock_quantity: answers.stockQuantity
            },
            (err, res) => {
                if (err) throw err;
                console.log(`You have successfully added ${answers.itemName} to the products table!`);
                managerStart();
            }
        )
    })
}