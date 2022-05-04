'sue strict';
var app = require('express')();
var mysql = require('mysql');
var { body, validationResult } = require('express-validator');

var port = process.env.PORT || 8005;
var responseStr = "MySQL Data";

app.get('/',function(req,res){

    var mysqlHost = process.env.MYSQL_HOST || '127.0.0.1';
    var mysqlPort = process.env.MYSQL_PORT || '3306';
    var mysqlUser = process.env.MYSQL_USER || 'lore';
    var mysqlPass = process.env.MYSQL_PASS || 'lore';
    var mysqlDB = process.env.MYSQL_DB || 'db';
    
    var connectionOptions = {
        host: mysqlHost,
        port: mysqlPort,
        user: mysqlUser,
        password: mysqlPass,
        database: mysqlDB
    };
    console.log('MySQL connection config:');
    console.log(connectionOptions);

    var connection = mysql.connect(connectionOptions);
    connection.connect();
    /*
    *connection.query(qua scrivi la query){
        if(error)throw error;

       ? responseStr = '';
        results.forEach(function(data){
            .....
        });
       * if(responseStr.lenght == 0) response = "no records found";
        console.log(responseStr);

        res.status(200).send(responseùStr)
    };
    */
    connection.end();
});