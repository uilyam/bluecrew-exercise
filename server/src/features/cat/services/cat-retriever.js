const bcrypt = require('bcrypt');
const DataLayer = require('../../../services/data-layer');
const { Cat } = require('../entities/cat');

class CatRetriever {

  async retrieve({
    id,
    name,
    username,
    random = false,
  }) {
    if (random) {
      const [results, metadata] = await new DataLayer().retrieve(Cat.getRetrieveRandomQuery());
      if (results.length === 0) {
        return { error: new InvalidSearchError() };
      }
      return { results };
    }
    const [results, metadata] = await new DataLayer().retrieve(Cat.getRetrieveAllQuery({ id, name, username }));
    if (results.length === 0) {
      return { error: new InvalidSearchError() };
    }
    return { results };
  }
}

class InvalidSearchError extends Error {
  constructor() {
    super('The search criteria provided resulted in no records being found or was invalid.');
  }
}

module.exports = { CatRetriever, InvalidSearchError };