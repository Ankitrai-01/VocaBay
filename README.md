# VocaBay — Voice-Controlled Cyber E-Commerce Platform

VocaBay is an immersive, high-fidelity e-commerce experience designed for the next era of web navigation: **100% hands-free voice control**. Blending dark cybernetic aesthetics, sleek glassmorphic panels, dynamic HSL neon lighting, and high-fidelity speech-processing NLP, VocaBay sets a premium standard for AI-assisted shopping.

The platform integrates a native client-side Single Page Application (SPA) frontend with a persistent Express/Node.js backend API and a MongoDB storage cluster.

---

## 🌟 Key Features

### 🎙️ 1. AI Voice Assistant System
* **Seamless Voice Commands**: Speak natural instructions like *"go to shop"*, *"search for headphones"*, or *"add this to cart in size medium"*.
* **Smart Speech Normalization**: Robust natural language processing mapping phonetic variants like *"goto"*, *"go"*, *"take me to"*, or direct single-keyword shortcuts (*"cart"*, *"about"*) to instant navigation triggers.
* **Gated Narration (Quiet Browsing)**: Speech feedback is 100% silent during standard keyboard/mouse interactions, activating *only* during continuous Hands-Free Mode or active voice command processing to keep standard browsing quiet.
* **Premium Cached Synthesis**: Pre-caches Chromium's premium text-to-speech engine voices on page load, eliminating recurrent search overheads for instantaneous, lag-free audio feedback.

### 🎨 2. Premium Visual Interface
* **Cyber-Dark Theme**: Harmonious HSL tailwinds, deep titanium overlays, and vibrant cyan and emerald neon glow variables.
* **Glassmorphic Panels**: Modern transparent cards featuring blur-filters, smooth interactive micro-animations, and responsive layouts.
* **Expanding Global Search**: Expanding-on-focus input in the header actions that auto-routes the user to the Shop catalog in real-time, matching dynamic input bindings.

### 👤 3. Multi-Role Ecosystem
* **Customer Dashboard**: Track verified orders, view historic transactions, and explore order-stage courier progress steppers (*Placed*, *Processing*, *Shipped*, *Dispatched*, *Delivered*).
* **Merchant Command Station**: Pre-approved sellers can monitor active listings, register custom parameters, and list brand-new catalog assets dynamically.
* **Administrator Control Room**: Manage dynamic global stock, suspend accounts, and review/approve pending seller application requests.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | Vanilla HTML5, CSS3 Variables, Client-Side SPA Router, Native Web Speech API (`webkitSpeechRecognition` & `SpeechSynthesis`) |
| **Backend** | Node.js, Express API, CORS Engine |
| **Database** | MongoDB, Mongoose ODM |
| **Integrations** | Razorpay Sandbox SDK (Simulated checkout credentials) |

---

## 🎙️ Voice Commands Cheat-Sheet

Open the floating voice guide in the bottom right corner or speak these phrases:

### 🧭 Navigation & Browse
* **Home**: *"go to home"*, *"goto home"*, *"home"*, *"go home"*
* **Store**: *"go to shop"*, *"goto shop"*, *"shop"*, *"browse store"*
* **About**: *"go to about"*, *"goto about"*, *"about"*, *"about us"*
* **Cart**: *"go to cart"*, *"goto cart"*, *"cart"*, *"view cart"*
* **Support**: *"go to contact"*, *"goto contact"*, *"contact"*, *"support"*
* **Control**: *"scroll down"*, *"scroll up"*, *"go to top"*, *"go to bottom"*

### 🛍️ Cart & Checkout
* **Search**: *"search for [garment]"*, *"find [electronics]"*
* **Product**: *"open product [name]"*, *"view product [name]"*
* **Sizes**: *"select size [S / M / L / XL]"*, *"choose size [small / medium / large]"*
* **Garment Snap**: *"add Luxe Cotton Slim Shirt in size medium to cart"*
* **Cart Bag**: *"add to cart"*, *"add this to cart"*, *"clear cart"*
* **Checkout**: *"proceed to checkout"*, *"select cash on delivery"*, *"select razorpay"*
* **Submit**: *"place order"*, *"confirm order"*, *"complete purchase"*
* **Order Tracking**: *"track order VC-12345"*, *"check order status"*

### 🔐 Accounts & Dashboard Controls
* **Sign In**: *"go to login"*, *"login"*, *"sign in"*
* **Sign Up**: *"go to register"*, *"register"*, *"signup"*
* **Verify OTP**: *"verify code [digit-digits-digits]"*, *"verify [1 2 3 4 5 6]"*
* **Vendor Console**: *"go to command station"*, *"open vendor panel"*
* **Admin Dashboard**: *"go to control room"*, *"open admin"*
* **Exit**: *"logout"*, *"sign out"*

---

## 🚀 Setup & Installation

Follow these steps to run VocaBay on your local machine:

### Prerequisites
* [Node.js](https://nodejs.org/) installed.
* [MongoDB Compass / MongoDB Server](https://www.mongodb.com/try/download/community) installed and running locally.
* Python installed (to serve static files).

### 1. Launch MongoDB Database Service
Ensure the local database server is running on the default port `27017` with the direct IPv4 loopback address:
```bash
# Example launching local mongod
mongod --dbpath "C:\Users\arai5\Downloads\Github\VocaBay\data\db"
```

### 2. Configure and Run Backend Express Server
Install server dependencies and run `server.js`:
```bash
npm install
node server.js
```
The console will log: 
`Express Backend running securely on http://localhost:5000` & `Successfully connected to MongoDB.`

### 3. Run Frontend Server
Serve the repository root directory on port `8000`:
```bash
python -m http.server 8000
```
Open **Google Chrome** or **Microsoft Edge** and navigate to:
👉 **`http://localhost:8000`**

*Note: Accessing the website via `http://localhost:8000` or `http://127.0.0.1:8000` is mandatory to grant local microphone permissions. The SpeechRecognition API is disabled on standard local `file://` protocols and non-secure origins.*

---

## 💡 Important Diagnostic Tips

### ⚡ aggresive Caching (Hard Refresh)
If you experience voice command silence or database errors, your browser may be executing an aggressively cached version of `app.js`:
* Force reload the latest scripts by pressing **`Ctrl + F5`** (Windows/Linux) or **`Cmd + Shift + R`** (Mac).

### 🎙️ Microphone Access
Ensure microphone permissions are explicitly **Allowed** in your browser's address bar settings next to the localhost lock icon.
