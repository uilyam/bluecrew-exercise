const Sequelize = require('sequelize');


const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD, 
  {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql'
});

sequelize
.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});

class DataLayer {

  retrieve(query) {
    return sequelize.query(query);
  }

  persist(query) {
    return sequelize.query(query);
  }

  define(name, attrs, options) {
    return sequelize.define(name, attrs, options);
  }

  sync(model) {
    return model.sync({ force: true });
  }
}

module.exports = DataLayer;