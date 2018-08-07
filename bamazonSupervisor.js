const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazonDB"
})

connection.connect(err => {
    if (err) throw err;
    supervisorStart();
})

let supervisorStart = () => {
    inquirer.prompt([
        {
            message: "What process would you like to run?",
            name: "processSelection",
            type: "list",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"]
        }
    ]).then(answer => {
        switch (answer.processSelection) {
            case "View Product Sales by Department":
                viewSales();
                break;
            case "Create New Department":
                createDept();
                break;
            case "Exit":
                connection.end();
                break;
        }
    })
}

let viewSales = () => {

    connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(IFNULL(products.product_sales, 0)) AS product_sales FROM products RIGHT JOIN departments ON products.department_name=departments.department_name GROUP BY departments.department_name", (err, rows) => {
        if (err) throw err;

        let table = new Table({
            head: ["department_id", "department_name", "over_head_costs", "product_sales", "total_profit"],
            colWidths: [20, 20, 20, 20, 20]
        })

        rows.forEach(row => {
            let totalProfit = row.product_sales - row.over_head_costs;
            table.push([row.department_id, row.department_name, row.over_head_costs, row.product_sales, totalProfit])
        })
        
        console.log("\n" + table.toString());

        supervisorStart();
    })
}

let createDept = () => {
    inquirer.prompt([
        {
            message: "What department would you like to add?",
            name: "departmentName"
        },
        {
            message: "What are this department's overhead costs?",
            name: "overheadCosts"
        }
    ]).then(answers => {
        connection.query("INSERT INTO departments SET ?", 
            {
                department_name: answers.departmentName,
                over_head_costs: answers.overheadCosts
            },
            (err, res) => {
                if (err) throw err;
                console.log(`You have successfully added ${answers.departmentName} to the departments table!`);
                supervisorStart();
            }
        )
    })
}