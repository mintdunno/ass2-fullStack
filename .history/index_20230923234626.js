const express = require("express");
const app = express();
const port = 6900;
const bcrypt = require("bcryptjs");
const fileUpload = require("express-fileupload");

// Routers
const vendorRoute = require("./routes/vendor");
const loginRoute = require("./routes/login");
const registerRouter = require("./routes/register");
const customerRouter = require("./routes/customer");
const shipperRouter = require("./routes/shipper");

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
//Shipper Part
app.use("/shipper", shipperRouter);


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
