const express = require('express');
const router = express.Router();
const { ValidationError } = require('./entities/cat');
const { CatCreator } = require('./services/cat-creator');
const { CatAuthenticator, UsernameNotFoundError, PasswordInvalidError} = require('./services/cat-authenticator');
const { CatRetriever, InvalidSearchError } = require('./services/cat-retriever');

router.post('/register', async (req, res) => {
  const creator = new CatCreator();
  const { error, results } = await creator.create(req.body);
  if (error instanceof ValidationError) {
    res.status(400);
    return res.send({
      success: false,
      status: 400,
      message: error.message,
    });
  } else if (error) {
    return res.status(500).send({
      success: false,
      status: 500,
      message: error.message,
    });
  } else {
    return res.status(200).send({
      success: true,
      status: 200,
      message: `Created ${req.body.name}!`,
      detail: {
        id: results
      }
    });
  }
});

router.post('/login', async (req, res) => {
  const authenticator = new CatAuthenticator();
  const { error, results } = await authenticator.authenticate(req.body);
  if (error instanceof UsernameNotFoundError) {
    return res.status(404).send({
      success: false,
      status: 404,
      message: error.message,
    });
  } else if (error instanceof PasswordInvalidError) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: error.message,
    });
  } else {
    return res.status(200).send({
      success: true,
      status: 200,
      message: `Welcome back ${results.name}`,
      detail: {
        name: results.name,
        id: results.id,
        authToken: results.authToken,
      },
    });
  }
});

router.post('/', async (req, res) => {
  if (!req.authenticated) {
    return res.status(403).send({
      success: false,
      status: 403,
      message: 'You must be logged in to use this feature.'
    });
  }
  const retriever = new CatRetriever();
  const { error, results } = await retriever.retrieve(req.body);
  if (error instanceof InvalidSearchError) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: error.message
    });
  } else {
    return res.status(200).send({
      success: true,
      status: 200,
      message: `Here is ${results[0].name}`,
      detail: results
    });
  }
});

router.get('/random', async (req, res) => {
  const retriever = new CatRetriever();
  const { error, results } = await retriever.retrieve({ random: true });
  if (error instanceof InvalidSearchError) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: error.message
    });
  } else {
    return res.status(200).send({
      success: true,
      status: 200,
      message: `Here is ${results[0].name}`,
      detail: {
        ...results[0]
      }
    });
  }
});

module.exports = { router };
