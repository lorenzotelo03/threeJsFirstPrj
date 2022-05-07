'use strict';
var express = require('express');
const app = express();
const path = require('path');
var mysql = require('mysql');
const router = express.Router();

// const bodyParser = require('body-parser');
// const cors = require('cors');
var { body, validationResult } = require('express-validator');

var port = 8005;
var responseStr = "MySQL Data";
// app.use(cors());
var mysqlHost = process.env.MYSQL_HOST || '172.20.0.2';
var mysqlPort = process.env.MYSQL_PORT || '3306';
var mysqlUser = process.env.MYSQL_USER || 'root';
var mysqlPass = process.env.MYSQL_PASS || 'root';
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
var connection = mysql.createConnection(connectionOptions);
// app.get('/',function(req,res){
    
//     connection.connect();
//     /*
//     *connection.query(qua scrivi la query){
//         if(error)throw error;

//        ? responseStr = '';
//         results.forEach(function(data){
//             .....
//         });
//        * if(responseStr.lenght == 0) response = "no records found";
//         console.log(responseStr);

//         res.status(200).send(responseùStr)
//     };
//     */
//     connection.end();
//     res.status(200).send("request succeeded")
// });

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/Html/login.html'));
    //__dirname : It will resolve to your project folder.
});

router.get('/changePass',function(req,res){
  res.sendFile(path.join(__dirname+'/Html/changePass.html'));
});

router.get('/Registration',function(req,res){
  res.sendFile(path.join(__dirname+'/Html/registration.html'));
});

app.post('/login',function(req,res){
    var User = req.body;
    console.log(User)
    // connection.connect();
    // connection.query("SELECT * FROM `Utenti` WHERE UserName= ? and uPassword =?"){ 
    //     if(error)throw error;
    // }
});

app.use(express.static(__dirname + '/Html'));
app.use('/', router);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});