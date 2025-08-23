// createUser.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Employee = require('./models/Employee');

mongoose.connect('mongodb://localhost:27017/employeesite')
  .then(async () => {
    const hashedPassword = await bcrypt.hash('123', 10); 
    const newUser = new Employee({
      name: 'Test User',
      email: 'akash123@gmail.com',
      password: hashedPassword
    });

    await newUser.save();
    console.log(' User created successfully');
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
