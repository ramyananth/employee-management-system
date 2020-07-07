var seeder = require('mongoose-seed');
var db = require('./config/keys_dev');
const User = require('./models/Users');

seeder.connect(db.mongoUri, function () {
  // Load Mongoose models
  seeder.loadModels(__dirname, './models/Users');

  // Clear specified collections
  seeder.clearModels(['User'], function () {
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function () {
      seeder.disconnect();
    });
  });
});

const data = [
  {
    name: 'Admin',
    email: 'test@test.com',
    password: 'password',
    role: 'admin',
  },
  {
    name: 'Employee A',
    email: 'rananth2@ncsu.edu',
    password: 'password',
    role: 'employee',
  },
];
