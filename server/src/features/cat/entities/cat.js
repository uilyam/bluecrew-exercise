const Sequelize = require('sequelize');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const DataLayer = require('../../../services/data-layer');

const ATTRIBUTES = [
  'birthdate',
  'breed',
  'identity',
  'imageUrl',
  'name',
  'password',
  'username',
  'weight',
];

class Cat {

  withAttributes({
    birthdate,
    breed,
    identity,
    imageUrl,
    name,
    password,
    username,
    weight,
  }) {
    this.birthdate = birthdate;
    this.breed = breed;
    this.identity = identity;
    this.imageUrl = imageUrl;
    this.name = name;
    this.password = password;
    this.username = username;
    this.weight = weight;
    return this;
  }

  validate() {
    const { error } = Joi.validate(this, schema);
    if (error) {
      return new ValidationError(error.details[0].message);
    }
  }

  getPersistanceQuery() {
    const names = this.getSetAttributesNames();
    const values = this.getFormatedAttributeValues(names);

    if (this.identity) {
      ``
    } else {
      return `INSERT INTO cats (${names}) VALUES (${values});`.trim();
    }
  }

  getFindUsernameByQuery() {
    return `
      SELECT id, username, password, name FROM cats
      WHERE username = '${this.username}';`;
  }

  getSetAttributesNames() {
    return ATTRIBUTES.filter((attribute) => {
      return this[attribute] !== undefined;
    });
  }

  getFormatedAttributeValues(attributes) {
    return attributes.map(attribute => `'${this[attribute]}'`).join(',');
  }

  static sync() {
    return model.sync({ force: true });
  }

  static getRetrieveRandomQuery() {
    return `
    SELECT imageUrl, name, breed FROM cats 
    ORDER BY RAND() 
    LIMIT 1;`;
  }

  static getRetrieveAllQuery({ id, name, username }) {
    const idFilter = id ? `id = '${id}'` : `id != ''`;
    const nameFilter = name ? `name = '${name}'` : `name != ''`;
    const usernameFilter = username ? `username = '${username}'` : `username != ''`;
    return `
      SELECT birthdate, breed, username, id, imageUrl, name FROM cats 
      WHERE ${idFilter} AND ${nameFilter} AND ${usernameFilter};`;
  }
}

const model = new DataLayer().define('cat', {
  birthdate: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  breed: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  lastSeenAt: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  weight: {
    type: Sequelize.FLOAT,
    allowNull: false,
  }
}, {
  // options
});

const schema = Joi.object().keys({
  birthdate:  Joi.number().integer(),
  breed: Joi.string(),
  identity: Joi.string(),
  imageUrl: Joi.string(),
  name: Joi.string().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/).required(),
  username: Joi.string().email({ minDomainSegments: 2 }).required(),
  weight:  Joi.number().required(),
});

class ValidationError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = { Cat, ValidationError, model, schema };