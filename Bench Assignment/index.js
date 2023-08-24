const express = require("express");
const con = require("./config");
const bodyParser = require('body-parser')
const app = express();
const path=require("path");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


// Homepage
app.get("/",(req,res)=>{
  res.render("homepage");
});


// Teacher Dashboard
app.get("/teacher",(req,res)=>{
  con.query("Select rollNo, studentName, Date_Format(birth,'%Y-%m-%d') as birth, score from students",(err,result)=>{
    if(err)
      res.send(err);
    else{
      res.render("teacher",{result});
    }
  })
})

app.get("/addStudent",(req,res)=>{
  res.render("addStudent");
});

app.post("/teacher",(req,res)=>{
  const data={rollNo:parseInt(req.body.rollNo),studentName:req.body.studentName,birth:req.body.birth,score:req.body.score};

  console.log(data);

  con.query("Insert into students set ?",data,(err,result,fields)=>{
        if(err)
          err;
    })
  res.redirect("/teacher");
});

app.post("/teacher/:rollNo",(req,res)=>{
  const data=[req.body.studentName,req.body.birth,req.body.score,parseInt(req.body.rollNo)];

  console.log(data);

  con.query("Update students set studentName=?, birth=?, score=? where rollNo=?",data,(err,result,fields)=>{
    if(err)
      console.log(err);
    else
      res.redirect("/teacher");
  })
});


app.get("/updateStudent/:id",(req,res)=>{
  console.log(req.params.id);
  con.query("Select rollNo, studentName, Date_Format(birth,'%Y-%m-%d') as birth, score from students where rollNo = ?",req.params.id,(err,result,fields)=>{
    if(err)
      res.send(err);
    else{
      const data=result[0];
      console.log(data);
      res.render("updateStudent",{data});
    }
  })
})

app.post("/teacher/deleteRecord/:rollNo",(req,res)=>{
  con.query("Delete from students where rollNo=?",req.params.rollNo,(err,result)=>{
      if(err)
        console.log(err);
      else
        res.redirect("/teacher");
  })
});


// Student Dashboard
app.get("/student",(req,res)=>{
  res.render("searchRecord");
})

app.post("/student/showRecord",(req,res)=>{
  const data=[parseInt(req.body.rollNo),req.body.studentName];

  console.log(data);

  con.query("Select rollNo, studentName, Date_Format(birth,'%Y-%m-%d') as birth, score from students where rollNo = ? and studentName = ?",data,(err,result,fields)=>{
    if(err)
      console.log(err);
    else{
      const studentData=result[0];
      console.log(studentData);
        res.render("showRecord",{studentData});
    }
  })  
});



app.put("/teacher",(req,res)=>{
    const data=[req.body.studentName, req.body.birth, req.body.score, parseInt(req.body.rollNo)];
    con.query("Update students set studentName=?, birth=?, score=? where rollNo=?",data,(err,result,fields)=>{
        if(err)
          console.log(err);
        else
          res.send(result);
    })
});

app.delete("/teacher/:rollNo",(req,res)=>{
    con.query("Delete from students where rollNo=?",req.params.rollNo,(err,result)=>{
        if(err)
          console.log(err);
        else
          res.send(result);
    })
});

app.listen(4200);


