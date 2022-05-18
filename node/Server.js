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
var multer = require('multer');
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
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '3dSpaceCrew@gmail.com',
      pass: '3dSpaceCrew0099'
    }
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//crea una sessione
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/models/' + req.session.username))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

//will be using this for uplading
const upload = multer({ storage: storage });
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/Html/home.html'));
    //__dirname : It will resolve to your project folder.
});

router.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, '/Html/login.html'));
    //__dirname : It will resolve to your project folder.
});

router.get('/3dWorkSpace', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
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
              return res.redirect('/3dWorkSpace');
              //res.send("you're in congrats");
            }else{
              res.send("something went wrong, incorrect Username and/or Password");
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
            res.status(500).send(error);
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
           res.status(500).send(error);
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
  let email = req.body.email;
  let isValid = false;
  console.log(email);
  connection.query("SELECT Email FROM `Utenti`" , function(error, results, fields){ 

    if (error) {
          console.log(error);
          res.sendStatus(500);
          return;
    }
    console.log(results);
    for(let i=0; i<results.length; i++){
        let row = results[i];
        console.log(email,"==",row.Email,":",email==row.Email);
        if(row.Email == email){
          console.log("valid email");
          isValid = true;
          break;
        }
    }
    console.log("isValid : ",isValid);
    if(!isValid){
      res.status(400).send("email not found");
      return;
    }
      console.log("inside your body");
      let mailOptions = {
        from: '3dSpaceTeam@gmail.com',
        to: email,
        subject: 'Password reset',
        html: '<p>Click <a href="https://8005-lorenzotelo-threejsfirs-yftserqua8e.ws-eu45.gitpod.io/">here</a> to reset your password</p>',
      };
      transporter.sendMail(mailOptions);//, function(error, info){
      //     if (error) {
      //       console.log(error);
      //       return;
      //     } 
      //     console.log('Email sent: ' + info.response);
          
      // });
    });
  });

app.post('/addModel',upload.single('file'),function(req,res){
  if(!req.session.login) {
    res.status(401).send("You're not logged in");
    return;
  }
  if(!req.file){
    res.status(500).send("internal server Error");
  }
    res.status(200).send("you've succesfully uploaded your file");

});


app.use(express.static(__dirname + '/Html'));
app.use('/', router);
app.listen(port);
