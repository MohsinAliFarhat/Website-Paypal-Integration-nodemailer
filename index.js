const express = require("express");
var mysql = require("mysql");
var cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");



const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

var connection = mysql.createConnection({
  host: "localhost",
  user: "gillzimm_navjot",
  password: "+vLUB7.6#fe!",
  database: "gillzimm_gillz_immigration",
});

app.get("/immigration_details/appointements", (req, res) => {
  var rows = "";
  connection.query("Select * from appointement", function (err, rows, fields) {
    if (err) throw err;

    rows = rows;
    res.send(rows);
  });
});

app.post("/immigration_details/appointement", (req, res) => {
  connection.query(
    `INSERT INTO appointement (name, email, date, time, meeting_type, one_hour_id,thirty_min_id)
  VALUES ('` +
      req.body.name +
      `', '` +
      req.body.email +
      `', '` +
      req.body.date +
      `',
   '` +
      req.body.time +
      `', '` +
      req.body.meeting_type +
      `', '` +
      req.body.one_hour_id +
      `', '` +
      req.body.thirty_min_id +
      `');`,
    function (err, rows, fields) {
      if (err) throw err;
    }
  );
  res.sendStatus(200);
});

app.get("/immigration_details/availability", (req, res) => {
  var rows = "";
  connection.query("Select * from availability", function (err, rows, fields) {
    if (err) throw err;

    rows = rows;
    res.send(rows);
  });
});

app.post("/immigration_details/availability", (req, res) => {
 const date = req.body.date;
  const from_time = req.body.from_time;
  const to_time = req.body.to_time;
  const available = req.body.available;
  connection.query("Select * from availability", function (err, rows, fields) {
    if (err) throw err;
    rows = rows;
    var flag = true;
    j = 0;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].date == date) {
        const row_id = rows[i].id;
        flag = false;
        connection.query(
          `UPDATE availability
          SET date = '` +
            date +
            `', from_time= '` +
            from_time +
            `',to_time='` +
            to_time +
            `',available='` +
            available +
            `'
          WHERE id = ` +
            row_id +
            `;`,
          function (err, rows, fields) {
            if (err) throw err;
          }
        );
      }
    }

    if (flag) {
      connection.query(
        `INSERT INTO availability (date, from_time, to_time, available)
      VALUES ('` +
          date +
          `', '` +
          from_time +
          `', '` +
          to_time +
          `',
          '` +
          available +
          `'
       );`,
        function (err, rows, fields) {
          if (err) throw err;
        }
      );
    }
  });

  res.sendStatus(200);
});

app.get("/immigration_details/verifyAdmin/:email/:password", (req, res) => {
  connection.query(
    `Select email, password from admin where email ='` +
      req.params.email +
      `';`,
    function (err, rows, fields) {
      if (err) throw err;

      if (rows.length > 0) {
        if (rows[0].password === req.params.password) {
          res.send({ msg: true });
        } else {
          res.send({ msg: false });
        }
      }else{
        res.send({ msg: false });

      }
    }
  );
});

app.get("/immigration_details/one_hour", (req, res) => {
  connection.query(
    `Select * from one_hour;`,
    function (err, rows, fields) {
      if (err) throw err;

      res.send(rows)
    }
  );
});



app.get("/immigration_details/thirty_mins", (req, res) => {
  connection.query(
    `Select * from thirty_mins;`,
    function (err, rows, fields) {
      if (err) throw err;

      res.send(rows)
    }
  );
});



app.get("/immigration_details/confirmation_email", (req, res) => {


  let transport = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
       user: `apikey`,
       pass: `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`
    }
});

const message = {
  from: 'info@gillzimmigration.com', // Sender address
  to: req.query.email,         // List of recipients
  subject: 'Appointement Confirmation', // Subject line
  text: 'Your appointment at Gillz Immigration is Confirmed With Navjot Gill at:  '+req.query.confirmationTime+' on '+req.query.date+"\nNote:- Payments recieved for appointment booking are non-refundable." // Plain text body
};
transport.sendMail(message, function(err, info) {
  if (err) {
    console.log(err)
  } else {
    console.log(info);
  }
});


});


app.get("/",function(req,res){
  res.send("Welcome")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
