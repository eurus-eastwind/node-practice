// import modules/packages
const express = require("express");
// to access PORT in .env
const dotenv = require("dotenv").config();
// para everytime na magrestart ang app, malalagyan ng laman yung database. Pwedeng
//table, attributes, etc.
// iiimport nya lahat ng models sa model folder
const db = require("./src/models");

const jwt = require("jsonwebtoken");

// import userRouter
const userRoute = require("./src/routes/user.routes");

// import loginRouter
const loginRoute = require("./src/routes/login.routes");

// initialize app
var app = express();

// parse requests of content-type - application/json
app.use(express.json()); //we don't have to install body parser

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
    express.urlencoded({
      extended: true,
    })
  );

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully!');
  }).catch((error) => {
    console.error('Unable to connect to database:', err);
  })

  if (process.env.ALLOW_SYNC === "true"){
    // para ma-sync sa database table
    db.sequelize.sync({alter: true })
      .then(() => console.log('Done adding/updating database based on the models'))
    // get config variables
    //dotenv.config();
  }

// all request will go here first (middleware)
// Before "Welcome to SAS API Demo"
app.use((req, res, next) => {
    // you can check session here
    console.log("Request has been sent to " + req.url);
    // console.log("Request has been sent!");
    next(); // 
  });

// create routes
// req = request, res =respond
// request first before respond
app.get("/", (req, res) => {
    res.json({message : "Welcome to SAS API Demo"});
});
// For generation of secret token
// WE HAVE TO REMOVE THIS ONCE WE GET THE SECRET TOKEN
// console.log(require("crypto").randomBytes(64).toString("hex"));

// Token authentication
const authenticateToken = (req, res, next) => {
  // para makuha yung value sa header
  const authHeader = req.headers["authorization"]; // Bearer gfjkghjkghvsdjkghvdkhgskhdgskjvdhgkjhgjkdvghkl

  //split kasi may space para makuha yung pangalawang value
  const token = authHeader && authHeader.split(" ")[1];

    // For unauthorized notif 
  if (token == null) return res.sendStatus(401);

  // verify if legit yung token or valid
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;

    console.log(user);
    next();
  });
};
// Di muna kailangan yung authenticateToken kasi sa login palang namn
app.use(`${process.env.API_VERSION}/login`, loginRoute);
// after login Rout kilangan na lahat may middleware
// app use for user route
// yung authenticateToken is the middleware between user and userRoute
app.use(`${process.env.API_VERSION}/user`,authenticateToken, userRoute); 

// const PORT = 5000; -- short way accessing port
//Another way to access port
//const PORT = process.env.PORT;
// fall back if there's no PORT variable in .env
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});




