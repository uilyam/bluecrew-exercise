require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { router } = require('./features/cat');
const { Cat } = require('./features/cat/entities/cat');
const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  try { 
    const token = req.headers.authorization.split(" ")[1]
    jwt.verify(token, process.env.TOKEN, (err, payload) => {
        if (payload) {
          req.authenticated = true;
        } else {
          req.authenticated = false;
        }
        next()
    })
  } catch (e) {
    req.authenticated = false;
    next()
  }
})
app.use('/cats', router);

Cat.sync(); // Overwrite db with empty models.
app.listen(8000, () => console.log(`Example app listening on port ${8000}!`));