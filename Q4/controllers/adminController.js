const Admin = require('../models/Admin');

exports.getLogin = (req,res) => {
    res.render("admin/login",{ message : req.flash("error") });
};

exports.postLogin = async (req,res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username});
    if(!admin){
        req.flash("error","Invalid Credentials");
        return res.redirect("/admin/login");
    }
    req.session.adminId = admin._id;
    res.redirect("/employees");
};

exports.logout = (req,res) => {
    req.session.destroy();
    res.redirect("/admin/login");
};