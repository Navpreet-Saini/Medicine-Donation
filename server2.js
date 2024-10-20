const { urlencoded } = require("express");
var expressKuch = require("express");
var fileuploader = require("express-fileupload");
var path = require("path");
var mysql = require("mysql");
var app = expressKuch();


//used to serve .js and .css files from public folder
app.use(expressKuch.static("public"));
//to start the server with a port
app.listen(2008, function () {
    console.log("Server started");
});
// connection with backend server
var dbConfiguration = {
    host: "localhost",//fixed
    user: "root",//pwd
    password: "", //""
    database: "medicine" //ur own database name 
}

var refDB = mysql.createConnection(dbConfiguration);
refDB.connect(function (errKuch) {
    if (errKuch)
        console.log(errKuch);
    else
        console.log("Connected to Server....")
});
app.get("/", function (req, resp) {
    var puraPath = process.cwd() + "/public/index.html";
    resp.sendFile(puraPath);
});
app.get("/signup", function (req, resp) {
    console.log(req.query);
    var dataAry = [req.query.mail, req.query.pass, req.query.utype, 1];
    refDB.query("insert into users values(?,?,?,?)", dataAry, function (err, result) {
        if (err)
            resp.send(err);
        else
            resp.send("inserted successfully");
    })
});
app.get("/chklogin", function (req, resp) {
    var ary = [req.query.mail, req.query.pass];
    refDB.query("select * from users where email=? and pwd=? and status=1", ary, function (err, result) {
        if (err) {
            resp.send(err);
        }
        else {
            resp.send(result);
        }
    })
})

app.get("/update", function (req, resp) {
    var ary2 = [req.query.mail, req.query.oldpass];
    var ary3 = [req.query.newpass, req.query.mail];
    refDB.query("select * from users where email=? and pwd=? and status=1", ary2, function (err, result) {
        if (err) {
            resp.send(err);
        }
        else {
            if (result.length == 1) {
                refDB.query("update users set pwd=? where email=?", ary3, function (err, result) {
                    if (err) {
                        resp.send(err);
                    }
                    else {
                        resp.send("Password Successfully updated");
                    }
                })

            }
            else {
                resp.send("Invalid old Password");
            }
        }

    })
});
app.get("/getProfile", function (req, resp) {
    //0/1 records
    refDB.query("select * from users where email=?", [req.query.email], function (err, result) {
        if (err)
            resp.send(err);

        else
            resp.send(result);
    })
});
app.get("/process", function (req, resp) {
    var fullPath = process.cwd() + "/public/profile-donor.html"
    resp.sendFile(fullPath);
});
app.use(expressKuch.urlencoded('extended:true'));
app.use(fileuploader());
app.post("/profile-process", function (req, resp) {
    var dataAry = [req.body.txtEmail, req.body.txtName, req.body.txtmob, req.body.txtAddr, req.body.txtCity, req.body.idp, req.body.txtct, req.files.proof.name, req.files.profile.name];
    refDB.query("insert into dprofile values(?,?,?,?,?,?,?,?,?)", dataAry, function (err, result) {
        if (err)
            resp.send(err);
        else
            resp.send("Inserted Successfully");
    })
});
app.post("/donate-process", function (req, resp) {


    var dataAry2 = [req.body.txtEmail,req.body.txtct, req.body.txtmed, req.body.pack, req.body.qty, req.body.date, req.body.comp, req.files.medpic.name, req.body.des];
    refDB.query("insert into medicines values(?,?,?,?,?,?,?,?,?)", dataAry2, function (err, result) {
        if (err)
            resp.send(err);
        else
            resp.send("Inserted Successfully");
    })
});
app.all("/fetchAllRecords", function (req, resp) {
    refDB.query("select * from users ", function (err, resultAryOfObjects) {
        if (err)
            resp.send(err);

        else
            resp.send(resultAryOfObjects);;
    })

})

app.get("/profile-block", function (req, resp) {
    refDB.query("update users set status=? where email=?", [0, req.query.email], function (err, result) {
        if (err) {
            resp.send(err);
        }
        else {
            resp.send("User Blocked Successfully");
        }
    })

})
app.get("/profile-resume", function (req, resp) {
    refDB.query("update users set status=? where email=?", [1, req.query.email], function (err, result) {
        if (err) {
            resp.send(err);
        }
        else {
            resp.send("User Resumed Successfully");
        }
    })

})
app.all("/fetchAllRecords2", function (req, resp) {
    refDB.query("select * from dprofile ", function (err, resultAryOfObjects) {
        if (err)
            resp.send(err);

        else
            resp.send(resultAryOfObjects);;
    })

})
app.get("/profile-delete-angualr",function(req,res)
{                                //table col name
    refDB.query("delete from dprofile where emailed=?",[req.query.emailed],function(err,result){
            if(err)
                res.send(err);
            else
            if(result.affectedRows==0)
            res.send("Invalid Id");
            else
                res.send("Record Deleted Successfulllllyyyyy.... Badhaiiiii");
    })
})
app.get("/fetchAllcity",function(req,resp)
{
    refDB.query("select distinct city from dprofile ",function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);;
    })

})
app.get("/fetchSomemedRecords",function(req,resp)
{
    refDB.query("select * from medicines where city=? ",[req.query.city],function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);;
    })

})
app.get("/fetchSomeRecords",function(req,resp)
{
    refDB.query("select * from medicines where city=? and medicine=? ",[req.query.city,req.query.medicine],function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);;
    })

})
app.get("/fetchRecords",function(req,resp)
{
    refDB.query("select * from medicines where emailed=? ",[req.query.email],function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);;
    })

})
app.get("/profile-delete-med",function(req,res)
{                                //table col name
    refDB.query("delete from medicines where medicine=?",[req.query.medicine],function(err,result){
            if(err)
                res.send(err);
            else
            if(result.affectedRows==0)
            res.send("Invalid Id");
            else
                res.send("Record Deleted Successfulllllyyyyy.... Badhaiiiii");
    })
})
app.get("/admin", function (req, resp) {
    var puraPath = process.cwd() + "/public/admin-panel.html";
    resp.sendFile(puraPath);
});
app.get("/contactdonor",function(req,resp)
{
    refDB.query("select * from dprofile where emailed=? ",[req.query.email],function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);;
    })

})

