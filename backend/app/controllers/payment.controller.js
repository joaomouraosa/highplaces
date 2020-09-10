const Payment = require("../models/payment.model.js");

exports.payment_card = (req, res) => {
    let order = req.body;
    Payment.payment_card(order, (err, data) => {
        (err) ? res.status(500).send({ error: err.message || "Some error occured while paying." }) : res.send(data);
    });
}