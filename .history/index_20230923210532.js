const express = require("express");
const app = express();
const port = 6900;
const bcrypt = require("bcryptjs");
const fileUpload = require("express-fileupload");
const schema = require("./models/schema");
const Customer = schema.Customer;
const Vendor = schema.Vendor;
const Shipper = schema.Shipper;
const Product = schema.Product;
const Order = schema.Order;


// Routers
const vendorRoute = require("./routes/vendor");
const loginRoute = require("./routes/login");
const registerRouter = require("./routes/register");
const customerRouter = require("./routes/customer");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(fileUpload());
// Process Post form
app.use(express.urlencoded({ extended: true }));

// Route for login page. Users have to log in to use the website
// Login part section is here
app.use("/", loginRoute);
// Route for register page
app.use("/register", registerRouter);
// Vendor Route part
app.use("/vendor", vendorRoute);
//Customer Part
app.use("/customer", customerRouter);


//ROUTE TO SHIPPER HOMEPAGE
app.get("/shipper/homepage/:id", async (req, res) => {
  try {
    const shipper = await Shipper.findById(req.params.id);
    if (shipper.location === "Da Nang") {
      const Orders = Order.find({ hub: "Ho Chi Minh" })
    }
    const products = await Product.find({});

    res.render("shipper-homepage", { shipper, products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving customer data.");
  }
});

//Get shipper profile
app.get("/shipper/homepage/profile/:id", async (req, res) => {
  await Shipper.findById(req.params.id)
    .then((shipper) => {
      res.render("shipper-profile", { shipper });
    })
    .catch((error) => res.send(error));
});

//update shipper profile
app.post("/shipper/homepage/profile/:id", async (req, res) => {
  await Shipper.findByIdAndUpdate(
    { _id: req.params.id },

    {
      username: req.body.username,
      name: req.body.fullname,
      phone: req.body.phone,
      email: req.body.email,
    },
    { new: true }
  )
    .then(() => {
      console.log("Shipper information was succesfully added");
      res.redirect(`/shipper/homepage/${req.params.id}`);
    })
    .catch((error) => console.log(error.message));
});

//ROUTE TO SHIPPER PRIVACY PAGE
app.get("/shipper/privacy", async (req, res) => {
  const shipper = await Shipper.findById(req.params.id);

  res.render("shipper-privacy", { shipper });
});

//ROUTE TO SHIPPER OPERATING PAGE
app.get("/shipper/operating", async (req, res) => {
  const shipper = await Shipper.findById(req.params.id);

  res.render("shipper-operating", { shipper });
});

//ROUTE TO SHIPPER SHIPPING PAGE
app.get("/shipper/shipping", async (req, res) => {
  const shipper = await Shipper.findById(req.params.id);

  res.render("shipper-shipping", { shipper });
});

//ROUTE TO SHIPPER RETURN PAGE
app.get("/shipper/return", async (req, res) => {
  const shipper = await Shipper.findById(req.params.id);

  res.render("shipper-return", { shipper });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
