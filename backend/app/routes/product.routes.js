module.exports = app => {
  const products = require("../controllers/product.controller.js");

  app.get("/api/products", products.findAll);   
  app.get("/api/products/:productId", products.findById); 
  app.get("/api/products/search/:searchTerm", products.searchByTerm);
  app.get("/api/categories", products.getCategories);
  app.get("/api/categories/:category_id", products.getCategory);

  app.post("/api/products/add", products.create); 
  app.post("/api/products/remove/", products.deleteById); 
  app.post("/api/products/update/", products.updateById);
};
