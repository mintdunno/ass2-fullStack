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

// Routers
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
app.get("/register/customer", (req, res) => {
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
  req.body.state = 'active';
  const order = new Order(req.body);
  order.save()
  randHub = await Hub.aggregate([{ "$sample": { "size": 1 } }])
  console.log(randHub);
  await Hub.findByIdAndUpdate(randHub, { $push: { orderID: order._id } })
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
app.get("/customer/:cid/search", (req, res) => {
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
  a
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
