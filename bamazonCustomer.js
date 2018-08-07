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
    customerStart();
})

let customerStart = () => {
    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;
        res.forEach(product => {
            console.log(product.item_id, product.product_name, product.price);
        })
        inquirer.prompt([
            {
                message: "Which product (by id) would you like to purchase?",
                name: "itemID"
            },
            {
                message: "How many units would you like to purchase?",
                name: "unitsWanted"
            }
        ]).then(answers => {
            connection.query("SELECT stock_quantity FROM products WHERE item_id=?", answers.itemID, (err, res) => {
                if (err) throw err;
                let newStock = res[0].stock_quantity - answers.unitsWanted;

                if (res[0].stock_quantity < answers.unitsWanted) {
                    console.log("Insufficient Quantity!");
                    exitFlow();
                } 
                else {
                    connection.query("UPDATE products SET ? WHERE ?", 
                        [
                            {stock_quantity: newStock}, 
                            {item_id: answers.itemID}
                        ], 
                        (err, res) => {
                            if (err) throw err;
                            console.log("Your purchase was succesful!");
                        }
                    )
                    connection.query("SELECT price, product_sales FROM products WHERE ?", {item_id: answers.itemID}, (err, res) => {
                        if (err) throw err;
                        let totalPrice = res[0].price * answers.unitsWanted;
                        console.log(`Your total is $${totalPrice}.`);
                        
                        connection.query("UPDATE products SET ? WHERE ?",
                            [
                                {product_sales: res[0].product_sales + totalPrice},
                                {item_id: answers.itemID}
                            ],
                        (err, res) => {
                            if (err) throw err;
                        })
                        
                        exitFlow();
                    })
                }
            })
        })
    })  
}

let exitFlow = () => {
    inquirer.prompt([
        {
            message: "Would you like to quit or make another purchase?",
            name: "exitDialogue",
            type: "list",
            choices: ["Make another purchase", "Exit"]
        }
    ]).then((answer) => {
        if (answer.exitDialogue === "Make another purchase") {
            customerStart();
        }
        else {
            connection.end();
        }
    })
}