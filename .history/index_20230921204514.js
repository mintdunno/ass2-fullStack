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
const Hub = schema.Hub;

//Use Routes
// Vendor Route
const vendorRoute = require("./routes/vendor");
const loginRoute = require("./routes/login");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(fileUpload());
// Process Post form
app.use(express.urlencoded({ extended: true }));

// Route for login page. Users have to log in to use the website
// Login part section is here
app.use("/", loginRoute);

//Sign UP section
// For customer
app.get("/customer/register", (req, res) => {
  res.render("customer-register");
});

app.post("/customer/register", async (req, res) => {
  try {
    const {
      fullName,
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
      fullName,
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
app.get("/vendor/register", (req, res) => {
  res.render("vendor-register");
});

app.post("/vendor/register", async (req, res) => {
  try {
    const {
      fullName,
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
    const existedBName = await Vendor.findOne({ bName });
    if (existedBName) {
      errors.push("This bussiness name was taken !!");
    }

    const existedAddress = await Vendor.findOne({ address });
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
      fullName,
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
app.get("/shipper/register", (req, res) => {
  res.render("shipper-register");
});

app.post("/shipper/register", async (req, res) => {
  try {
    const {
      fullName,
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
      fullName,
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

// Vendor Route part
// Route for Vendor homepage
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
app.get("/customer/homepage/profile/:id", async (req, res) => {
  await Customer.findById(req.params.id)
    .then((customer) => {
      res.render("customer-profile", { customer });
    })
    .catch((error) => res.send(error));
});

//update customer profile
app.post("/customer/homepage/profile/:id", async (req, res) => {
  await Customer.findByIdAndUpdate(
    { _id: req.params.id },

    {
      username: req.body.username,
      name: req.body.fullname,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
    },
    { new: true }
  )
    .then(() => {
      console.log("Customer information was succesfully added");
      res.redirect(`/customer/homepage/${req.params.id}`);
    })
    .catch((error) => console.log(error.message));
});

//ROUTE TO CART PAGE
app.get("/customer/cart/", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const products = await Product.find({}); // Assuming you have an Order model associated with customers
    res.render("cart", { customer: Customer, products: Product });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving customer data.");
  }
});

// Cart page post
app.post("/customer/cart/", async (req, res) => {
  var arr = req.body.orderItems.split(",");
  req.body.orderItems = arr;
  console.log(req.body);
  req.body.state = "active";
  const order = new Order(req.body);
  order.save();
  randHub = await Hub.aggregate([{ $sample: { size: 1 } }]);
  console.log(randHub);
  await Hub.findByIdAndUpdate(randHub, { $push: { orderID: order._id } });
  res.redirect("/");
});

// Route to detail page
app.get("/product/:id", async (req, res) => {
  try {
    let productId = req.params.id;
    const customer = await Customer.findById(req.params.id);
    const prodDetail = await Product.findById(productId);
    res.render("product", { prodDetail, customer });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occured" });
  }
});

// Route to search page
app.get("/search", (req, res) => {
  const searchTerm = req.query["search-term"];
  const regexPattern = new RegExp(searchTerm, "i");
  const customer = Customer.findById(req.params.id);

  Product.find({ name: { $regex: regexPattern } })
    .then((products) => {
      res.render("search", { products, customer });
    })
    .catch((error) => console.log(error.message));
});

// Route to category page
// THERE ARE BUGS IN customer-category that can not route
// ROUTE TO GAMES AND TOYS PAGE
app.get("/customer/homepage/category/gamesAndToys", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const products = await Product.find({ category: "Games & Toys" });
    res.render("customer-category", { products, category: "Games & Toys" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving category data.");
  }
});

// ROUTE TO Furniture PAGE
app.get("/customer/homepage/category/furniture", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const products = await Product.find({ category: "Furniture" });
    res.render("customer-category", { products, category: "Furniture" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving category data.");
  }
});

// ROUTE TO Fashion PAGE
app.get("/customer/homepage/category/fashion", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const products = await Product.find({ category: "Fashion" });
    res.render("customer-category", { products, category: "Fashion" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving category data.");
  }
});

// ROUTE TO Accessories PAGE
app.get("/customer/homepage/category/accessories", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const products = await Product.find({ category: "Accessories" });
    res.render("customer-category", { products, category: "Accessories" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving category data.");
  }
});

// ROUTE TO Others PAGE
app.get("/customer/homepage/category/others", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const products = await Product.find({ category: "Others" });
    res.render("customer-category", { products, category: "Others" });
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

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
