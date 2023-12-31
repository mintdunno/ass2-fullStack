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
const shipperRouter = express.Router();
const schema = require("../models/schema");
const Shipper = schema.Shipper;
const Order = schema.Order;


//ROUTE TO SHIPPER HOMEPAGE
shipperRouter.get("/homepage/:id", async (req, res) => {
    const shipper = await Shipper.findById(req.params.id);
    var orders;
    if (shipper.location === "Ho Chi Minh") {
        orders = await Order.find({ hub: "Ho Chi Minh", status: "active" })
    }
    if (shipper.location === "Da Nang") {
        orders = await Order.find({ hub: "Da Nang", status: "active" })
    }
    if (shipper.location === "Ha Noi") {
        orders = await Order.find({ hub: "Ha Noi", status: "active" })
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

// Update Status for orders
shipperRouter.post("/order/update/:sid", (req, res) => {
    Order.findOneAndUpdate(
        { _id: req.body.orderID },
        { status: req.body.deliveryStatus },
        { new: true }
    )
        .then(() => {
            console.log("The order is updated");
            res.redirect(`/shipper/homepage/${req.params.sid}`);
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