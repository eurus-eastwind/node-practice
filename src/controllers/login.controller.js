const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (data) => {
    // take not sa difference ng sign and verify
  return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: "7200s" }); // After 2 hrs lang yung token
}; // ito yung maggegegnerate ng token

exports.login = (req, res) => {

    // Check if email and password fill has value and must not empty
  if (String(req.body.email) === "" || String(req.body.password) === "") {
    res.status(500).send({
      error: true,
      data: [],
      message: ["Username or Password is empty."],
    });
  }

  User.findOne({ where: { email: req.body.email, status: "Active" } })
    .then((data) => {
      if (data) {
        // compare password
        bcrypt.compare(
          req.body.password, // plain password
          data.password, //from DB password
          function (err, result) {
            if (result) {
              // same password
              res.send({
                error: false,
                data: data,
                token: generateToken({ // ito na yung sinasabi ni sir na token combination
                  id: data.id,
                  name: data.full_name,
                  email: data.email,
                }),
                message: [process.env.SUCCESS_RETRIEVED],
              });
            } else {
              // invalid password
              res.status(500).send({
                error: true,
                data: [],
                message: ["Invalid username and Password."], // possible na or
              });
            }
          }
        );
      } else {
        res.status(500).send({
          error: true,
          data: [],
          message: ["Username does not exists."],
        });
      }
    })
    .catch((err) => {
      console.log(err);
      //   res.status(500).send({
      //     error: true,
      //     data: [],
      //     message:
      //       err.errors.map((e) => e.message) || process.env.GENERAL_ERROR_MSG,
      //   });
    });
};