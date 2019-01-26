var mysql = require("mysql");
var inquirer = require("inquirer");
var express = require("express");
var app = express();

var PORT = process.env.PORT || 8080;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if(err) throw err;
    start();
});

// going through the database to show items
function start() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        console.log("Welcome to Bamazon! Here are a list of items for purchase?");

        var tableArray = [];

        for(var i = 0; i < results.length; i++) {
            tableArray.push(
            "Item ID: " + results[i].item_id,
            "Product: " + results[i].product_name,
            "Department: " + results[i].department_name,
            "Price: " + results[i].price)
        }
        console.log(tableArray);
        
    });

    // Prompt the user to start by display two prompts: asking which ID & quantity
    inquirer.prompt([
        {
            name: "itemChoice",
            type: "input",
            message: "Please enter the ID number of the item you'd like to purchase",
            validate: function(number) {
                if(isNaN(number) === false && parseInt(number) > 0 && parseInt(number) <= 10) {
                    return true;
                }
                    return false;
            }
        },
        {
            name: "itemCount",
            type: "input",
            message: "How many would you like?",
            validate: function(number) {
                if(isNaN(number) === false && parseInt(number) > 0) {
                    return true;
                }
                    return false;
            }            
        }
    ])
    .then(function(answer) {
    
    // check and see if you have enough items
        connection.query(
            "SELECT product_name, stock_quantity, price FROM products WHERE item_id = ?", [parseInt(answer.itemChoice)], function(error, result) {
                if(error) throw error;
                console.log(result[0].stock_quantity);
                
                if (parseInt(result[0].stock_quantity) >= parseInt(answer.itemCount)) {
                    // Show Price of order
                    console.log("Your total is: $" + result[0].price * answer.itemCount);
                    // update the datebase (Subtract itemCount) new function with new db query
                    "UPDATE products SET stock_quantity = ? WHERE item_id = ?";

                    continueShopping();


                } else {
                    console.log("Not Enough In Stock");
                    continueShopping();

                }
                
            }
        );
        
        

    });

    function continueShopping() {
        inquirer.prompt([
            {
                name: "continue",
                type:"input",
                message: "would you like to continue shopping? (y/n)",
            }
        ]).then(function(shopping) {
            if(shopping = "y") {
                console.log("\n");
                start();
            }else {
                console.log("Thank you for shopping with us!");
                connection.end();
            }
        });
    };
}

app.listen(PORT, function() {
    console.log("Port working: " + PORT); 
});

