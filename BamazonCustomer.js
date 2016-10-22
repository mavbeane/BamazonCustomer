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

connection.query('SELECT * FROM Products', function(err, results) {

	if(err) {
		console.log(err);
	} else {
		console.log('------------------------------------------------------');
		console.log(' | ID  /  Product Name   /  Product Name  /  Price  | ');

		for (var i=0; i < results.length; i++) {

			console.log(' | ' + results[i].ItemID + ' / ' + results[i].ProductName + ' / ' + results[i].DepartmentName + ' / ' + results[i].Price + ' | ');

		};
		console.log('------------------------------------------------------');

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
			}, function (err, result) {
		 
			    console.log('Command-line input received:');
			    console.log('  Product ID: ' + result.productID);
			    console.log('  Units Wanted: ' + result.units);

			    connection.query('SELECT * FROM Products WHERE ?', {ItemID: result.productID}, function(err, results) {

				if(err) {
					console.log(err);
				} else {
					//console.log('lllll' + result.productID);
				};



			  });
			});

	};

	connection.end();
});

