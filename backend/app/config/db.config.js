/*
module.exports = {
  // HOST: "172.18.0.3",
  HOST: "localhost",
  USER: "root",
  PASSWORD: "RFA34#$m",
  DB: "site"
};


/*
module.exports = {
  HOST: "us-cdbr-east-02.cleardb.com",
  USER: "b892e812dc4d71",
  PASSWORD: "18241915",
  DB: "heroku_8e725243dfcd1be"
};
*/


module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_DATABASE
};
