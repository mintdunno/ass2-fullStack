const express = require('express');
const loginRouter = express.Router();
const schema = require("../models/schema");
const Customer = schema.Customer;
const Vendor = schema.Vendor;
const Shipper = schema.Shipper;
const bcrypt = require("bcryptjs");

// Route for login page. Users have to log in to use the website
loginRouter.get("/", (req, res) => {
    res.render("login-page");
});

// Login part section is here
loginRouter.post("/", async (req, res) => {
    try {
        const { username, password, role } = req.body;

        //Check the customer Database
        if (role == "Customer") {
            const customer = await Customer.findOne({ username });
            // IF account doesn't exist
            if (!customer) {
                return res.render("login-page", {
                    errorMsg: "Invalid username or password",
                });
            }
            // Compare both password by using harspass
            const passwordMatch = await bcrypt.compare(password, customer.password);

            // Redirect to login page if password is wrong
            if (!passwordMatch) {
                return res.render("login-page", {
                    errorMsg: "Invalid username or password",
                });
            }

            //Access homepage by ID
            res.redirect(`/customer/homepage/${customer._id}`);
        }

        //Check the Vendor Database
        if (role == "Vendor") {
            const vendor = await Vendor.findOne({ username });
            // IF account doesn't exist
            if (!vendor) {
                return res.render("login-page", {
                    errorMsg: "Invalid username or password",
                });
            }
            // Compare both password by using harspass
            const passwordMatch = await bcrypt.compare(password, vendor.password);

            // Redirect to login page if password is wrong
            if (!passwordMatch) {
                return res.render("login-page", {
                    errorMsg: "Invalid username or password",
                });
            }

            //Access homepage by ID
            const vid = vendor._id;
            res.redirect(`/vendor/homepage/${vendor._id}`);
        }

        //check Shipper Database
        // Shipper now doesn't database
        if (role == "Shipper") {
            const shipper = await Shipper.findOne({ username });
            // IF account doesn't exist
            if (!shipper) {
                return res.render("login-page", {
                    errorMsg: "Invalid username or password",
                });
            }
            // Compare both password by using harspass
            const passwordMatch = await bcrypt.compare(password, shipper.password);

            // Redirect to login page if password is wrong
            if (!passwordMatch) {
                return res.render("login-page", {
                    errorMsg: "Invalid username or password",
                });
            }

            //Access homepage by ID
            const id = shipper._id;
            res.redirect(`/shipper/homepage/${id}#product-page`);
        }
    } catch (error) {
        console.error(error);
        res.status(501).json({ error: "Server error" });
    }
});