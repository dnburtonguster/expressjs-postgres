import bodyParser from "body-parser";
import express from "express";
import pg from "pg";

// Connect to the database using the DATABASE_URL environment
//   variable injected by Railway
const pool = new pg.Pool();

const app = express();
const port = process.env.PORT || 3333;

app.use(bodyParser.json());
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));

app.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT NOW()");
  res.send(`Testing changes here, The time from the DB is ${rows[0].now}`);
});

app.get("/testing", async (req, res) => {
  res.send(`Testing changes here, The time from the DB is`);
});

var users = [
  { name: 'tj' }
  , { name: 'tobi' }
  , { name: 'loki' }
  , { name: 'jane' }
  , { name: 'bandit' }
];

// Convert :to and :from to integers

app.param(['to', 'from'], function(req, res, next, num, name){
  req.params[name] = parseInt(num, 10);
  if( isNaN(req.params[name]) ){
    next(createError(400, 'failed to parseInt '+num));
  } else {
    next();
  }
});

// Load user by id

app.param('user', function(req, res, next, id){
  if (req.user = users[id]) {
    next();
  } else {
    next(createError(404, 'failed to find user'));
  }
});

/**
 * GET index.
 */

app.get('/', function(req, res){
  res.send('Visit /user/0 or /users/0-2');
});

/**
 * GET :user.
 */

app.get('/user/:user', function (req, res) {
  res.send('user ' + req.user.name);
});

/**
 * GET users :from - :to.
 */

app.get('/users/:from-:to', function (req, res) {
  var from = req.params.from;
  var to = req.params.to;
  var names = users.map(function(user){ return user.name; });
  res.send('users ' + names.slice(from, to + 1).join(', '));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
