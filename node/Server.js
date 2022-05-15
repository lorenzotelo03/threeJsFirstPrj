'use strict';
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
var bodyParser = require('body-parser');
const mysql = require('mysql');
const fs = require('fs');
const bcrypt = require('bcrypt');//for hash algorithm
var nodemailer = require('nodemailer');//to send emails
const router = express.Router();

// var { body, validationResult } = require('express-validator');
// const { response } = require('express');
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

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
//crea una sessione
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '3dSpaceTeam@gmail.com',
      pass: '3dSpaceTeam'
    }
});
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


app.post('/auth',function(req,res){ //login function
  //Variables defined with let cannot be redeclared.
  let username = req.body.username;
  let password = req.body.password;
  connection.query("SELECT uPassword FROM `Utenti` WHERE UserName= ? LIMIT 1" , [username], function(err, result, fields){ 
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }else{
        var hashedpass=result[0].uPassword;
        //console.log(hashedpass);
        const isValid = bcrypt.compareSync(password, hashedpass);
        //console.log(isValid);
        if (username && isValid){  
        connection.query("SELECT * FROM `Utenti` WHERE UserName= ? and uPassword =?" , [username, hashedpass], function(error, results, fields){ 
            
            if (error) {
              console.log(error);
              res.sendStatus(500);
              return;
            }

            if(results.length > 0){
              req.session.loggedIn = true;
              req.session.username = username;
              res.sendStatus(200);
              // res.redirect('/home');
              res.send("you're in congrats");
            }else{
              res.send("something went wrong, incorrect USername and/or Password");
            }
          res.end();
        });
      }else{
        res.send("please enter Username and Password");
        res.end;
      }
      }
    });  
});

app.post('/regi',function(req,res){ //sing in function
  //Variables defined with let cannot be redeclared.
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let salt =  bcrypt.genSaltSync(10);
  let hashedP =  bcrypt.hashSync(password, salt);//hashed password
  
  if (username && email && password){ //check if the inputs filed are not empty
    connection.query("SELECT * FROM `Utenti` WHERE UserName= ? and Email = ?",[username,email], function(error, results, fields){
      if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
      Object.keys(results).forEach(function(key){
        let row = results[key];
        if(row.UserName == username && row.Email == email){
          res.send("Username or password alredy existing");
        }
      });
    });
       //insert new user into our database
      connection.query("INSERT INTO Utenti (Email,UserName, uPassword) VALUES (?,?,?);" , [email, username, hashedP], function(error, results, fields){ 
        if (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        }
        
        var dir = __dirname+'/models/'+username;
        if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
        }
      res.redirect('/');
      res.end();
      
    });
  }else{
    res.send("please enter Username, Email and Password");
    res.end;
  }
});

app.post('/chPas',function(req,res){
  console.log("we're in");
  let email = req.body.email;
  let isValid = false;
  console.log(email);
  connection.query("SELECT Email FROM `Utenti`" , function(error, results, fields){ 
    console.log("we're in the query");
    if (error) {
          console.log(error);
          res.sendStatus(500);
          return;
    }else{
      Object.keys(results).forEach(function(key){
          let row = results[key];
          console.log(row.Email);
          if(row.Email == email){
            isValid = true;
          }
      });
      if(isValid){
        let mailOptions = {
          from: '3dSpaceTeam@gmail.com',
          to: email,
          subject: 'Password reset',
          html: '<p>Click <a href="https://8005-lorenzotelo-threejsfirs-yftserqua8e.ws-eu45.gitpod.io/">here</a> to reset your password</p>'
        }

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    }
  });
});
app.use(express.static(__dirname + '/Html'));
app.use('/', router);
app.listen(port);
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// });