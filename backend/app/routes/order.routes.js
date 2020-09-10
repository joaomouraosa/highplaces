const cors = require('cors')


module.exports = app => {
  app.use(cors())

  const order = require("../controllers/order.controller.js");
  app.post("/api/order", cors(), order.retrieveOrder);

};
