const express = require('express');
const registerRouter = express.Router();
const schema = require("../models/schema");
const Customer = schema.Customer;
const Vendor = schema.Vendor;
const Shipper = schema.Shipper;
const bcrypt = require("bcryptjs");


registerRouter.get("/register/customer", (req, res) => {
    res.render("customer-register");
});

app.post("/register/customer", async (req, res) => {
    try {
        const {
            fullname,
            email,
            phone,
            address,
            username,
            password,
            profilePicture,
        } = req.body;
        // Check if username of vendor is already taken
        let errors = [];
        const existedUser = await Customer.findOne({ username });
        if (existedUser) {
            errors.push("This username was taken !!");
        }

        //Check if email of customer was taken
        const existedEmail = await Customer.findOne({ email });
        if (existedEmail) {
            errors.push("This email was taken !!");
        }

        //Check if phone of customer was taken
        const existedPhone = await Customer.findOne({ phone });
        if (existedPhone) {
            errors.push("This phone was taken !!");
        }

        if (errors.length > 0) {
            return res.render("customer-register", {
                errors,
            });
        }

        // Create Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const customer = new Customer({
            fullname,
            email,
            phone,
            address,
            username,
            password: hashedPassword,
            profilePicture: {
                data: req.files.profilePicture.data,
                mimeType: req.files.profilePicture.mimetype,
            },
        });
        await customer.save();

        //redirected to login page
        res.redirect("/");
    } catch (error) {
        console.error(error.message);
        res.status(501).json({ error: "Server error" });
    }
});

// sign up for vendor
app.get("/register/vendor", (req, res) => {
    res.render("vendor-register");
});

app.post("/register/vendor", async (req, res) => {
    try {
        const {
            fullname,
            bName,
            email,
            phone,
            address,
            username,
            password,
            profilePicture,
        } = req.body;
        // Check if username of vendor is already taken
        let errors = [];
        const existedVendor = await Vendor.findOne({ username });
        if (existedVendor) {
            errors.push("This username was taken !!");
        }

        //Check if email of customer was taken
        const existedEmail = await Vendor.findOne({ email });
        if (existedEmail) {
            errors.push("This email was taken !!");
        }

        //Check if phone of customer was taken
        const existedPhone = await Vendor.findOne({ phone });
        if (existedPhone) {
            errors.push("This phone was taken !!");
        }
        //Check if bussiness name of customer was taken
        const existedBName = await Vendor.findOne({ bName: bName });
        if (existedBName) {
            errors.push("This bussiness name was taken !!");
        }

        const existedAddress = await Vendor.findOne({ address: address });
        if (existedAddress) {
            errors.push("This bussiness address  was taken !!");
        }

        if (errors.length > 0) {
            return res.render("vendor-register", {
                errors,
            });
        }

        // Create Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const vendor = new Vendor({
            fullname,
            bName,
            email,
            phone,
            address,
            username,
            password: hashedPassword,
            profilePicture: {
                data: req.files.profilePicture.data,
                mimeType: req.files.profilePicture.mimetype,
            },
        });
        await vendor.save();

        //redirected to login page
        res.redirect("/");
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
    }
});
// Register for shipper
app.get("/register/shipper", (req, res) => {
    res.render("shipper-register");
});

app.post("/register/shipper", async (req, res) => {
    try {
        const {
            fullname,
            email,
            phone,
            address,
            username,
            password,
            location,
            profilePicture,
        } = req.body;
        // Check if username of vendor is already taken
        let errors = [];
        const existedUser = await Shipper.findOne({ username });
        if (existedUser) {
            errors.push("This username was taken !!");
        }

        //Check if email of customer was taken
        const existedEmail = await Shipper.findOne({ email });
        if (existedEmail) {
            errors.push("This email was taken !!");
        }

        //Check if phone of customer was taken
        const existedPhone = await Shipper.findOne({ phone });
        if (existedPhone) {
            errors.push("This phone was taken !!");
        }

        if (errors.length > 0) {
            return res.render("shipper-register", {
                errors,
            });
        }

        // Create Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const shipper = new Shipper({
            fullname,
            email,
            phone,
            address,
            username,
            password: hashedPassword,
            location,
            profilePicture: {
                data: req.files.profilePicture.data,
                mimeType: req.files.profilePicture.mimetype,
            },
        });
        await shipper.save();

        //redirected to login page
        res.redirect("/");
    } catch (error) {
        console.error(error.message);
        res.status(501).json({ error });
    }
});

module.exports = registerRouter;