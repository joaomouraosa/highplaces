const Order = require("../models/order.model.js");

exports.retrieveOrder = (req, res) => {
  console.log(req.body);
  Order.retrieveOrder(req.body, (err, data) => {
    (err) ? res.status(500).send({ message: err.message || "Some error occured while retrieving order." }) : res.send(data);
  });
}

