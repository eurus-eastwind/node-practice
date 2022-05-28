const db = require('../models');
const User = db.User; // user model
const bcrypt = require("bcrypt");
const datatable = require("sequelize-datatables");

exports.findDataTable = (req, res) => {
  req.body = {
    draw: "1",
    columns: [
      {
        data: "full_name",
        name: "",
        searchable: "true",
        orderable: "true",
        search: {
          value: "",
          regex: "false",
        },
      },
    ],
    order: [
      {
        column: "0",
        dir: "asc",
      },
    ],
    start: 0,
    length: 10,
    search: {
      value: "",
      regex: "false",
    },
    _: "1478912938246",
  };

  datatable(User, req.body).then((result) => {
    // result is response for datatables
    res.json(result);
  });
};

//create and save new user
exports.create = async (req, res) => {
    // hindi gumagana yung concatenation ng full_name kaya need to add this one
    req.body.full_name = "";
    
    req.body.created_by = req.user.id
    req.body.password = await bcrypt.hash(
        req.body.password, parseInt(process.env.SALT_ROUND),
        // Store hash in your password DB.
    );
    User.create(req.body, { include: ["user_task"] })
    .then((data) => {   // ang goal nito ay kung magkecreate ng user pati narin yung user_task
      User.findByPk(data.id, { include: ["created", "user_task"] }).then(
        (result) => {
          res.send({
            error: false,
            data: result,
            message: [process.env.SUCCESS_CREATE],
          });
        }
      );
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
// Retrieve all User from the database.
exports.update = async (req, res) => {
    const id = req.params.id;
    req.body.full_name = "";
  
    if (req.body.password) {
      req.body.password = await bcrypt.hash(
        req.body.password,
        parseInt(process.env.SALT_ROUNDS)
      );
    }
  
    User.update(req.body, { where: { id: id, status: 'Active'} })
      .then((result) => {
        if (result) {
          // retrieve updated details
          User.findByPk(id).then((data) => {
            res.send({
              error: false,
              data: data,
              message: [process.env.SUCCESS_UPDATE],
            });
          });
        } else {
          res.status(500).send({
            error: true,
            data: [],
            message: ["Error in updating a record"],
          });
        }
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  };

exports.findAll = (req, res) => {
    User.findAll({where : {status : 'Active'}})
    .then((data) => {
        res.send({
            error : false,
            data : data,
            message : ["Retrieved Successfully!"],
        });
    }).catch((err) => {
        res.status(500).send({
            error : true,
            data : [],
            message : err.errors.map((e) => e.message),
        });
    });
  };
  

exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findByPk(id)
    .then((data) => {
      res.send({
        error: false,
        data: data,
        message: [process.env.SUCCESS_RETRIEVED],
      });
    })
    .catch((err) => {
      res.status(500).send({
        error: true,
        data: [],
        message:
          err.errors.map((e) => e.message) || process.env.GENERAL_ERROR_MSG,
      });
    });

  // User.findOne({ where: { id: id } })
  //   .then((data) => {
  //     res.send({
  //       error: false,
  //       data: data,
  //       message: [process.env.SUCCESS_RETRIEVED],
  //     });
  //   })
  //   .catch((err) => {
  //     res.status(500).send({
  //       error: true,
  //       data: [],
  //       message:
  //         err.errors.map((e) => e.message) || process.env.GENERAL_ERROR_MSG,
  //     });
  //   });
};



exports.delete = async (req, res) => {
    const id = req.params.id;
    const body = {status : 'Inactive'};
    
    User.update(body, { where: { id: id } })
      .then((result) => {
        if (result) {
          // retrieve updated details
          User.findByPk(id).then((data) => {
            res.send({
              error: false,
              data: data,
              message: [process.env.SUCCESS_UPDATE],
            });
          });
        } else {
          res.status(500).send({
            error: true,
            data: [],
            message: ["Error in updating a record"],
          });
        }
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  };