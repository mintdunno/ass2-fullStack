const express = require('express');
const vendorRouter = express.Router();
const schema = require("../models/schema");
const Vendor = schema.Vendor;
const Product = schema.Product;

// Vendor Route part
// Route for Vendor homepage
vendorRouter.get("/homepage/:id", async (req, res) => {
    const vendor = await Vendor.findById(req.params.id);
    const products = await Product.find({ vendorUsername: `${vendor.username}` });
    Vendor.findById(req.params.id)
    try {
        res.render("vendor-homepage", { vendor, products });
    } catch (e) {
        console.error(error);
        res.status(501).json({ error: "Server error" });
    }
});

//Get add product page
vendorRouter.get("/addproduct/:id/", (req, res) => {
    Vendor.findById(req.params.id)
        .then((vendor) => {
            res.render("addProduct", { vendor });
        })
        .catch((error) => res.send(error));
});
// CREATE - Create a new products
vendorRouter.post("/products/add/", async (req, res) => {
    const vid = req.body.vendorId
    const productName = req.body.productName;
    const product = new Product({
        name: req.body.productName,
        price: req.body.price,
        description: req.body.description,
        amount: req.body.amount,
        category: req.body.productType,
        vendorUsername: req.body.vendorUsername,
        image: {
            data: req.files.productPIC.data,
            mimeType: req.files.productPIC.mimetype,
        },
    });
    product
        .save()
        .then(() => res.redirect(`/vendor/homepage/${vid}`))
        .catch((error) => res.send(error));
});

// Edit Product
vendorRouter.get("/product/:vid/update/:pid", async (req, res) => {
    const vendor = await Vendor.findById(req.params.vid);
    Product.findById(req.params.pid)
        .then((product) => {
            if (!product) {
                return res.send("The product doesn't exist");
            }
            res.render("update-product", { product, vendor });
        })
});

// Delete Product
// DELETE - Show delete product form
vendorRouter.get("/product/:vid/delete/:pid", async (req, res) => {
    const vendor = await Vendor.findById(req.params.vid);
    Product.findById(req.params.pid)
        .then((product) => {
            if (!product) {
                return res.send("The product doesn't exist");
            }
            res.render("delete-product", { product, vendor });
        })
        .catch((error) => res.send(error));
});
// DELETE - Delete a product by ID
vendorRouter.post("/product/:vid/delete/:pid", async (req, res) => {
    await Product.findByIdAndDelete(req.params.pid)
        .then(() => {
            console.log("product was deleted");
            res.redirect(`/vendor/homepage/${vid}`);
        })
        .catch((error) => res.send(error));
});

//get vendor profile
vendorRouter.get("/profile/:id", async (req, res) => {
    await Vendor.findById(req.params.id)
        .then((vendor) => {
            res.render("vendor-profile", { vendor });
        })
        .catch((error) => res.send(error));
});

//update vendor profile
// Bug when update image
vendorRouter.post("/profile/:id", async (req, res) => {
    await Vendor.findByIdAndUpdate(
        { _id: req.params.id },

        {
            username: req.body.username,
            bName: req.body.bName,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
        },
        { new: true }
    )
        .then(() => {
            console.log("Vendor information changed");
            res.redirect(`/vendor/homepage/${req.params.id}`);
        })
        .catch((error) => console.log(error.message));
});

module.exports = vendorRouter;