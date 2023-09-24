const express = require("express");
const customerRouter = express.Router();
const schema = require("../models/schema");
const Customer = schema.Customer;
const Product = schema.Product;
const Order = schema.Order;

customerRouter.get("/homepage/:id", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id); // Assuming you have a Customer model
        const products = await Product.find({}); // Assuming you have an Order model associated with customers

        res.render("customer-homepage", { customer, products });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving customer data.");
    }
});

//Get customer profile
customerRouter.get("/profile/:id", async (req, res) => {
    await Customer.findById(req.params.id)
        .then((customer) => {
            res.render("customer-profile", { customer });
        })
        .catch((error) => res.send(error));
});

//update customer profile
customerRouter.post("/profile/:id", async (req, res) => {
    let updateData = {
        username: req.body.username,
        fullname: req.body.fullname,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
    };
    // Only update the image if a new image has been uploaded
    if (
        req.files &&
        req.files.profilePicture &&
        req.files.profilePicture.mimetype
    ) {
        updateData.profilePicture = {
            data: req.files.profilePicture.data,
            mimeType: req.files.profilePicture.mimetype,
        };
    }
    await Customer.findByIdAndUpdate({ _id: req.params.id }, updateData, {
        new: true,
    })
        .then(() => {
            console.log("Customer information was succesfully added");
            res.redirect(`/customer/profile/${req.params.id}`);
        })
        .catch((error) => console.log(error.message));
});

//ROUTE TO CART PAGE
customerRouter.get("/cart/:id", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        const products = await Product.find({});
        res.render("cart", { customer: customer, products: products });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving customer data.");
    }
});

// PUSH ORDER FROM CART TO MONGODB
customerRouter.post("/cart/:id", async (req, res) => {
    var arr = req.body.orderItems.split(",");
    req.body.orderItems = arr;
    console.log(req.body);
    req.body.status = "active";
    const order = new Order(req.body);
    order.save();
    res.redirect(`/customer/homepage/${req.params.id}`);
});

// Route to detail page
customerRouter.get("/:cid/product/:pid", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.cid);
        const prodDetail = await Product.findById(req.params.pid);
        res.render("product", { prodDetail, customer });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error occured" });
    }
});

// Route to search page
customerRouter.get("/:cid/search", async (req, res) => {
    const searchTerm = req.query["search-term"];
    const regexPattern = new RegExp(searchTerm, "i");
    const customer = await Customer.findById(req.params.cid);

    await Product.find({ name: { $regex: regexPattern } })
        .then((products) => {
            res.render("search", { products, customer });
        })
        .catch((error) => console.log(error.message));
});

// Price filter
customerRouter.post("/priceFilter", async (req, res) => {
    const min = req.body.min;
    const max = req.body.max;
    const cid = req.body.customerID
    const customer = await Customer.findById(cid);

    await Product.find({
        price: {
            $gte: min,
            $lte: max
        }
    })
        .then((products) => {

        })
});

// Route to category page
// THERE ARE BUGS IN customer-category that can not route
// ROUTE TO GAMES AND TOYS PAGE

customerRouter.get("/:id/category/gamesAndToys", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        const products = await Product.find({ category: "Games" });
        const category = "Games & Toys";
        res.render("customer-category", { products, customer, category });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving category data.");
    }
});

// ROUTE TO Furniture PAGE
customerRouter.get("/:id/category/furniture", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        const products = await Product.find({ category: "Furniture" });
        const category = "Furniture";
        res.render("customer-category", { products, customer, category });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving category data.");
    }
});

// ROUTE TO Fashion PAGE
customerRouter.get("/:id/category/fashion", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        const products = await Product.find({ category: "Fashion" });
        const category = "Fashion";
        res.render("customer-category", { products, customer, category });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving category data.");
    }
});

// ROUTE TO Accessories PAGE
customerRouter.get("/:id/category/accessories", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        const products = await Product.find({ category: "Accessories" });
        const category = "Accessories";
        res.render("customer-category", { products, customer, category });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving category data.");
    }
});

// ROUTE TO Others PAGE
customerRouter.get("/:id/category/others", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        const products = await Product.find({ category: "Others" });
        const category = "Others";
        res.render("customer-category", { products, customer, category });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving category data.");
    }
});

// Footer for customer
customerRouter.get("/:id/privacy", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        res.render("customer-privacy", { customer });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving category data.");
    }
});

customerRouter.get("/:id/operating", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        res.render("customer-operating", { customer });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving category data.");
    }
});

customerRouter.get("/:id/shipping", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        res.render("customer-shipping", { customer });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving category data.");
    }
});

customerRouter.get("/:id/return", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        res.render("customer-return", { customer });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving category data.");
    }
});

module.exports = customerRouter;
