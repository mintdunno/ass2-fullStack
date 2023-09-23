const express = require('express');
const shipperRouter = express.Router();
const schema = require("../models/schema");
const Customer = schema.Customer;
const Vendor = schema.Vendor;
const Shipper = schema.Shipper;
const Product = schema.Product;
const Order = schema.Order;