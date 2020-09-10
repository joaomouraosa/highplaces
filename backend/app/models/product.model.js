const sql = require("./db.js");
const { create } = require("../controllers/product.controller.js");

// constructor
class Product {
  constructor(product) {
    this.name = product.name;
    this.price = product.price;
    this.stock = product.stock;
  }

  static getAll(result) {
    sql.query("SELECT * FROM products", (err, res) => { err ? result(null, err) : result(null, res); });
  }

  /*
  static getCategories(result) {
    sql.query(`WITH RECURSIVE category_path (id, name, path) AS (   
                SELECT id, name, name as path FROM categories WHERE parent IS NULL   
                UNION ALL   
                SELECT c.id, c.name, CONCAT(cp.path, ' > ', c.name) FROM category_path AS cp 
                JOIN categories AS c ON cp.id = c.parent ) 
                SELECT * FROM category_path ORDER BY path`, (err, res) => { err ? result(null, err) : result(null, res); });
  }
*/

  static getCategories(result) {
    sql.query(`SELECT * FROM categories`, (err, res) => { err ? result(null, err) : result(null, res); });
  }

  static getCategory(id, result) {
    sql.query(`SELECT * from products JOIN categories ON products.category_id=categories.id WHERE category_id=${id}`,
      (err, res) => { err ? result(null, err) : result(null, res); });
  }

  static search(searchTerm, result) {
    sql.query(`SELECT * FROM products WHERE name LIKE '%${searchTerm}%'`, (err, res) => { err ? result(null, err) : result(null, res); });
  }

  static update(productId, name, price, stock, result) {
    let query = `UPDATE products SET name = '${name}', price=${price}, stock=${stock} WHERE id=${productId}`
    console.log(query);
    sql.query(query, (err, res) => {
      err ? result(null, err) : result(null, res);
    });
  }

  static findById(productId, result) {
    console.log(productId);
    sql.query(`SELECT * FROM products WHERE id = ${productId}`, (err, res) => {
      err ? result(null, err) : result(null, res);
    });
  }

  static create(product, result) {
    sql.query(`INSERT INTO products(name, price, stock) VALUES("${product.name}",${product.price},${product.stock})`, (err, res) => {
      err ? result(null, err) : result(null, res);
    });
  }

  static deleteById(id, result) {
    const query = `DELETE FROM products WHERE id=${id}"`
    console.log(query);
    sql.query(`DELETE FROM products WHERE id=${id}`,
      (err, res) => {
        if (err) {
          result(null, err);
          return;
        }
        result(null, res);
      });
  }


}





/*

Product.updateById = (id, product, result) => {
  sql.query(
    "UPDATE products SET price = ?, name = ?, active = ? WHERE id = ?",
    [product.price, product.name, product.active, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Product with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated product: ", { id: id, ...product });
      result(null, { id: id, ...product });
    }
  );
};

Product.remove = (id, result) => {
  sql.query("DELETE FROM products WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Product with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted product with id: ", id);
    result(null, res);
  });
};

Product.removeAll = result => {
  sql.query("DELETE FROM products", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} products`);
    result(null, res);
  });
};

*/

module.exports = Product;
