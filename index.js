const express = require("express");
const app = express();
const port = 3000;
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
app.get("/vendor/homepage/:id", (req, res) => {
  Vendor.findById(req.params.id)
    .then((vendor) => {
      res.render("vendor-homepage", { vendor });
    })
    .catch((error) => res.send(error));
});

//Get add product page
app.get("/vendor/addproduct/:id", (req, res) => {
  Vendor.findById(req.params.id)
    .then((vendor) => {
      res.render("addProduct", { vendor });
    })
    .catch((error) => res.send(error));
});
//add product
app.post("/vendor/addproduct/:id", (req, res) => {
  Vendor.findById(req.params.id)
    .then((vendor) => {
      res.render("addProduct", { vendor });
    })
    .catch((error) => res.send(error));
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
app.post("/vendor/profile/:id", (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["bName", "email", "phone", "address"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  // if (!isValidOperation) {
  //   return res.send({ error: "Invalid updates!" });
  // }
  Vendor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((vendor) => {
      if (!vendor) {
        return res.send("Not found this user");
      }
      res.render("vendor-profile");
    })
    .catch((error) => res.send(error));
});


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

