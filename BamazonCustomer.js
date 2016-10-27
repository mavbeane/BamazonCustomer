var mysql = require('mysql');
var prompt = require('prompt');
var pw = require('./pw.js');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: pw.pw.databasePW,
	database: 'Bamazon'
});

connection.connect(function(err) {
	if (err) throw err;
	console.log('connected as id ' + connection.threadId);
});

function buy() {
	connection.query('SELECT * FROM Products', function(err, results) {

		if(err) {
			console.log(err);
		} else {
			console.log('------------------------------------------------------');
			console.log('ID\tDEPARTMENT\tPRODUCT\t\tPRICE ');
			for (var i=0; i < results.length; i++) {
				console.log(+ results[i].ItemID + '\t' + results[i].DepartmentName + '\t\t' + results[i].ProductName + '\t$' + results[i].Price.toFixed(2));
			};
			console.log('------------------------------------------------------');	
		};

		prompt.start();

		prompt.get({
			properties: {
				productID: {
					description: ('What is the ID of the product you would you like to buy')
				},
				units: {
					description: ('How many units would you like to buy')
				}
			}
			}, function (err, res) {
			   	
			   	connection.query('SELECT * FROM Products WHERE ?', {ItemID: res.productID}, function(err, prodResults) {
				   	
					if (err) {
						console.log(err);
					};

					if (prodResults[0].StockQuantity < res.units) {
						console.log('------------------------------------------------------');
						console.log('------------------------------------------------------');
						console.log('INSUFFICIENT QUANTITY! Please try another product.');
						console.log('------------------------------------------------------');
						buy();
					} else {
						connection.query('UPDATE Products SET ? WHERE ?', [{
							StockQuantity: prodResults[0].StockQuantity - res.units
						}, {
							ItemID: res.productID
						}], function(err, results) {
							console.log('------------------------------------------------------');
						});
						console.log('Thank you for your purchase! \nProduct purchased: ' + prodResults[0].ProductName + '\nUnits purchased: ' + res.units);
						var totalCharged = prodResults[0].Price * res.units
						console.log('Total charged: $' + totalCharged.toFixed(2));
					};

			  	});
			});
	});
};
buy();
