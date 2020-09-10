const crypto = require('crypto');
const serverConfig = require("../config/server.config.js");
const sql = require("./db.js");

class Payment {

    constructor() {
        this.charge_stripe = this.charge_stripe.bind(this);
    }

    static async charge_stripe(payment_info, total) {
        /*
        try {
            const { order, token } = payment_info;
            const customer = await stripe.customers.create({ email: token.email, source: token.id });
            const idempotency_key = uuid();

            const charge = await stripe.charges.create({
                amount: total * 100,
                currency: "eur",
                customer: customer.id,
                receipt_email: token.email,
                description: `ID ${order.id}`,
                shipping: {
                    name: token.card.name, address: {
                        line1: token.card.address_line1,
                        line2: token.card.address_line2,
                        city: token.card.address_city,
                        country: token.card.address_country,
                        postal_code: token.card.address_zip
                    }
                }
            },
                { idempotency_key }
            );
            status = "success";
        } catch (error) { status = "failure"; }
        return status;
        */
        return "success";
    }

    static async payment_card(payment_info, result) {

        //verificar se o hash está em condições
        const hash = crypto.createHmac('sha256', serverConfig.secret).update(payment_info.order_id + "").digest('hex');
        if (hash != payment_info.hash)
            return result({ message: "Hash and Order_ID don't match" }, null);

        //ir à base de dados, e ver os dados da order (preço final)
        sql.query(`SELECT SUM(uni_price*quantity) as total FROM orders WHERE order_id=${payment_info.order_id};`,
            (err, res) => {
                if (err)
                    return result(null, err);
                let total_value = JSON.parse(JSON.stringify(res))[0];
                let status;
                //obter os dados da payment_info (enviada no pedido) e enviar as coisas
                console.log(payment_info);
                try {
                    /*
                    const { order, token } = payment_info;
                    const customer = await stripe.customers.create({ email: token.email, source: token.id });
                    const idempotency_key = uuid();

                    const { order, token } = payment_info;
                    const customer = await stripe.customers.create({ email: token.email, source: token.id });
                    const idempotency_key = uuid();
                    
                    const charge = await stripe.charges.create({
                        amount: total * 100, currency: "eur", customer: customer.id, receipt_email: token.email, description: `ID ${order.id}`,
                        shipping: {
                            name: token.card.name, address: {
                                line1: token.card.address_line1, line2: token.card.address_line2, city: token.card.address_city,
                                country: token.card.address_country, postal_code: token.card.address_zip
                            }
                        }
                    }, { idempotency_key });

                    */
                    status = "success";
                } catch (error) { status = "failure"; }
                result(null, status);
            })
    }


    //




    /*
     
          let status = charge_stripe(payment_info);
          console.log(status);
     
          if (status == "success")
              return result(null, status)
          return result(status, null);
          */

}

module.exports = Payment;
