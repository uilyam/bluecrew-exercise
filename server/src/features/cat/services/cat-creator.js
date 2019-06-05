const bcrypt = require('bcrypt');
const DataLayer = require('../../../services/data-layer');
const { Cat } = require('../entities/cat');

class CatCreator {

  async create({
    birthdate,
    breed,
    imageUrl,
    name,
    password,
    username,
    weight,
  }) {
    const cat = new Cat().withAttributes({ birthdate, breed, imageUrl, name, password, username, weight });
    const validationError = cat.validate();
    if (validationError) {
      return { error: validationError };
    }
    cat.password = await bcrypt.hash(cat.password, 10);
    const query = cat.getPersistanceQuery();
    try {
      const [results, metadata] = await new DataLayer().persist(query);
      return { results };
    } catch (err) {
      return { error: err };
    }
  }
}

module.exports = { CatCreator };