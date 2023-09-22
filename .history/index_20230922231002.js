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

//ROUTE TO CUSTOMER HOMEPAGE
app.get("/customer/homepage/:id", async (req, res) => {
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
app.get("/customer/profile/:id", async (req, res) => {
  await Customer.findById(req.params.id)
    .then((customer) => {
      res.render("customer-profile", { customer });
    })
    .catch((error) => res.send(error));
});

//update customer profile //fixing
app.post("/customer/profile/:id", async (req, res) => {
  await Customer.findByIdAndUpdate(
    { _id: req.params.id },

    {
      username: req.body.username,
      fullname: req.body.fullname,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
    },
    { new: true }
  )
    .then(() => {
      console.log("Customer information was succesfully added");
      res.redirect(`/customer/profile/${req.params.id}`);
    })
    .catch((error) => console.log(error.message));
});

//ROUTE TO CART PAGE
app.get("/customer/cart/:id", async (req, res) => {
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
app.post("/customer/cart/:id", async (req, res) => {
  var arr = req.body.orderItems.split(",");
  req.body.orderItems = arr;
  console.log(req.body);
  req.body.status = 'active';
  const order = new Order(req.body);
  order.save()
  res.redirect(`/customer/homepage/${req.params.id}`)
})

// Route to detail page
app.get("/customer/:cid/product/:pid", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.cid);
    const prodDetail = await Product.findById(req.params.pid);
    res.render("product", { prodDetail, customer });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occured" });
  }
});

// Route to search page
app.get("/customer/:cid/search", async (req, res) => {
  const searchTerm = req.query["search-term"];
  const regexPattern = new RegExp(searchTerm, "i");
  const customer = await Customer.findById(req.params.cid);

  Product.find({ name: { $regex: regexPattern } })
    .then((products) => {
      res.render("search", { products, customer });
    })
    .catch((error) => console.log(error.message));
});

// Route to category page
// THERE ARE BUGS IN customer-category that can not route
// ROUTE TO GAMES AND TOYS PAGE

app.get("/customer/:id/category/gamesAndToys", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const products = await Product.find({ category: "Games & Toys" });
    res.render("customer-category", { products, customer });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving category data.");
  }
});

// ROUTE TO Furniture PAGE
app.get("/customer/:id/category/furniture", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const products = await Product.find({ category: "Furniture" });
    res.render("customer-category", { products, customer });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving category data.");
  }
});

// ROUTE TO Fashion PAGE
app.get("/customer/:id/category/fashion", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const products = await Product.find({ category: "Fashion" });
    res.render("customer-category", { products, customer });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving category data.");
  }
});

// ROUTE TO Accessories PAGE
app.get("/customer/:id/category/accessories", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const products = await Product.find({ category: "Accessories" });
    res.render("customer-category", { products, customer });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving category data.");
  }
});

// ROUTE TO Others PAGE
app.get("/customer/:id/category/others", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const products = await Product.find({ category: "Others" });
    res.render("customer-category", { products, customer });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving category data.");
  }
});

// Footer for customer
app.get("/customer/:id/privacy", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.render("customer-privacy", { customer });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving category data.");
  }
});

app.get("/customer/:id/operating", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.render("customer-operating", { customer });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving category data.");
  }
});

app.get("/customer/:id/shipping", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.render("customer-shipping", { customer });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving category data.");
  }
});

app.get("/customer/:id/return", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.render("customer-return", { customer });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving category data.");
  }
});

//ROUTE TO SHIPPER HOMEPAGE
app.get("/shipper/homepage/:id", async (req, res) => {
  try {
    const shipper = await Shipper.findById(req.params.id);
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

//ROUTE TO CUSTOMER PRIVACY PAGE
app.get("/customer/privacy", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  res.render("customer-privacy", { customer });
});

//ROUTE TO CUSTOMER OPERATING PAGE
app.get("/customer/operating", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  res.render("customer-operating", { customer });
});

//ROUTE TO CUSTOMER SHIPPING PAGE
app.get("/customer/shipping", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  res.render("customer-shipping", { customer });
});

//ROUTE TO CUSTOMER RETURN PAGE
app.get("/customer/return", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  res.render("customer-return", { customer });
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
