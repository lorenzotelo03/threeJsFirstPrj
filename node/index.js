const mysql = require('mysql');

var mysqlConnection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'lore',
        password: 'lore',
        database: 'db'
    }
);

mysqlConnection.connect((err)=>{
        if(!err){
            console.log("Db connection was succesfull");

        }else{
            console.log("Db connection failed");
        }
    }
);