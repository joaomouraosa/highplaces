const sql = require("./db.js");
const { create } = require("../controllers/order.controller.js");
const crypto = require('crypto');
const serverConfig = require("../config/server.config.js");

// constructor
class Order {

  constructor(order) {
    this.id = order.id;
    this.quantity = order.quantity;
  }

  //mudar o estado da order

  static make_query(conn, query_) {
    return new Promise((resolve, reject) => {
      conn.query(query_, (err, result) => {

        if (err)
          reject(err);
        console.log("done query: " + query_);
        conn.commit((err) => {
          err ? reject(err) : resolve(result);
        });
      });
    })
  }

  static retrieveOrder(orders, result) {

    sql.getConnection((err, conn) => {
      conn.beginTransaction((err) => {
        if (err) {
          conn.rollback(() => {
            conn.release();
          });
        }
        else {

          const order_id = Date.now();
          const hash = crypto.createHmac('sha256', serverConfig.secret).update(order_id + "").digest('hex');

          this.make_query(conn, `DROP TABLE IF EXISTS tempDB_${order_id}`)
            .then(() => { return this.make_query(conn, `CREATE TABLE tempDB_${order_id} (id MEDIUMINT, quantity MEDIUMINT)`) })
            .then(() => {
              return Promise.all(
                orders.map((order) => { return this.make_query(conn, `INSERT INTO tempDB_${order_id} (id,quantity) VALUES(${order.productId}, ${order.quantity})`) })
              )
            })
            .then(() => {
              return this.make_query(conn, `
              SELECT * FROM (
                SELECT foo.id, name, stock, quantity, price, quantity*price as total FROM (
                  (
                    SELECT id, SUM(tempDB_${order_id}.quantity) as quantity FROM tempDB_${order_id} 
                    GROUP BY tempDB_${order_id}.id
                  ) as foo
                INNER JOIN products ON foo.id=products.id)
              ) as bar
              ORDER BY name asc`)
            })
            .then((res) => {
              let tmp = res.map((x) => {
                return JSON.parse(JSON.stringify(x));
              });
              let total = 0;
              for (let obj of res)
                total += obj.total;

              return {
                "items": tmp,
                "details": {
                  "total": total,
                  "order_id": order_id,
                  "hash_id": hash
                }
              }
            })
            .then((x) => {
              this.make_query(conn, `DROP TABLE IF EXISTS tempDB_${order_id}`);
              result(null, x);
            })
            .then(conn.release())
            .catch((err) => {
              console.log(err);
              result(err, null);
            })
        }
      })
    })






    /*
    //ok
        sql.query(`DROP TABLE IF EXISTS tempDB_${order_id}`, (err, result) => {
          if (err)
            throw err;
          else {
            console.log("Temp table dropped");
    
          }
    
    
    
        });
        //ok
        sql.query(`CREATE TABLE tempDB_${order_id} (id MEDIUMINT, quantity MEDIUMINT)`, function (err, result) { if (err) throw err; console.log("Temp table created"); console.log(result); console.log("---"); });
    
        for (let order of orders) {
          sql.query(`INSERT INTO tempDB_${order_id} (id,quantity) VALUES(${order.productId}, ${order.quantity})`,
            (err, result) => {
              if (err) {
                console.log("OCCURED ERROR TABLE DOES NTO EXIST");
                throw err;
              } console.log("Added to table");
            });
    
          sql.query(`INSERT INTO orders(order_id, product_id, customer_id, uni_price, quantity, state, hash)
                          VALUES(${order_id}, ${order.productId}, 0, (SELECT price FROM products WHERE id=${order.productId}), ${order.quantity}, 0, "${hash}") `,
            (err, result) => { if (err) throw err; console.log("Created order table"); });
        }
    
        let query_db = `SELECT * 
                        FROM (SELECT foo.id, name, stock, quantity, price, quantity*price as total                      
                              FROM ( (SELECT id, SUM(tempDB_${order_id}.quantity) as quantity 
                                      FROM tempDB_${order_id} GROUP BY tempDB_${order_id}.id) as foo
                        INNER JOIN products ON foo.id=products.id)) as bar;`
    
        sql.query(query_db, (err, res) => {
          if (err) { console.log(err); return result(err, null); }
    
          sql.query(`DROP TABLE IF EXISTS tempDB_${order_id}`, (err, result) => { if (err) throw err; console.log("Temp table dropped"); });
    
          //let response = res.map((x) => { let v = {"item": JSON.parse(JSON.stringify(x))}; return v;});
          let response = res.map((x) => JSON.parse(JSON.stringify(x)));
    
          // JSON.parse(JSON.stringify(x)));
    
          let total = 0;
          for (let obj of response)
            total += obj.total;
    
          const obj = {
            "total": total,
            "order_id": order_id,
            "hash_id": hash
          }
          response = { "items": response, "details": obj };
    
          //      response.push({ "order_info": obj });
    
          result(null, response);
        });
    */

  }
}

module.exports = Order;
