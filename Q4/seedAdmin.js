const mongoose = require('mongoose');
const Admin = require('./models/Admin'); // Adjust the path if needed

mongoose.connect('mongodb://localhost:27017/erp')
    .then(async () => {
        const username = 'admin';
        const plainPassword = 'admin';

        const newAdmin = new Admin({ username, password: plainPassword }); // ✅ NO hashing here

        await newAdmin.save();
        console.log("✅ Admin created: username=admin, password=admin");
        mongoose.disconnect();
    })
    .catch(err => console.error(err));
