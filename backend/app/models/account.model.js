const sql = require("./db.js");
const { create } = require("../controllers/order.controller.js");
const crypto = require('crypto');
const serverConfig = require("../config/server.config.js");

// constructor
class Account {

    constructor(account) {
        this.id = order.id;
        this.quantity = order.quantity;
    }

    static register(account, result) {

        const passW = crypto.createHmac('sha256', serverConfig.secret).update(account.password + "").digest('hex');

        let promise = new Promise(function (resolve, reject) {

            if (account.password.length < 8)
                return reject("password must be at least 8 characters");

            //this is not working as supposed.
            for (let key of Object.keys(account)) {
                if (account[key] == undefined)
                    return reject(`${value} cannot be empty`);
            }

            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(account.email)))
                return reject("email is invalid")

            sql.query(`SELECT * FROM customers WHERE email='${account.email}'`, (err, result) => {
                if (err)
                    reject(err);
                if (result.length > 0)
                    return reject("email is already registered");
                return resolve("success");
            });
        });

        promise
            .then(() => {
                const query_db = `
                    INSERT INTO customers (email,firstname,lastname,firstname_shipping,lastname_shipping,country,zip_code,city, mobile_number, 
                    password_hash, address_line_1, address_line_2) VALUES ('${account.email}','${account.firstname}', '${account.lastname}',
                    '${account.firstname_shipping}', '${account.lastname_shipping}', '${account.country}','${account.zip_code}','${account.city}',
                    '${account.mobile_number}','${passW}','${account.address_line_1}','${account.address_line_2}');
                `
                sql.query(query_db, (err, res) => {
                    if (err)
                        return result(err, null);
                    return result(null, "success");
                });
            })
            .catch((e) => { return result(e, null) });
    }

    static update(account, result) {
        const passW = crypto.createHmac('sha256', serverConfig.secret).update(account.password + "").digest('hex');
        const email_password_alright_query = `SELECT firstname FROM customers WHERE password_hash='${passW}' AND email='${account.email}';`
        const update_information_query = `UPDATE customers SET firstname='${account.firstname}', lastname='${account.lastname}', firstname_shipping='${account.firstname_shipping}', 
            lastname_shipping='${account.lastname_shipping}', country='${account.country}', zip_code='${account.zip_code}', city='${account.city}', mobile_number='${account.mobile_number}', 
            address_line_1='${account.address_line_1}', address_line_2='${account.address_line_2}' WHERE email='${account.email}' AND password_hash='${passW}';`

        let check_email_password = new Promise((resolve, reject) => {
            sql.query(email_password_alright_query, (err, res) => {
                console.log(res);
                if (err)
                    return reject(err);
                if (res.length == 0)
                    return reject("email/password incorrect");
                return resolve("alright");
            })
        });

        let update_account = new Promise((resolve, reject) => {
            sql.query(update_information_query, (err, res) => {
                if (err)
                    return reject(err);
                return resolve("updated");
            })
        });

        check_email_password
            .then(() => update_account)
            .then((res) => result(null, res))
            .catch((e) => result(e, null));
    }

    static login(account, result) {

        const passW = crypto.createHmac('sha256', serverConfig.secret).update(account.password + "").digest('hex');

        const not_logged_in_query = ` SELECT * FROM logged_in WHERE email='${account.email}';`

        const email_password_alright_query = ` SELECT firstname FROM customers WHERE password_hash='${passW}' AND email='${account.email}';`

        const retrieve_user_information_query = `  SELECT email, firstname, lastname, firstname_shipping, lastname_shipping, country, zip_code, city, mobile_number, address_line_1, address_line_2 
                            FROM customers WHERE password_hash='${passW}' AND email='${account.email}';`
        const logging_in_query = ` INSERT INTO logged_in (email) VALUES ('${account.email}');`

        let not_logged_in = new Promise((resolve, reject) => {
            sql.query(not_logged_in_query, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length > 0) {
                    return reject("already logged in");
                }
                return resolve("alright");
            })
        });

        let email_password_alright = new Promise((resolve, reject) => {
            sql.query(email_password_alright_query, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res.length == 0) {
                    return reject("email or password are incorrect");
                }
                return resolve("alright");
            })
        });

        let logging_in = new Promise((resolve, reject) => {
            sql.query(logging_in_query, (err, res) => {
                if (err)
                    return reject(err);
                return resolve(res);
            })
        })

        let retrieve_user_information = new Promise((resolve, reject) => {
            sql.query(retrieve_user_information_query, (err, res) => {
                if (err) return reject(err);
                if (res.length == 0)
                    return reject("something went wrong while login");
                return resolve(res);
            })
        })
        /*
                not_logged_in
                    .then(() => email_password_alright)
                    .then(() => logging_in)
                    .then(() => retrieve_user_information)
                    .then((res) => result(null, res))
                    .catch((e) => result(e, null));
                    */
        email_password_alright
            .then(() => retrieve_user_information)
            .then((res) => result(null, res))
            .catch((e) => result(e, null));
    }


    static logout(account, result) {

        const passW = crypto.createHmac('sha256', serverConfig.secret).update(account.password + "").digest('hex');
        const email_password_alright_query = ` SELECT firstname FROM customers WHERE password_hash='${passW}' AND email='${account.email}';`
        const logout_query = `DELETE FROM logged_in WHERE email='${account.email}';`

        let email_password_alright = new Promise((resolve, reject) => {
            sql.query(email_password_alright_query, (err, res) => {
                if (err)
                    return reject(err);
                if (res.length == 0)
                    return reject("email or password are incorrect");
                return resolve("alright");
            })
        });

        let logout = new Promise((resolve, reject) => {
            sql.query(logout_query, (err, res) => {
                if (err)
                    return reject(err);
                return resolve(res);
            })
        })

        email_password_alright.then(() => logout).then((res) => result(null, "logged out")).catch((e) => result(e, null));
    }
}

module.exports = Account;
