const cors = require('cors')

module.exports = app => {
    app.use(cors())
    const payment = require("../controllers/payment.controller.js");
    app.post("/api/payment-card", cors(), payment.payment_card);
};
