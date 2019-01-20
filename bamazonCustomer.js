var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    PORT: 3307,
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
    connect.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        console.log("Welcome to Bamazon! Here are a list of items for purchase?");

        for(var i = 0; i < results.length; i++) {
            results.push(
            "Item ID: " + results[i].item_id+ "\n----------\n",
            "Product: " + results[i].product_name + "\n----------\n",
            "Department: " + results[i].department_name+ "\n----------\n",
            "Price: " + results[i].price)
        }
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
            "SELECT products WHERE ?", [answer.itemChoice], function(error, result) {
                if(error) throw err;
                
                if (parseInt(result.stock_quanity) >= parseInt(answer.itemCount)) {
                    "UPDATE products SET ? WHERE ?", (parseInt(result.stock_quanity) - parseInt(answer.itemCount));
                    // Show Price of order (resutls.price * answer.ItemCount)
                    console.log("Price: " + results.price);
                    

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

