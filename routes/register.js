/*RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023B
Assessment: Assignment 2
Author/ID: 
Phan Anh Khoi S3980639
Tran Minh Hoang S3975086
Nguyen Thi Hoang Yen S3930002
Le Tuan Kiet S3965654
Tran Minh S3911737

Acknowledgment: 

TheCornerStore logo: Image generated using Bing Image Creator from the prompt lettermark logo for the TheCornerStore website

Images:
The Craft House (n.d.) Product images [product], The Craft House website, accessed 23 September, 2023. https://thecrafthouse.vn/

AConcept Vietnam (2021). Furniture images [furniture], AConcept Vietnam website. Accessed 20 September 2023. https://aconcept-vn.com/vi/

Amazon (n.d.). Product images [product], Amazon website. Accessed 20 September 2023.https://www.amazon.com/ 

Text in footer’s static pages: OpenAI (2023) ChatGPT (August 3 version) [Large language model], accessed 23 September, 2023. https://chat.openai.com

Product description:
The Craft House (n.d.) Product detail, The Craft House website, accessed 23 September, 2023. https://thecrafthouse.vn/

OpenAI (2023) ChatGPT (August 3 version) [Large language model], accessed 23 September, 2023. https://chat.openai.com
 */

const express = require('express');
const registerRouter = express.Router();
const schema = require("../models/schema");
const Customer = schema.Customer;
const Vendor = schema.Vendor;
const Shipper = schema.Shipper;
const bcrypt = require("bcryptjs");


registerRouter.get("/customer", (req, res) => {
    res.render("customer-register");
});

registerRouter.post("/customer", async (req, res) => {
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
registerRouter.get("/vendor", (req, res) => {
    res.render("vendor-register");
});

registerRouter.post("/vendor", async (req, res) => {
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
registerRouter.get("/shipper", (req, res) => {
    res.render("shipper-register");
});

registerRouter.post("/shipper", async (req, res) => {
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