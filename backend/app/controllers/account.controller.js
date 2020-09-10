const Account = require("../models/account.model.js");

exports.register = (req, res) => {
    Account.register(req.body, (err, data) => {
        (err) ? res.status(500).send({ error: err || "Some error occured while registering customer." }) : res.send({ message: data });
    });
}

exports.login = (req, res) => {
    Account.login(req.body, (err, data) => {
        (err) ? res.status(500).send({ error: err || "Some error occured while login" }) : res.send({ message: data });
    });
}

exports.logout = (req, res) => {
    Account.logout(req.body, (err, data) => {
        (err) ? res.status(500).send({ error: err || "Some error occured while logout" }) : res.send({ message: data });
    });
}

exports.update = (req, res) => {
    Account.update(req.body, (err, data) => {
        (err) ? res.status(500).send({ error: err || "Some error occured while updating" }) : res.send({ message: data });
    });
}