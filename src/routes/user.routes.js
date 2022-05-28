var router = require("express").Router();

// import controller user para magamit
const userController = require("../controllers/user.controller");

router.post("/", userController.create); // insert
router.put("/:id", userController.update); // update
router.get("/datatable", userController.findDataTable);
router.get("/", userController.findAll);
router.get("/:id", userController.findOne);
router.delete("/:id", userController.delete);


// We need to export this para magamit sa index.js
module.exports = router;