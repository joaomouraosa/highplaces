const env = require('dotenv').config();
const express      = require("express");
const bodyParser   = require("body-parser");
const serverConfig = require("./backend/app/config/server.config.js");
const path = require('path');
const app = express();

app.use(bodyParser.json()); // parse requests of content-type: application/json
app.use(bodyParser.urlencoded({ extended: true }));// parse requests of content-type: application/x-www-form-urlencoded

app.use(express.static(path.join(__dirname, 'frontend/build')));

require("./backend/app/routes/product.routes.js")(app);
require("./backend/app/routes/order.routes.js")(app);
require("./backend/app/routes/payment.routes.js")(app);
require("./backend/app/routes/account.routes.js")(app);

/*
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/frontend/build/index.html'));
});
*/
app.listen(serverConfig.PORT, () => { // set port, listen for requests
  console.log(env);
  console.log(`Server running on port ${serverConfig.PORT}`);
});