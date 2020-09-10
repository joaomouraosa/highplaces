const cors = require('cors')

module.exports = app => {
  app.use(cors())

  const account = require("../controllers/account.controller.js");
  app.post("/api/register", cors(), account.register);
  app.post("/api/login", cors(), account.login);
  app.post("/api/logout", cors(), account.logout);
  app.post("/api/update", cors(), account.update);
};
