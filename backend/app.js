require('dotenv').config();
var express = require('express');
var mustacheExpress = require('mustache-express');
var cookieParser = require('cookie-parser');
const { initialize, requireAuth, session, } = require('./auth');
const app = express();
const routes = require('./routes/index');

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

app.use(cookieParser());

app.use(initialize);
app.use(session)
app.use(routes);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/private", requireAuth, (req, res) => {
  const claims = req.session.tokenSet.claims();

  console.log(" >>>>>>>>>>>>>>>>> ", claims);

  // res.render("private", {
  //   email: claims.email,
  //   picture: claims.picture,
  //   name: claims.name,
  // });
});

app.listen(process.env.PORT, () => {
  console.log(`Express started on port ${process.env.PORT}`);
});

module.exports = app