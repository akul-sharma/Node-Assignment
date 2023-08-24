const mysql= require("mysql");

const con=mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "assignment13"
});

con.connect((err)=>{
    if(err){
        console.warn(err);
    }
    else{
        console.log("Connected");
    }
});

module.exports=con;