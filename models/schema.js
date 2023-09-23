const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose
  .connect(
    "mongodb+srv://mint:mint@corner-store.cbiyacl.mongodb.net/Store?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.log(error.message));

const customerSchema = new Schema(
  {
    fullname: String,

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: Number,
      require: true,
    },

    address: String,
    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    profilePicture: {
      data: Buffer,
      mimeType: String,
    },
  },
  { timestamps: true }
);

const vendorSchema = new Schema(
  {
    fullname: String,

    bName: { type: String, required: true, unique: true },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: Number,
      require: true,
    },

    address: { type: String, required: true, unique: true },
    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    profilePicture: {
      data: Buffer,
      mimeType: String,
    },
  },
  { timestamps: true }
);

const shipperSchema = new mongoose.Schema(
  {
    fullname: String,

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: Number,
      require: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Distrubtion gub
    location: {
      type: String,
      required: true,
      enum: ["Ho Chi Minh", "Da Nang", "Ha Noi"],
    },

    profilePicture: {
      data: Buffer,
      mimeType: String,
    },
  },
  { timestamps: true }
);

// There is a strange bug that doesn't allow storing 5 elements in enum
const productCategory = [
  "Games & Toy",
  "Furniture",
  "Fashion",
  "Accessories",
  "Others",
  "nothing",
];
const productSchema = new mongoose.Schema(
  {
    //Name of the product
    name: {
      type: String,
      required: true,
    },
    // Amount
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    // Price
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    // category
    category: {
      type: String,
      required: true,
      enum: productCategory,
    },
    image: {
      data: Buffer,
      mimeType: String,
    },
    description: {
      type: String,
      maxLength: 500,
    },
    vendorUsername: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Define order schema
const orderSchema = new mongoose.Schema({
  orderItems: [String],
  customerAddress: String,
  customerName: String,
  totalPrice: Number,
  customerPhone: Number,
  status: {
    type: String,
    enum: ['active', 'shipped', 'canceled'],
  },
  // Distrubtion gub
  hub: {
    type: String,
    enum: ["Ho Chi Minh", "Da Nang", "Ha Noi"],
  },
    
  },
);

// Define Hub schema



// Create Hub model

// Create Order model
const Order = mongoose.model('Order', orderSchema);
// Create Customer model
const Customer = mongoose.model("Customer", customerSchema);
// Create Product model
const Product = mongoose.model("Product", productSchema);
//Create Vendor model
const Vendor = mongoose.model("Vendor", vendorSchema);
// Create Shipper model
const Shipper = mongoose.model("Shipper", shipperSchema);

// Export models
module.exports = { Customer, Vendor, Shipper, Product, Order };
