const express = require('express');
const shipperRouter = express.Router();
const schema = require("../models/schema");
const Shipper = schema.Shipper;
const Order = schema.Order;


//ROUTE TO SHIPPER HOMEPAGE
shipperRouter.get("/homepage/:id", async (req, res) => {
    const shipper = await Shipper.findById(req.params.id);
    var orders;
    if (shipper.location === "Ho Chi Minh") {
        orders = await Order.find({ hub: "Ho Chi Minh" })
    }
    if (shipper.location === "Da Nang") {
        orders = await Order.find({ hub: "Da Nang" })
    }
    if (shipper.location === "Ha Noi") {
        orders = await Order.find({ hub: "Ha Noi" })
    }
    try {
        res.render("shipper-homepage", { shipper, orders });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving shipper data.");
    }
});

//Get shipper profile
shipperRouter.get("/profile/:id", async (req, res) => {
    await Shipper.findById(req.params.id)
        .then((shipper) => {
            res.render("shipper-profile", { shipper });
        })
        .catch((error) => res.send(error));
});

//update shipper profile
shipperRouter.post("/profile/:id", async (req, res) => {
    let updateData = {
        username: req.body.username,
        fullname: req.body.fullname,
        phone: req.body.phone,
        email: req.body.email,
        location: req.body.location
    }
    // Only update the image if a new image has been uploaded
    if (req.files && req.files.profilePicture && req.files.profilePicture.mimetype) {
        updateData.profilePicture = {
            data: req.files.profilePicture.data,
            mimeType: req.files.profilePicture.mimetype
        };
    }
    await Shipper.findByIdAndUpdate(
        { _id: req.params.id },
        updateData,
        { new: true }
    )
        .then(() => {
            console.log("Shipper information was succesfully added");
            res.redirect(`/shipper/homepage/${req.params.id}`);
        })
        .catch((error) => console.log(error.message));
});


//ROUTE TO SHIPPER PRIVACY PAGE
shipperRouter.get("/:id/privacy", async (req, res) => {
    const shipper = await Shipper.findById(req.params.id);

    res.render("shipper-privacy", { shipper });
});

//ROUTE TO SHIPPER OPERATING PAGE
shipperRouter.get("/:id/operating", async (req, res) => {
    const shipper = await Shipper.findById(req.params.id);

    res.render("shipper-operating", { shipper });
});

//ROUTE TO SHIPPER SHIPPING PAGE
shipperRouter.get("/:id/shipping", async (req, res) => {
    const shipper = await Shipper.findById(req.params.id);

    res.render("shipper-shipping", { shipper });
});

//ROUTE TO SHIPPER RETURN PAGE
shipperRouter.get("/:id/return", async (req, res) => {
    const shipper = await Shipper.findById(req.params.id);

    res.render("shipper-return", { shipper });
});

module.exports = shipperRouter