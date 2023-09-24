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
const mongoose = require("./mongoose")
const Schema = mongoose.Schema;

//Customer Schema
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

// Vendor Schema
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

// Shipper Schema
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
  "Games",
  "Furniture",
  "Fashion",
  "Accessories",
  "Others",
  "nothing",
];

//Product Schema
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
