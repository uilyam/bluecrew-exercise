const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DataLayer = require('../../../services/data-layer');
const { Cat } = require('../entities/cat');

class CatAuthenticator {

  async authenticate({
    username,
    password,
  }) {
    const cat = new Cat().withAttributes({ username });
    try {
      const [results, metadata] = await new DataLayer().persist(cat.getFindUsernameByQuery());

      if (results.length === 0) {
        return { error: new UsernameNotFoundError(username)};
      }

      const res = await bcrypt.compare(password, results[0].password);
      if (!res) {
        return { error: new PasswordInvalidError() };
      }
      return { 
        results: {
          id: results[0].id,
          name: results[0].name,
          authToken: jwt.sign({ id: results[0].id }, process.env.TOKEN),
        }
      };
    } catch (err) {
      return { error: err };
    }
  }
}

class UsernameNotFoundError extends Error {
  constructor(username) {
    super(`The ${username} was not found.`);
  }
}

class PasswordInvalidError extends Error {
  constructor() {
    super(`The password provided is invalid.`);
  }
}
module.exports = { CatAuthenticator, UsernameNotFoundError, PasswordInvalidError };