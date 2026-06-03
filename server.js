const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vocabay';
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    prepopulateCatalog();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// ==========================================
// SCHEMAS & MODELS
// ==========================================

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, default: 'customer' }, // 'customer', 'admin', 'vendor'
  status: { type: String, default: 'approved' }, // 'approved', 'banned'
  shopName: { type: String },
  description: { type: String },
  category: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  sizes: { type: [String], required: true },
  vendor: { type: String, default: 'VocaBay System' },
  timestamp: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true },
  date: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  paymentId: { type: String, default: 'N/A' },
  total: { type: Number, required: true },
  timestamp: { type: Number, required: true },
  shipping: {
    name: { type: String, required: true },
    address: { type: String, required: true }
  },
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      size: { type: String, required: true },
      quantity: { type: Number, required: true }
    }
  ]
});

const vendorRequestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  shopName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, default: 'pending' }, // 'pending', 'approved', 'rejected'
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const VendorRequest = mongoose.model('VendorRequest', vendorRequestSchema);

// ==========================================
// PRE-POPULATE CATALOG
// ==========================================

const STATIC_PRODUCTS = [
  {
    id: "prod-1",
    name: "Nebula SoundPulse Headset",
    category: "Electronics",
    price: 8499,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    description: "Premium over-ear wireless audio. Experience rich spatial soundwaves, hybrid active noise cancellation (ANC), and up to 40 hours of high-fidelity playback. Finished in dark titanium carbon.",
    sizes: ["Standard"]
  },
  {
    id: "prod-2",
    name: "Core Leather Chrono Watch",
    category: "Accessories",
    price: 12999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    description: "Elegant minimalist design. Features a sapphire crystal dial glass, precision Japanese quartz movement, and double-stitched genuine Italian black leather straps. Water-resistant up to 50m.",
    sizes: ["Standard"]
  },
  {
    id: "prod-3",
    name: "AeroWeave Active Jacket",
    category: "Apparel",
    price: 4999,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
    description: "Ultra-breathable lightweight performance outerwear. Features dynamic windproof layers, thermal-reflective grid lining, and deep utility zipper pockets. Crafted from eco-friendly recycled yarn.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "prod-4",
    name: "Velocity Knit Trainer",
    category: "Footwear",
    price: 7499,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    description: "High-rebound street running shoes. Designed with an adaptive 3D-engineered knit upper, premium cushioned cloud-foam insoles, and high-traction carbon rubber outsoles. Tailored for absolute agility.",
    sizes: ["7", "8", "9", "10"]
  },
  {
    id: "prod-5",
    name: "Apex Ergonomic Backpack",
    category: "Accessories",
    price: 3899,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    description: "Minimalist waterproof commuting packs. Contains an armored 16-inch laptop chamber, TSA-approved quick lay-flat opening, and magnetic Fidlock secure strap systems.",
    sizes: ["Standard"]
  },
  {
    id: "prod-6",
    name: "Opal Glass Water Flask",
    category: "Accessories",
    price: 1899,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
    description: "Double-walled vacuum insulated obsidian hydration flask. Holds liquids ice-cold for 24 hours or steaming hot for 12 hours. Textured matte powder grip surface with a medical-grade steel lid.",
    sizes: ["Standard"]
  },
  {
    id: "prod-7",
    name: "Luxe Cotton Slim Shirt",
    category: "Apparel",
    price: 2999,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
    description: "Crafted from long-staple Egyptian cotton. Tailored in a modern, streamlined silhouette with mother-of-pearl buttons. Wrinkle-resistant finish makes it an easy-wash wardrobe essential.",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "prod-8",
    name: "Titanium Cyber Sunglasses",
    category: "Accessories",
    price: 9499,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
    description: "Unbreakable aerospace titanium wire frames. Featuring polarized HD UV400 lenses with multi-layered mirror coating. Designed with ultra-light flex-hinges for perfect ergonomic comfort.",
    sizes: ["Standard"]
  }
];

async function prepopulateCatalog() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(STATIC_PRODUCTS);
      console.log('Successfully pre-populated e-commerce catalog with static products.');
    }
  } catch (err) {
    console.error('Error pre-populating e-commerce catalog:', err);
  }
}

// ==========================================
// REST API ENDPOINTS
// ==========================================

// --- AUTHENTICATION ---

// Registration
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone, role, shopName, description, category } = req.body;
  try {
    // Duplicate check
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email address already registered!' });
    }

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: role || 'customer',
      status: 'approved',
      shopName,
      description,
      category
    });

    await newUser.save();
    res.status(201).json({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user.', error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Admin Credentials bypass check
    if (email.toLowerCase() === 'admin@vocabay.com' && password === 'admin123') {
      return res.status(200).json({
        name: 'System Administrator',
        email: 'admin@vocabay.com',
        role: 'admin'
      });
    }

    // 2. Fetch User
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password!' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ message: 'Your merchant account has been suspended by the administrator.' });
    }

    res.status(200).json({
      name: user.role === 'vendor' ? user.shopName : user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    });
  } catch (err) {
    res.status(500).json({ message: 'Error authenticating user.', error: err.message });
  }
});

