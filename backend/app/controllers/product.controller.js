const Product = require("../models/product.model.js");

function send_response(res, data_response, status = 200, error_message) {
  res.header("Access-Control-Allow-Origin", "*");
  if (status != 200)
    res.status(status).send({ message: data_response.message || error_message });
  else
    res.send(data_response);
}

exports.getCategories = (req, res) => {
  Product.getCategories((err, data) => {
    err ? send_response(res, err, 500, "Some error occured while retrieving categories.") : send_response(res, data, 200, "")
  });
}

exports.getCategory = (req, res) => {
  console.log(req.params.category_id);
  Product.getCategory(req.params.category_id, (err, data) => {
    err ? send_response(res, err, 500, "Some error occured while retrieving category.") : send_response(res, data, 200, "")
  });
}

exports.findAll = (req, res) => {
  Product.getAll((err, data) => {
    err ? send_response(res, err, 500, "Some error occured while retrieving products.") : send_response(res, data, 200, "")
  });
}

exports.findById = (req, res) => {
  Product.findById(req.params.productId, (err, data) => {
    err ? send_response(res, err, 500, "Some error occured while retrieving product.") : send_response(res, data, 200, "")
  });
}

exports.searchByTerm = (req, res) => {
  Product.search(req.params.searchTerm, (err, data) => {
    err ? send_response(res, err, 500, "Error occured while searching.") : send_response(res, data, 200, "");
  });
}

exports.create = (req, res) => {
  if (!req.body) {
    send_response(res, null, 400, "Content cannot be empty")
  }
  else {
    const product = new Product({ name: req.body.name, price: req.body.price, stock: req.body.stock });
    Product.create(product, (err, data) => {
      err ? send_response(res, err, 500, "Error occured while creating.") : send_response(res, data, 200, "");
    });
  }
}

exports.deleteById = (req, res) => {
  if (!req.body) {
    send_response(res, null, 400, "Content cannot be empty");
  }
  else {
    const id = req.body.productId;
    console.log(id);
    Product.deleteById(id, (err, data) => {
      err ? send_response(res, err, 500, "Error occured while removing.") : send_response(res, data, 200, "");
    });
  }
}

exports.updateById = (req, res) => {
  if (!req.body)
    send_response(res, null, 400, "Content cannot be empty");
  else {
    const [id, name, price, stock] = [req.body.productId, req.body.productName, req.body.price, req.body.stock]
    Product.update(id, name, price, stock, (err, data) => {
      err ? send_response(res, err, 500, "Some error occured while updating a product.") : send_response(res, data, 200, "");
    });
  }
}