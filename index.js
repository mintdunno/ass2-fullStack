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

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(fileUpload());
// Process Post form
app.use(express.urlencoded({ extended: true }));

// Route for login page. Users have to log in to use the website
app.get("/", (req, res) => {
  res.render("login-page");
});

var vid = String;

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
    // Check if username of customer was already taken
    const existedCustomer = await Customer.findOne({ username });
    if (existedCustomer) {
      return res.render("customer-register", error.push("hello"));
    }

    //Check if email of customer was taken
    const existedEmail = await Customer.findOne({ email });
    if (existedEmail) {
      return res.render("customer-register", {
        errorMsg: "This email was taken !!",
      });
    }

    //Check if phone of customer was taken
    const existedPhone = await Customer.findOne({ phone });
    if (existedPhone) {
      return res.render("customer-register", {
        errorMsg: "This phone was taken !!",
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
    const existedVendor = await Vendor.findOne({ username });
    if (existedVendor) {
      return res.render("vendor-register", {
        errorMsg: "This username was taken !!",
      });
    }

    //Check if email of customer was taken
    const existedEmail = await Vendor.findOne({ email });
    if (existedEmail) {
      return res.render("customer-register", {
        errorMsg: "This email was taken !!",
      });
    }

    //Check if phone of customer was taken
    const existedPhone = await Vendor.findOne({ phone });
    if (existedPhone) {
      return res.render("customer-register", {
        errorMsg: "This phone was taken !!",
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
    // Check if username of customer was already taken
    const existedShipper = await Shipper.findOne({ username });
    if (existedShipper) {
      return res.render("customer-register", error.push("hello"));
    }

    //Check if email of customer was taken
    const existedEmail = await Shipper.findOne({ email });
    if (existedEmail) {
      return res.render("customer-register", {
        errorMsg: "This email was taken !!",
      });
    }

    //Check if phone of customer was taken
    const existedPhone = await Shipper.findOne({ phone });
    if (existedPhone) {
      return res.render("customer-register", {
        errorMsg: "This phone was taken !!",
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

// Login part section is here
app.post("/", async (req, res) => {
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
      vid = vendor._id;
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

// Vendor Route part
// Route for Vendor homepage
app.get("/vendor/homepage/:id", async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  const products = await Product.find({ vendorUsername: `${vendor.username}` });
  Vendor.findById(req.params.id);
  try {
    res.render("vendor-homepage", { vendor, products });
  } catch (e) {}
  // .then((vendor) => {
  //   res.render("vendor-homepage", { vendor });
  // })
  // .catch((error) => res.send(error));
});

//Get add product page
app.get("/vendor/addproduct/:id/", (req, res) => {
  Vendor.findById(req.params.id)
    .then((vendor) => {
      res.render("addProduct", { vendor });
    })
    .catch((error) => res.send(error));
});
// CREATE - Create a new products
app.post("/vendor/products/add/", (req, res) => {
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
app.get("/product/:vid/update/:pid", async (req, res) => {
  const vendor = await Vendor.findById(req.params.vid);
  Product.findById(req.params.pid).then((product) => {
    if (!product) {
      return res.send("Not found any product matching the ID!");
    }
    res.render("update-product", { product, vendor });
  });
  //   .catch((error) => res.send(error));
});

//get vendor profile
app.get("/vendor/profile/:id", async (req, res) => {
  await Vendor.findById(req.params.id)
    .then((vendor) => {
      res.render("vendor-profile", { vendor });
    })
    .catch((error) => res.send(error));
});
//update vendor profile
// Bug when update image
app.post("/vendor/profile/:id", async (req, res) => {
  await Vendor.findByIdAndUpdate(
    { _id: req.params.id },

    {
      username: req.body.username,
      businessName: req.body.bName,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
    },
    { new: true }
  )
    .then(() => {
      console.log("Vendor information was succesfully added");
      res.redirect(`/vendor/homepage/${req.params.id}`);
    })
    .catch((error) => console.log(error.message));
});

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

// app.use(fileUpload());
// app.post("/upload-profile-image", (req, res) => {
//   if (!req.files || !req.files.profileImage) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const profileImage = req.files.profileImage;
//   profileImage.mv(__dirname + "/uploads/" + profileImage.name, (err) => {
//     if (err) {
//       return res.status(500).json({ error: "Error uploading file" });
//     }

//     // File uploaded successfully
//     return res.json({ message: "File uploaded successfully" });
//   });
// });

//ROUTE TO CATEGORY PAGE
// app.get("/customer/homepage/category/:category", async (req, res) => {
//   try {
//     const customer = await Customer.findById(req.params.id);
//     let category = req.params.category;
//     const products = await Product.find({ category: category });
//     res.render("customer-category", { products: products });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error retrieving customer data.");
//   }
// });

//ROUTE TO CART PAGE
app.get("/customer/cart/", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    const products = await Product.find({}); // Assuming you have an Order model associated with customers
    res.render("cart", { customer, products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving customer data.");
  }
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

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