// Mock OTP Generation
app.post('/api/auth/request-otp', (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  res.status(200).json({ otp });
});

// --- PRODUCTS CATALOG ---

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ timestamp: 1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving products.', error: err.message });
  }
});

// Add new product
app.post('/api/products', async (req, res) => {
  const { name, category, price, image, description, sizes, vendor } = req.body;
  try {
    const productId = 'prod-' + Math.floor(10000 + Math.random() * 90000);
    const newProduct = new Product({
      id: productId,
      name,
      category,
      price: parseInt(price),
      image,
      description,
      sizes: sizes || ['Standard'],
      vendor: vendor || 'VocaBay System'
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Error listing product.', error: err.message });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Product.deleteOne({ id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(200).json({ message: 'Product successfully deleted from catalog.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product.', error: err.message });
  }
});

// --- ORDERS SYSTEM ---

// Get all orders (or user specific)
app.get('/api/orders', async (req, res) => {
  const { email } = req.query;
  try {
    let query = {};
    if (email) {
      query.userEmail = email.toLowerCase();
    }
    const orders = await Order.find(query).sort({ timestamp: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving orders.', error: err.message });
  }
});

// Submit new order
app.post('/api/orders', async (req, res) => {
  const { id, userEmail, date, paymentMethod, paymentId, total, timestamp, shipping, items } = req.body;
  try {
    const newOrder = new Order({
      id,
      userEmail: userEmail.toLowerCase(),
      date,
      paymentMethod,
      paymentId: paymentId || 'N/A',
      total,
      timestamp: timestamp || Date.now(),
      shipping,
      items
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: 'Error placing order.', error: err.message });
  }
});

// --- VENDOR REQUESTS & SELLER APPLICATIONS ---

// Submit a seller request
app.post('/api/vendor-requests', async (req, res) => {
  const { shopName, email, phone, category, description, password } = req.body;
  try {
    // Check if already user or request exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'This merchant email is already registered!' });
    }

    const existingReq = await VendorRequest.findOne({ email: email.toLowerCase() });
    if (existingReq) {
      return res.status(400).json({ message: 'A seller application request is already pending!' });
    }

    const reqId = 'req-' + Math.floor(1000 + Math.random() * 9000);
    const newRequest = new VendorRequest({
      id: reqId,
      shopName,
      email: email.toLowerCase(),
      phone,
      category,
      description,
      password,
      status: 'pending'
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ message: 'Error submitting merchant application.', error: err.message });
  }
});

// Get pending Requests
app.get('/api/vendor-requests', async (req, res) => {
  try {
    const requests = await VendorRequest.find({ status: 'pending' }).sort({ timestamp: -1 });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving pending applications.', error: err.message });
  }
});

// Approve Request
app.post('/api/vendor-requests/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    const request = await VendorRequest.findOne({ id });
    if (!request) {
      return res.status(404).json({ message: 'Application request not found.' });
    }

    // Set request status approved
    request.status = 'approved';
    await request.save();

    // Register User as vendor
    const newUser = new User({
      name: request.shopName,
      email: request.email.toLowerCase(),
      password: request.password,
      phone: request.phone,
      role: 'vendor',
      status: 'approved',
      shopName: request.shopName,
      description: request.description,
      category: request.category
    });

    await newUser.save();
    res.status(200).json({ message: 'Seller application approved and merchant account created successfully.', request });
  } catch (err) {
    res.status(500).json({ message: 'Error approving request.', error: err.message });
  }
});

// Reject Request
app.post('/api/vendor-requests/:id/reject', async (req, res) => {
  const { id } = req.params;
  try {
    const request = await VendorRequest.findOne({ id });
    if (!request) {
      return res.status(404).json({ message: 'Application request not found.' });
    }

    request.status = 'rejected';
    await request.save();
    res.status(200).json({ message: 'Seller application rejected and removed from pending queue.', request });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting request.', error: err.message });
  }
});

// Suspend Vendor account
app.post('/api/vendors/:email/suspend', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email: email.toLowerCase(), role: 'vendor' });
    if (!user) {
      return res.status(404).json({ message: 'Merchant account not found.' });
    }

    user.status = 'banned';
    await user.save();
    res.status(200).json({ message: 'Merchant account has been suspended.', user });
  } catch (err) {
    res.status(500).json({ message: 'Error suspending merchant account.', error: err.message });
  }
});

// Get Approved Active Vendors Registry
app.get('/api/vendors', async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor', status: 'approved' }).sort({ timestamp: -1 });
    res.status(200).json(vendors);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving active vendors.', error: err.message });
  }
});

// Listen
app.listen(PORT, () => {
  console.log(`Express Backend running securely on http://localhost:${PORT}`);
});
