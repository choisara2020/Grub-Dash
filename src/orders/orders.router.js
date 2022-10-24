const router = require("express").Router();

const controller = require("./orders.controller"); //add controller
const methodNotAllowed = require("../errors/methodNotAllowed"); //add method not allowed

// TODO: Implement the /orders routes needed to make the tests pass

router
  .route("/:orderId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete)
  .all(methodNotAllowed);

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);


  //EXPORT THE ROUTER!!!!!!!!
module.exports = router;
