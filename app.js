// VoiceCart Platform Engine

// 1. Mock Catalog Data
const PRODUCTS = [
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

// 2. Application Core State
let STATE = {
  cart: [], // items are { productId, size, quantity }
  currentView: "home",
  viewHistory: ["home"],
  searchQuery: "",
  selectedCategories: [],
  selectedPriceRange: "all",
  sortType: "default",
  activeProductId: null,
  selectedSize: "", // Active size selected in product detail view
  isHandsFree: false,
  isListening: false,
  activePaymentMethod: "cod",
  activeUser: null,
  authRedirectTarget: null,
  generatedOtp: null,
  tempRegistrationData: null,
  otpCountdownTimer: null,
  otpSecondsRemaining: 60
};

// 3. Document Elements Ready
document.addEventListener("DOMContentLoaded", () => {
  initRouter();
  initListeners();
  initVoiceAssistant();
  checkAuthSession();
  renderProducts();
  updateCartBadge();
});

// 4. Custom Floating Toast Notification System
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `custom-toast ${type}`;
  
  // Icon based on type
  let icon = "";
  if (type === "success") {
    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  } else if (type === "error") {
    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  } else {
    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }
  
  toast.innerHTML = `${icon}<span>${message}</span>`;
  container.appendChild(toast);
  
  // Slide out after 3 seconds
  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2800);
}

// 5. Client-Side Router
function navigateTo(viewName, productId = null, bypassHistory = false) {
  const sections = document.querySelectorAll(".view-section");
  const navLinks = document.querySelectorAll("nav a");
  
  // Validate view name
  const validViews = ["home", "shop", "product", "cart", "checkout", "success", "contact", "auth", "profile", "tracking"];
  if (!validViews.includes(viewName)) return;
  
  // Checkout security wall intercept!
  if (viewName === "checkout" && !STATE.activeUser) {
    STATE.authRedirectTarget = "checkout";
    showToast("Authentication required to checkout!", "error");
    speak("Please log in or create an account before proceeding to secure checkout.");
    navigateTo("auth", null, true);
    return;
  }
  
  // Update State
  STATE.currentView = viewName;
  if (!bypassHistory) {
    STATE.viewHistory.push(viewName);
  }
  
  // Handle product details
  if (viewName === "product" && productId) {
    STATE.activeProductId = productId;
    STATE.selectedSize = ""; // Reset size selection
    renderProductDetail(productId);
  }
  
  if (viewName === "cart") {
    renderCart();
  }
  
  if (viewName === "checkout") {
    renderCheckoutSummary();
  }
  
  if (viewName === "profile") {
    renderProfileDashboard();
  }
  
  if (viewName === "tracking") {
    renderOrderTracking(null);
  }
  
  // Toggle views classes
  sections.forEach(sec => {
    if (sec.id === `${viewName}-view`) {
      sec.classList.add("active");
    } else {
      sec.classList.remove("active");
    }
  });
  
  // Highlight navigation header links
  navLinks.forEach(link => {
    if (link.getAttribute("data-view") === viewName) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
  
  // Scroll view back to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initRouter() {
  // Navigation Links click routing
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", (e) => {
      const view = e.target.getAttribute("data-view");
      navigateTo(view);
    });
  });
  
  // Logo Route
  document.getElementById("nav-logo").addEventListener("click", () => {
    navigateTo("home");
  });
  
  // Header Cart Button click
  document.getElementById("nav-cart-btn").addEventListener("click", () => {
    navigateTo("cart");
  });
  
  // Landing Hero Navigation
  document.getElementById("hero-shop-btn").addEventListener("click", () => {
    navigateTo("shop");
  });
  
  document.getElementById("hero-help-btn").addEventListener("click", () => {
    toggleHelpDrawer(true);
  });
  
  document.getElementById("detail-back-btn").addEventListener("click", () => {
    navigateTo("shop");
  });
  
  document.getElementById("checkout-proceed-btn").addEventListener("click", () => {
    if (STATE.cart.length === 0) {
      showToast("Your cart is empty!", "info");
      speak("Your cart is empty. Please select products first.");
      return;
    }
    navigateTo("checkout");
  });
}

// Help Cheat-Sheet Drawer togglers
function toggleHelpDrawer(open = null) {
  const drawer = document.getElementById("help-drawer-panel");
  if (open === null) {
    drawer.classList.toggle("open");
  } else if (open) {
    drawer.classList.add("open");
  } else {
    drawer.classList.remove("open");
  }
}

// 6. View Rendering Controllers

// Render store products lists (with filtering & sorting)
function renderProducts() {
  const container = document.getElementById("products-grid-container");
  if (!container) return;
  
  // Apply Filtering
  let filtered = PRODUCTS.filter(prod => {
    // 1. Text Search matching name or category
    const matchesSearch = prod.name.toLowerCase().includes(STATE.searchQuery.toLowerCase()) || 
                          prod.category.toLowerCase().includes(STATE.searchQuery.toLowerCase());
    
    // 2. Categories selection check
    const matchesCat = STATE.selectedCategories.length === 0 || 
                       STATE.selectedCategories.includes(prod.category);
    
    // 3. Prices filter selection check
    let matchesPrice = true;
    if (STATE.selectedPriceRange === "0-50") matchesPrice = prod.price < 5000;
    else if (STATE.selectedPriceRange === "50-150") matchesPrice = prod.price >= 5000 && prod.price <= 15000;
    else if (STATE.selectedPriceRange === "150-1000") matchesPrice = prod.price > 15000;
    
    return matchesSearch && matchesCat && matchesPrice;
  });
  
  // Apply Sorting
  if (STATE.sortType === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (STATE.sortType === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  }
  
  // Check empty state
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <h3>No Products Found</h3>
        <p style="margin-top:0.5rem;">Try refining your keywords or search filters.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = "";
  filtered.forEach(prod => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-id", prod.id);
    card.innerHTML = `
      <div class="product-card-img">
        <img src="${prod.image}" alt="${prod.name}">
        <span class="product-card-badge">${prod.category}</span>
      </div>
      <div class="product-card-body">
        <h3 class="product-card-title">${prod.name}</h3>
        <p class="product-card-desc">${prod.description}</p>
        <div class="product-card-footer">
          <span class="product-card-price">₹${prod.price.toLocaleString()}</span>
          <button class="btn btn-secondary btn-sm" style="padding:0.4rem 1rem; font-size:0.8rem; border-radius:8px;">View Details</button>
        </div>
      </div>
    `;
    
    card.addEventListener("click", () => {
      navigateTo("product", prod.id);
    });
    
    container.appendChild(card);
  });
}

// Render dynamic product detail sheet
function renderProductDetail(productId) {
  const container = document.getElementById("product-detail-container");
  if (!container) return;
  
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  // Format sizes buttons markup
  let sizesHTML = "";
  if (product.sizes && product.sizes.length > 0) {
    sizesHTML = `
      <div class="size-selector">
        <span class="size-label">Select Size</span>
        <div class="size-chips">
          ${product.sizes.map(size => `
            <button class="size-chip ${size === STATE.selectedSize ? 'selected' : ''}" data-size="${size}">${size}</button>
          `).join("")}
        </div>
      </div>
    `;
  }
  
  container.innerHTML = `
    <div class="detail-img-container">
      <img src="${product.image}" alt="${product.name}">
    </div>
    
    <div class="detail-info">
      <span class="detail-category">${product.category}</span>
      <h1 class="detail-title">${product.name}</h1>
      <span class="detail-price">₹${product.price.toLocaleString()}</span>
      <p class="detail-desc">${product.description}</p>
      
      ${sizesHTML}
      
      <div style="margin-top: 1.5rem;">
        <button class="btn btn-primary" id="detail-add-cart-btn" style="padding: 1rem 2rem; font-size:1.05rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          Add to Cart
        </button>
      </div>
    </div>
  `;
  
  // Hook size selector clicks
  container.querySelectorAll(".size-chip").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const sizeVal = e.target.getAttribute("data-size");
      selectSize(sizeVal);
    });
  });
  
  // Add to cart click
  document.getElementById("detail-add-cart-btn").addEventListener("click", () => {
    addToCart(product.id, STATE.selectedSize);
  });
}

function selectSize(sizeVal) {
  STATE.selectedSize = sizeVal;
  
  // Visual sync of size button highlights
  const chips = document.querySelectorAll(".size-chip");
  chips.forEach(chip => {
    if (chip.getAttribute("data-size") === sizeVal) {
      chip.classList.add("selected");
    } else {
      chip.classList.remove("selected");
    }
  });
  
  showToast(`Size selected: ${sizeVal}`, "info");
  speak(`Size ${sizeVal} selected`);
}

// Render dynamic Shopping Cart view
function renderCart() {
  const listContainer = document.getElementById("cart-items-list");
  if (!listContainer) return;
  
  if (STATE.cart.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state glass-panel" style="padding: 4rem 2rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <h3>Your Cart is Empty</h3>
        <p style="margin-top:0.5rem; margin-bottom: 1.5rem;">There are no items configured in your cart bag.</p>
        <button class="btn btn-primary" onclick="navigateTo('shop')">Explore Shop</button>
      </div>
    `;
    updateCartTotals();
    return;
  }
  
  listContainer.innerHTML = "";
  STATE.cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    if (!product) return;
    
    const cartEl = document.createElement("div");
    cartEl.className = "cart-item";
    cartEl.innerHTML = `
      <div class="cart-item-img">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="cart-item-details">
        <h3 class="cart-item-title">${product.name}</h3>
        <div class="cart-item-meta">
          <span>Category: ${product.category}</span>
          ${item.size ? `<span>Size: <strong style="color:var(--accent-cyan); font-family:var(--font-display);">${item.size}</strong></span>` : ''}
        </div>
        <span class="cart-item-price">₹${product.price.toLocaleString()}</span>
      </div>
      
      <div class="cart-qty-controls">
        <button class="cart-qty-btn decrease-btn" data-id="${product.id}" data-size="${item.size}">-</button>
        <span class="cart-qty-val">${item.quantity}</span>
        <button class="cart-qty-btn increase-btn" data-id="${product.id}" data-size="${item.size}">+</button>
      </div>
      
      <button class="cart-item-remove" data-id="${product.id}" data-size="${item.size}" title="Remove Item">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
      </button>
    `;
    
    // Wire up events
    cartEl.querySelector(".decrease-btn").addEventListener("click", () => {
      adjustQuantity(item.productId, item.size, -1);
    });
    cartEl.querySelector(".increase-btn").addEventListener("click", () => {
      adjustQuantity(item.productId, item.size, 1);
    });
    cartEl.querySelector(".cart-item-remove").addEventListener("click", () => {
      removeFromCart(item.productId, item.size);
    });
    
    listContainer.appendChild(cartEl);
  });
  
  updateCartTotals();
}

function updateCartTotals() {
  let subtotal = 0;
  STATE.cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  });
  
  let delivery = subtotal > 0 ? (subtotal > 10000 ? 0 : 250) : 0;
  let total = subtotal + delivery;
  
  document.getElementById("cart-subtotal").textContent = `₹${subtotal.toLocaleString()}`;
  document.getElementById("cart-shipping").textContent = delivery === 0 ? "FREE" : `₹${delivery.toLocaleString()}`;
  document.getElementById("cart-total").textContent = `₹${total.toLocaleString()}`;
}

// Render secure checkout totals list
function renderCheckoutSummary() {
  const container = document.getElementById("checkout-order-items");
  if (!container) return;
  
  container.innerHTML = "";
  let subtotal = 0;
  
  STATE.cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    if (!product) return;
    
    subtotal += product.price * item.quantity;
    
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.justify = "space-between";
    div.style.alignItems = "center";
    div.style.fontSize = "0.85rem";
    div.style.padding = "0.5rem 0";
    div.style.borderBottom = "1px solid rgba(255, 255, 255, 0.03)";
    
    div.innerHTML = `
      <div style="max-width: 70%;">
        <p style="font-weight:600; color:var(--text-primary); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${product.name}</p>
        <span style="color:var(--text-secondary); font-size:0.75rem;">Qty: ${item.quantity} ${item.size ? `• Size: ${item.size}` : ""}</span>
      </div>
      <span style="font-weight:700; color:var(--accent-cyan);">₹${(product.price * item.quantity).toLocaleString()}</span>
    `;
    container.appendChild(div);
  });
  
  let delivery = subtotal > 10000 ? 0 : 250;
  let total = subtotal + delivery;
  
  document.getElementById("checkout-subtotal").textContent = `₹${subtotal.toLocaleString()}`;
  document.getElementById("checkout-shipping").textContent = delivery === 0 ? "FREE" : `₹${delivery.toLocaleString()}`;
  document.getElementById("checkout-total").textContent = `₹${total.toLocaleString()}`;
}

// 7. Cart State Modifiers
function addToCart(productId, size = "") {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  // Size validation
  if (product.sizes.length > 0 && product.sizes[0] !== "Standard" && !size) {
    showToast("Please choose product size first!", "error");
    speak(`Please select a size first`);
    return;
  }
  
  // Default to standard size if none required
  const sizeToUse = size || product.sizes[0];
  
  // Check duplicate
  const existing = STATE.cart.find(item => item.productId === productId && item.size === sizeToUse);
  if (existing) {
    existing.quantity += 1;
  } else {
    STATE.cart.push({
      productId: productId,
      size: sizeToUse,
      quantity: 1
    });
  }
  
  updateCartBadge();
  showToast(`${product.name} added to cart!`, "success");
  speak(`Added ${product.name} to cart`);
}

function adjustQuantity(productId, size, offset) {
  const item = STATE.cart.find(i => i.productId === productId && i.size === size);
  if (!item) return;
  
  item.quantity += offset;
  if (item.quantity <= 0) {
    removeFromCart(productId, size);
  } else {
    renderCart();
    updateCartBadge();
  }
}

function removeFromCart(productId, size) {
  const product = PRODUCTS.find(p => p.id === productId);
  STATE.cart = STATE.cart.filter(item => !(item.productId === productId && item.size === size));
  renderCart();
  updateCartBadge();
  showToast(`Item removed from cart`, "info");
  if (product) {
    speak(`Removed ${product.name} from cart`);
  }
}

function clearCart(silent = false) {
  STATE.cart = [];
  updateCartBadge();
  if (STATE.currentView === "cart") {
    renderCart();
  }
  if (!silent) {
    showToast(`Cart has been cleared`, "info");
    speak("Your cart is empty now");
  }
}

function updateCartBadge() {
  const badge = document.getElementById("global-cart-badge");
  let totalCount = STATE.cart.reduce((acc, curr) => acc + curr.quantity, 0);
  badge.textContent = totalCount;
}

// 8. Event Bindings
function initListeners() {
  // Category Quick Chips
  document.querySelectorAll(".category-chip").forEach(chip => {
    chip.addEventListener("click", (e) => {
      const cat = e.target.getAttribute("data-category");
      STATE.selectedCategories = [cat];
      
      // Sync checkbox selection
      document.querySelectorAll(".filter-sidebar input[type='checkbox']").forEach(box => {
        box.checked = box.value === cat;
      });
      
      navigateTo("shop");
      renderProducts();
    });
  });
  
  // Search Box typing
  const searchInput = document.getElementById("product-search-input");
  searchInput.addEventListener("input", (e) => {
    STATE.searchQuery = e.target.value;
    renderProducts();
  });
  
  // Filters checkboxes check
  document.querySelectorAll(".filter-sidebar input[type='checkbox']").forEach(box => {
    box.addEventListener("change", () => {
      const checked = [];
      document.querySelectorAll(".filter-sidebar input[type='checkbox']:checked").forEach(b => {
        checked.push(b.value);
      });
      STATE.selectedCategories = checked;
      renderProducts();
    });
  });
  
  // Filters prices radios check
  document.querySelectorAll("input[name='price-filter']").forEach(radio => {
    radio.addEventListener("change", (e) => {
      STATE.selectedPriceRange = e.target.value;
      renderProducts();
    });
  });
  
  // Sort selection changed
  document.getElementById("sort-select").addEventListener("change", (e) => {
    STATE.sortType = e.target.value;
    renderProducts();
  });
  
  // Help Cheat Drawer Close Click
  document.getElementById("help-drawer-close-btn").addEventListener("click", () => {
    toggleHelpDrawer(false);
  });
  document.getElementById("help-drawer-toggle-btn").addEventListener("click", () => {
    toggleHelpDrawer();
  });
  
  // Checkout Checkout Shipping Form submit
  document.getElementById("checkout-shipping-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (STATE.activePaymentMethod === "online") {
      startRazorpayPayment();
    } else {
      submitOrder();
    }
  });
  
  // Payment card clicks
  document.getElementById("payment-card-cod").addEventListener("click", () => {
    selectPaymentMethod("cod");
  });
  document.getElementById("payment-card-online").addEventListener("click", () => {
    selectPaymentMethod("online");
  });
  
  // Success page home links
  document.getElementById("success-home-btn").addEventListener("click", () => navigateTo("home"));
  document.getElementById("success-shop-btn").addEventListener("click", () => navigateTo("shop"));

  // Dynamic Auth and Profile delegation click triggers
  document.addEventListener("click", (e) => {
    const authBtn = e.target.closest("#nav-auth-btn");
    if (authBtn) navigateTo("auth");
    
    const profileBtn = e.target.closest("#nav-profile-btn");
    if (profileBtn) navigateTo("profile");
  });

  // Auth view toggles
  const loginTab = document.getElementById("tab-login-btn");
  const signupTab = document.getElementById("tab-signup-btn");
  const loginCard = document.getElementById("auth-login-card");
  const signupCard = document.getElementById("auth-signup-card");

  if (loginTab && signupTab && loginCard && signupCard) {
    loginTab.addEventListener("click", () => {
      loginTab.classList.add("active");
      signupTab.classList.remove("active");
      loginCard.classList.add("active");
      signupCard.classList.remove("active");
      speak("Switched to login tab.");
    });
    signupTab.addEventListener("click", () => {
      signupTab.classList.add("active");
      loginTab.classList.remove("active");
      signupCard.classList.add("active");
      loginCard.classList.remove("active");
      speak("Switched to sign up tab.");
    });
  }

  // Auth form submissions
  const loginForm = document.getElementById("auth-login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();
      loginUser(email, password);
    });
  }

  const signupForm = document.getElementById("auth-signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("signup-name").value.trim();
      const email = document.getElementById("signup-email").value.trim();
      const phone = document.getElementById("signup-phone").value.trim();
      const password = document.getElementById("signup-password").value.trim();
      triggerSignupVerification(name, email, password, phone);
    });
  }

  // OTP Split Digit inputs auto-tabbing
  const otpInputs = document.querySelectorAll(".otp-digit-input");
  otpInputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      const val = e.target.value;
      if (val.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
      
      // Auto-submit if all digits are entered
      const allFilled = Array.from(otpInputs).every(inp => inp.value.trim().length === 1);
      if (allFilled) {
        const code = Array.from(otpInputs).map(inp => inp.value.trim()).join("");
        setTimeout(() => verifyOtpCode(code), 300);
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });

  // OTP Modal Action buttons
  const otpSubmitBtn = document.getElementById("otp-submit-btn");
  if (otpSubmitBtn) {
    otpSubmitBtn.addEventListener("click", () => {
      const code = Array.from(otpInputs).map(inp => inp.value.trim()).join("");
      verifyOtpCode(code);
    });
  }

  const otpCancelBtn = document.getElementById("otp-cancel-btn");
  if (otpCancelBtn) {
    otpCancelBtn.addEventListener("click", () => {
      const modal = document.getElementById("otp-verification-modal");
      if (modal) modal.classList.remove("open");
      if (STATE.otpCountdownTimer) clearInterval(STATE.otpCountdownTimer);
      STATE.generatedOtp = null;
      STATE.tempRegistrationData = null;
      showToast("Verification canceled", "info");
      speak("Registration canceled.");
    });
  }

  const otpResendBtn = document.getElementById("otp-resend-btn");
  if (otpResendBtn) {
    otpResendBtn.addEventListener("click", () => {
      if (STATE.tempRegistrationData) {
        showToast("Sending new verification code...", "info");
        sendOtpVerification(STATE.tempRegistrationData);
      }
    });
  }

  // Profile Logout btn
  const logoutBtn = document.getElementById("profile-logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logoutUser();
    });
  }



  // Event delegation click triggers for Track Order in Profile list
  document.addEventListener("click", (e) => {
    const trackHistoryBtn = e.target.closest(".track-order-history-btn");
    if (trackHistoryBtn) {
      const orderId = trackHistoryBtn.getAttribute("data-order-id");
      navigateTo("tracking");
      setTimeout(() => renderOrderTracking(orderId), 300);
    }
  });
}

function selectPaymentMethod(method) {
  STATE.activePaymentMethod = method;
  const codCard = document.getElementById("payment-card-cod");
  const onlineCard = document.getElementById("payment-card-online");
  const keyContainer = document.getElementById("razorpay-key-container");
  
  if (method === "cod") {
    codCard.classList.add("selected");
    onlineCard.classList.remove("selected");
    if (keyContainer) keyContainer.style.display = "none";
    showToast("Selected: Cash on Delivery", "info");
    speak("Selected cash on delivery");
  } else {
    onlineCard.classList.add("selected");
    codCard.classList.remove("selected");
    if (keyContainer) keyContainer.style.display = "block";
    showToast("Selected: Razorpay Secure Payment", "info");
    speak("Selected online payment secure gateway. You can paste your custom Test Key if you wish.");
  }
}

function startRazorpayPayment() {
  if (typeof Razorpay === 'undefined') {
    showToast("Razorpay SDK not loaded!", "error");
    speak("Razorpay payment gateway is not loaded. Please wait a second or reload the page.");
    return;
  }
  
  // Calculate total amount in paisa (subtotal + delivery)
  let subtotal = 0;
  STATE.cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  });
  let delivery = subtotal > 10000 ? 0 : 250;
  let total = subtotal + delivery;
  let amountInPaisa = total * 100;
  
  // Get custom Key ID or default to placeholder
  const keyInput = document.getElementById("razorpay-key-id");
  let keyId = keyInput ? keyInput.value.trim() : "";
  if (!keyId || keyId === "rzp_test_placeholderKey") {
    // Default test key for public dashboard sandboxing
    keyId = "rzp_test_e5cOmhYvj9Y1Lw";
  }
  
  // Prefill details
  const firstName = document.getElementById("ship-firstname").value || "Aria";
  const lastName = document.getElementById("ship-lastname").value || "Sharma";
  const email = document.getElementById("ship-email").value || "aria@example.com";
  
  var options = {
    "key": keyId,
    "amount": amountInPaisa,
    "currency": "INR",
    "name": "VoiceCart AI",
    "description": "Voice-Assisted Checkout Secure Payment",
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80",
    "handler": function (response) {
      showToast("Razorpay Secure Payment Captured!", "success");
      submitOrder(response.razorpay_payment_id);
    },
    "prefill": {
      "name": `${firstName} ${lastName}`,
      "email": email
    },
    "theme": {
      "color": "#06b6d4" // Neon Cyber Cyan matching style.css
    },
    "modal": {
      "ondismiss": function() {
        showToast("Payment canceled by user", "error");
        speak("Payment gateway was closed. Please try again when ready.");
      }
    }
  };
  
  try {
    speak("Launching secure Razorpay payment gateway popup. Please complete your transaction.");
    var rzp = new Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Razorpay Error:", error);
    showToast("Failed to initialize Razorpay SDK!", "error");
    speak("Could not load Razorpay. Please verify your internet connection or check your API key.");
  }
}

function submitOrder(paymentId = null) {
  // Generate random order ID
  const rId = "#VC-" + Math.floor(10000 + Math.random() * 90000);
  document.getElementById("success-order-id").textContent = rId;
  
  const paymentContainer = document.getElementById("success-payment-container");
  const paymentIdSpan = document.getElementById("success-payment-id");
  
  if (paymentId) {
    if (paymentIdSpan) paymentIdSpan.textContent = paymentId;
    if (paymentContainer) paymentContainer.style.display = "block";
  } else {
    if (paymentContainer) paymentContainer.style.display = "none";
  }
  
  // Calculate total amount (subtotal + delivery)
  let subtotal = 0;
  STATE.cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  });
  let delivery = subtotal > 10000 ? 0 : 250;
  let total = subtotal + delivery;
  
  // Save order in history under current user
  if (STATE.activeUser) {
    let orders = JSON.parse(localStorage.getItem("VOICECART_ORDERS") || "[]");
    
    // Prefill billing details
    const firstName = document.getElementById("ship-firstname")?.value || STATE.activeUser.name.split(" ")[0];
    const lastName = document.getElementById("ship-lastname")?.value || STATE.activeUser.name.split(" ").slice(1).join(" ") || "";
    const street = document.getElementById("ship-address")?.value || "VoiceCart Commuter Center";
    const city = document.getElementById("ship-city")?.value || "Mumbai";
    const pincode = document.getElementById("ship-pincode")?.value || "400001";
    
    // Map items deep snapshot
    const itemsSnapshot = STATE.cart.map(item => {
      const prod = PRODUCTS.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        name: prod ? prod.name : "Unknown Product",
        image: prod ? prod.image : "",
        price: prod ? prod.price : 0,
        size: item.size,
        quantity: item.quantity
      };
    });

    orders.push({
      id: rId,
      userEmail: STATE.activeUser.email,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      paymentMethod: STATE.activePaymentMethod === "online" ? "Razorpay Secure" : "Cash on Delivery",
      paymentId: paymentId || "N/A",
      total: total,
      timestamp: Date.now(),
      shipping: {
        name: `${firstName} ${lastName}`,
        address: `${street}, ${city} - ${pincode}`
      },
      items: itemsSnapshot
    });
    localStorage.setItem("VOICECART_ORDERS", JSON.stringify(orders));
  }
  
  // Reset cart
  clearCart(true);
  
  // Clear forms inputs
  document.getElementById("checkout-shipping-form").reset();
  
  navigateTo("success");
  showToast("Order placed successfully!", "success");
  if (paymentId) {
    speak(`Thank you! Your order has been paid and placed successfully. Your Razorpay reference is ${paymentId}`);
  } else {
    speak("Thank you! Your order has been placed successfully with cash on delivery.");
  }
}

// ==========================================
// 8b. CUSTOM AUTHENTICATION & PROFILE ENGINE
// ==========================================

function prepopulateMockOrder(userEmail) {
  let orders = JSON.parse(localStorage.getItem("VOICECART_ORDERS") || "[]");
  const userOrders = orders.filter(o => o.userEmail.toLowerCase() === userEmail.toLowerCase());
  
  if (userOrders.length === 0) {
    // Generate a completed order that is processing / shipped
    const rId = "#VC-71932";
    orders.push({
      id: rId,
      userEmail: userEmail,
      date: new Date(Date.now() - 150000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), // 2.5 minutes ago
      paymentMethod: "Razorpay Secure",
      paymentId: "pay_RzPSandboxMock12",
      total: 13499,
      timestamp: Date.now() - 150000, // 2.5 mins ago -> Processing/Shipped stage!
      shipping: {
        name: "Aria Sharma",
        address: "71 Ocean Drive, Marine Lines, Mumbai - 400020"
      },
      items: [
        {
          productId: "prod-3",
          name: "AeroWeave Active Jacket",
          image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
          price: 4999,
          size: "M",
          quantity: 1
        },
        {
          productId: "prod-1",
          name: "Nebula SoundPulse Headset",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
          price: 8499,
          size: "Standard",
          quantity: 1
        }
      ]
    });
    localStorage.setItem("VOICECART_ORDERS", JSON.stringify(orders));
  }
}

function checkAuthSession() {
  const activeSession = localStorage.getItem("VOICECART_ACTIVE_USER");
  if (activeSession) {
    try {
      STATE.activeUser = JSON.parse(activeSession);
      prepopulateMockOrder(STATE.activeUser.email);
      updateHeaderAuthUI();
      autoFillCheckoutFields();
    } catch (e) {
      console.error("Auth session parse error:", e);
    }
  }
}

function updateHeaderAuthUI() {
  const container = document.getElementById("header-auth-status");
  if (!container) return;
  
  if (STATE.activeUser) {
    const initials = STATE.activeUser.name ? STATE.activeUser.name.charAt(0).toUpperCase() : "U";
    container.innerHTML = `
      <div class="user-profile-header" id="nav-profile-btn" title="View Profile Dashboard">
        <span class="user-greeting" style="font-size: 0.85rem; font-weight: 500; color: var(--text-secondary);">Hi, ${STATE.activeUser.name.split(" ")[0]}</span>
        <div class="profile-avatar">${initials}</div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button class="btn btn-secondary btn-sm" id="nav-auth-btn" style="border-radius: 8px; padding: 0.5rem 1.25rem; font-size: 0.85rem;">Sign In</button>
    `;
  }
}

function autoFillCheckoutFields() {
  if (!STATE.activeUser) return;
  const nameParts = STATE.activeUser.name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";
  
  const elFn = document.getElementById("ship-firstname");
  const elLn = document.getElementById("ship-lastname");
  const elEm = document.getElementById("ship-email");
  
  if (elFn && !elFn.value) elFn.value = firstName;
  if (elLn && !elLn.value) elLn.value = lastName;
  if (elEm && !elEm.value) elEm.value = STATE.activeUser.email;
}

function registerUser(name, email, password, phone) {
  const users = JSON.parse(localStorage.getItem("VOICECART_USERS") || "[]");
  
  // Duplicate check
  const duplicate = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (duplicate) {
    showToast("Email address already registered!", "error");
    speak("This email is already registered. Please log in instead.");
    return;
  }
  
  const newUser = { name, email, password, phone };
  users.push(newUser);
  localStorage.setItem("VOICECART_USERS", JSON.stringify(users));
  
  // Auto login
  STATE.activeUser = newUser;
  localStorage.setItem("VOICECART_ACTIVE_USER", JSON.stringify(newUser));
  
  prepopulateMockOrder(newUser.email);
  
  showToast("Account created successfully!", "success");
  speak(`Welcome, ${name}! Your account has been registered successfully.`);
  updateHeaderAuthUI();
  autoFillCheckoutFields();
  
  // Reset sign up form
  const signupForm = document.getElementById("auth-signup-form");
  if (signupForm) signupForm.reset();
  
  // Dynamic redirect check
  if (STATE.authRedirectTarget) {
    const target = STATE.authRedirectTarget;
    STATE.authRedirectTarget = null;
    navigateTo(target);
  } else {
    navigateTo("home");
  }
}

function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem("VOICECART_USERS") || "[]");
  
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    showToast("Invalid email or password!", "error");
    speak("Invalid email or password. Please verify your credentials and try again.");
    return;
  }
  
  STATE.activeUser = user;
  localStorage.setItem("VOICECART_ACTIVE_USER", JSON.stringify(user));
  
  prepopulateMockOrder(user.email);
  
  showToast(`Welcome back, ${user.name.split(" ")[0]}!`, "success");
  speak(`Welcome back, ${user.name.split(" ")[0]}! Logging you in secure.`);
  updateHeaderAuthUI();
  autoFillCheckoutFields();
  
  // Reset login form
  const loginForm = document.getElementById("auth-login-form");
  if (loginForm) loginForm.reset();
  
  // Dynamic redirect check
  if (STATE.authRedirectTarget) {
    const target = STATE.authRedirectTarget;
    STATE.authRedirectTarget = null;
    navigateTo(target);
  } else {
    navigateTo("home");
  }
}

function logoutUser() {
  const name = STATE.activeUser ? STATE.activeUser.name.split(" ")[0] : "Customer";
  STATE.activeUser = null;
  localStorage.removeItem("VOICECART_ACTIVE_USER");
  
  showToast("Logged out successfully", "info");
  speak(`Good bye, ${name}! You have logged out safely.`);
  
  updateHeaderAuthUI();
  
  // Reset forms shipping
  const shipForm = document.getElementById("checkout-shipping-form");
  if (shipForm) shipForm.reset();
  
  navigateTo("home");
}

function renderProfileDashboard() {
  if (!STATE.activeUser) {
    navigateTo("home");
    return;
  }
  
  // Sidebar elements
  const avatar = document.getElementById("profile-large-avatar");
  const name = document.getElementById("profile-user-name");
  const email = document.getElementById("profile-user-email");
  const phone = document.getElementById("profile-user-phone");
  
  if (avatar) avatar.textContent = STATE.activeUser.name.charAt(0).toUpperCase();
  if (name) name.textContent = STATE.activeUser.name;
  if (email) email.textContent = STATE.activeUser.email;
  if (phone) phone.textContent = STATE.activeUser.phone || "N/A";
  
  // Orders history rendering
  const listContainer = document.getElementById("profile-orders-list");
  if (!listContainer) return;
  
  const allOrders = JSON.parse(localStorage.getItem("VOICECART_ORDERS") || "[]");
  const userOrders = allOrders.filter(ord => ord.userEmail.toLowerCase() === STATE.activeUser.email.toLowerCase());
  
  if (userOrders.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state" style="padding: 2rem 1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <h4 style="font-size:1.1rem; margin-top: 1rem;">No Orders Placed Yet</h4>
        <p style="font-size:0.85rem; margin-top:0.25rem;">You haven't made any purchases yet. Your future voice checkout orders will appear here!</p>
      </div>
    `;
    return;
  }
  
  // Render reverse chronological list
  listContainer.innerHTML = "";
  [...userOrders].reverse().forEach(ord => {
    const card = document.createElement("div");
    card.className = "order-history-card";
    
    card.innerHTML = `
      <div class="order-header-row">
        <div>
          <span style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">Order ID: ${ord.id}</span>
          <span style="display:block; font-size:0.75rem; color: var(--text-muted); margin-top: 0.15rem;">Placed on: ${ord.date}</span>
        </div>
        <span style="font-family: var(--font-display); font-weight:800; font-size: 1.15rem; color: var(--accent-cyan);">₹${ord.total.toLocaleString()}</span>
      </div>
      <div style="font-size: 0.85rem; color: var(--text-secondary); display:flex; justify-content:space-between; align-items:flex-end; gap:0.35rem;">
        <div>
          <div>Payment Mode: <strong style="color:var(--text-primary);">${ord.paymentMethod}</strong></div>
          ${ord.paymentId !== "N/A" ? `<div style="margin-top:0.25rem;">Gateway Receipt: <strong style="font-family:monospace; color:var(--accent-cyan);">${ord.paymentId}</strong></div>` : ''}
        </div>
        <button class="btn btn-secondary btn-sm track-order-history-btn" data-order-id="${ord.id}" style="padding:0.35rem 1rem; font-size:0.75rem; border-radius:6px; flex-shrink:0;">Track Order</button>
      </div>
    `;
    listContainer.appendChild(card);
  });
}

function getOrderStageInfo(order) {
  const elapsedMs = Date.now() - (order.timestamp || Date.now());
  const elapsedMins = elapsedMs / 60000;
  
  let currentStage = 0;
  let stageName = "Order Placed";
  let courierStage = "Status: Order verified and logged in scheduling.";
  let fillWidth = "0%";
  let estArrival = "ARRIVING: TOMORROW";
  let badgeClass = "placed";
  
  if (elapsedMins < 1) {
    currentStage = 0;
    stageName = "Placed";
    courierStage = "Status: Order verified and logged in scheduling.";
    fillWidth = "0%";
    estArrival = "ARRIVING: TOMORROW";
    badgeClass = "placed";
  } else if (elapsedMins < 3) {
    currentStage = 1;
    stageName = "Processing";
    courierStage = "Status: Packages sorted and packed for shipping.";
    fillWidth = "25%";
    estArrival = "ARRIVING: TOMORROW";
    badgeClass = "processing";
  } else if (elapsedMins < 5) {
    currentStage = 2;
    stageName = "Shipped";
    courierStage = "Status: Shipped via Air Cargo Express.";
    fillWidth = "50%";
    estArrival = "ARRIVING: TONIGHT";
    badgeClass = "shipped";
  } else if (elapsedMins < 7) {
    currentStage = 3;
    stageName = "Dispatched";
    courierStage = "Status: Handed over to local courier partner.";
    fillWidth = "75%";
    estArrival = "ARRIVING: IN 2 HOURS";
    badgeClass = "dispatched";
  } else {
    currentStage = 4;
    stageName = "Delivered";
    courierStage = "Status: Package delivered and signed successfully.";
    fillWidth = "100%";
    estArrival = "STATUS: DELIVERED";
    badgeClass = "delivered";
  }
  
  return { currentStage, stageName, courierStage, fillWidth, estArrival, badgeClass };
}

function renderOrderTracking(orderId = null) {
  const listPanel = document.getElementById("tracking-orders-list-panel");
  const stepperPanel = document.getElementById("tracking-stepper-panel");
  
  if (!STATE.activeUser) {
    if (stepperPanel) stepperPanel.style.display = "none";
    if (listPanel) {
      listPanel.innerHTML = `
        <div class="empty-state glass-panel" style="grid-column: 1 / -1; padding: 4rem 1.5rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:1.5rem; color:var(--text-muted);"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <h3 style="font-size:1.4rem; margin-bottom:0.5rem;">Authentication Required</h3>
          <p style="color: var(--text-secondary); margin-bottom: 1.5rem; max-width: 420px; margin-left:auto; margin-right:auto;">Please sign in or create an account to view and track your live orders history.</p>
          <button class="btn btn-primary" onclick="navigateTo('auth')">Sign In Securely</button>
        </div>
      `;
    }
    return;
  }
  
  const allOrders = JSON.parse(localStorage.getItem("VOICECART_ORDERS") || "[]");
  const userOrders = allOrders.filter(ord => ord.userEmail.toLowerCase() === STATE.activeUser.email.toLowerCase());
  
  if (userOrders.length === 0) {
    if (stepperPanel) stepperPanel.style.display = "none";
    if (listPanel) {
      listPanel.innerHTML = `
        <div class="empty-state glass-panel" style="grid-column: 1 / -1; padding: 4rem 1.5rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:1.5rem; color:var(--text-muted);"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <h3 style="font-size:1.4rem; margin-bottom:0.5rem;">No Orders Placed Yet</h3>
          <p style="color: var(--text-secondary); margin-bottom: 1.5rem; max-width: 420px; margin-left:auto; margin-right:auto;">You haven't placed any purchases yet. Add premium items to your bag and check out to track here.</p>
          <button class="btn btn-primary" onclick="navigateTo('shop')">Explore Shop</button>
        </div>
      `;
    }
    return;
  }
  
  // Render list of user orders
  if (listPanel) {
    listPanel.innerHTML = "";
    [...userOrders].reverse().forEach(ord => {
      const info = getOrderStageInfo(ord);
      const isSelected = orderId && ord.id.toUpperCase().replace("#", "") === orderId.trim().toUpperCase().replace("#", "");
      
      const card = document.createElement("div");
      card.className = `tracking-order-card ${isSelected ? 'selected' : ''}`;
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:700; font-size:1.05rem; color:var(--text-primary); font-family:var(--font-display);">${ord.id}</span>
          <span class="tracking-status-badge ${info.badgeClass}">${info.stageName}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--text-secondary);">
          <span>Placed: ${ord.date}</span>
          <span style="font-weight:700; color:var(--accent-cyan);">₹${ord.total.toLocaleString()}</span>
        </div>
      `;
      
      card.addEventListener("click", () => {
        renderOrderTracking(ord.id);
      });
      
      listPanel.appendChild(card);
    });
  }
  
  // If no specific order selected, show the first order by default!
  if (!orderId && userOrders.length > 0) {
    const latestOrder = userOrders[userOrders.length - 1];
    renderOrderTracking(latestOrder.id);
    return;
  }
  
  // Load and render details for selected order
  const cleanId = orderId.trim().toUpperCase().replace("#", "");
  const order = userOrders.find(ord => ord.id.toUpperCase().replace("#", "") === cleanId);
  
  if (!order) {
    if (stepperPanel) stepperPanel.style.display = "none";
    return;
  }
  
  if (stepperPanel) stepperPanel.style.display = "block";
  
  // Populate general info
  document.getElementById("tracking-order-title").textContent = `Tracking #${order.id.replace("#", "")}`;
  document.getElementById("tracking-order-date").textContent = `Placed on ${order.date}`;
  document.getElementById("tracking-ship-name").textContent = order.shipping ? order.shipping.name : "N/A";
  document.getElementById("tracking-ship-address").textContent = order.shipping ? order.shipping.address : "N/A";
  document.getElementById("tracking-pay-method").textContent = order.paymentMethod;
  document.getElementById("tracking-pay-receipt").textContent = order.paymentId !== "N/A" ? `Gateway ID: ${order.paymentId}` : "Receipt: N/A";
  
  // Get stage info
  const info = getOrderStageInfo(order);
  
  const stepperFill = document.getElementById("tracking-stepper-fill");
  if (stepperFill) stepperFill.style.width = info.fillWidth;
  
  const estArrivalEl = document.getElementById("tracking-est-arrival");
  if (estArrivalEl) {
    estArrivalEl.textContent = info.estArrival;
    if (info.currentStage === 4) {
      estArrivalEl.style.background = "rgba(16, 185, 129, 0.1)";
      estArrivalEl.style.borderColor = "rgba(16, 185, 129, 0.3)";
      estArrivalEl.style.color = "var(--accent-emerald)";
    } else {
      estArrivalEl.style.background = "rgba(6, 182, 212, 0.1)";
      estArrivalEl.style.borderColor = "rgba(6, 182, 212, 0.3)";
      estArrivalEl.style.color = "var(--accent-cyan)";
    }
  }
  
  const courierStageEl = document.getElementById("tracking-courier-stage");
  if (courierStageEl) courierStageEl.textContent = info.courierStage;
  
  for (let i = 0; i <= 4; i++) {
    const node = document.getElementById(`step-${i}`);
    if (node) {
      if (i < info.currentStage) {
        node.className = "tracking-step active";
        node.querySelector(".step-circle").textContent = "✓";
      } else if (i === info.currentStage) {
        node.className = "tracking-step current";
        node.querySelector(".step-circle").textContent = i + 1;
      } else {
        node.className = "tracking-step";
        node.querySelector(".step-circle").textContent = i + 1;
      }
    }
  }
  
  // Render Ordered Items Grid List
  const itemsContainer = document.getElementById("tracking-ordered-items-container");
  if (itemsContainer) {
    itemsContainer.innerHTML = "";
    
    // Fallback if order items aren't saved (for legacy orders in localStorage)
    let orderItems = order.items || [];
    if (orderItems.length === 0) {
      orderItems = [{
        productId: "prod-1",
        name: "Nebula SoundPulse Headset",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        price: order.total > 250 ? order.total - 250 : 8499,
        size: "Standard",
        quantity: 1
      }];
    }
    
    orderItems.forEach(item => {
      const row = document.createElement("div");
      row.className = "tracking-item-detail-row";
      row.innerHTML = `
        <div class="tracking-item-img-link" data-product-id="${item.productId}" title="Click to view product details">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="tracking-item-info">
          <h4 class="tracking-item-name">${item.name}</h4>
          <div class="tracking-item-meta">
            ${item.size && item.size !== "Standard" ? `<span>Size: <strong style="color:var(--accent-cyan); font-family:var(--font-display);">${item.size}</strong></span> • ` : ''}
            <span>Quantity: ${item.quantity}</span>
          </div>
        </div>
        <div class="tracking-item-total">₹${(item.price * item.quantity).toLocaleString()}</div>
      `;
      
      // Hook clickable redirect to product details
      row.querySelector(".tracking-item-img-link").addEventListener("click", () => {
        navigateTo("product", item.productId);
      });
      
      itemsContainer.appendChild(row);
    });
  }
  
  // Speak audio update
  speak(`Tracking order ${cleanId.split("").join(" ")}. The status is ${info.stageName}. ${info.courierStage.replace("Status: ", "")}`);
}

function triggerSignupVerification(name, email, password, phone) {
  const users = JSON.parse(localStorage.getItem("VOICECART_USERS") || "[]");
  const duplicate = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (duplicate) {
    showToast("Email address already registered!", "error");
    speak("This email is already registered. Please log in instead.");
    return;
  }
  
  sendOtpVerification({ name, email, password, phone });
}

function sendOtpVerification(data) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  STATE.generatedOtp = otp;
  STATE.tempRegistrationData = data;
  
  const modal = document.getElementById("otp-verification-modal");
  const sentMsg = document.getElementById("otp-sent-message");
  if (modal) modal.classList.add("open");
  
  const targetText = data.phone ? `+91 ${data.phone.slice(0,5)} ${data.phone.slice(5)}` : data.email;
  if (sentMsg) {
    sentMsg.innerHTML = `We have sent a 6-digit verification code to <strong style="color:var(--accent-cyan); font-family:var(--font-display);">${targetText}</strong>.`;
  }
  
  const inputs = document.querySelectorAll(".otp-digit-input");
  inputs.forEach(input => {
    input.value = "";
    input.classList.remove("error-shake");
  });
  if (inputs[0]) inputs[0].focus();
  
  const deliveryType = Math.random() > 0.5 ? "SMS" : "Email";
  const sentTarget = deliveryType === "SMS" ? `+91 ${data.phone}` : data.email;
  
  setTimeout(() => {
    showToast(`[Simulated ${deliveryType}] Verification code sent to ${sentTarget}: ${otp}`, "info");
    speak(`A signup verification code has been dispatched. Your simulated OTP code is ${otp.split("").join(", ")}. Please say verify code followed by the numbers to complete registration.`);
  }, 1000);
  
  startOtpCountdown();
}

function startOtpCountdown() {
  if (STATE.otpCountdownTimer) clearInterval(STATE.otpCountdownTimer);
  
  STATE.otpSecondsRemaining = 60;
  const valEl = document.getElementById("otp-countdown-val");
  const resendBtn = document.getElementById("otp-resend-btn");
  
  if (valEl) valEl.textContent = STATE.otpSecondsRemaining;
  if (resendBtn) {
    resendBtn.classList.add("disabled");
    resendBtn.style.pointerEvents = "none";
  }
  
  STATE.otpCountdownTimer = setInterval(() => {
    STATE.otpSecondsRemaining -= 1;
    if (valEl) valEl.textContent = STATE.otpSecondsRemaining;
    
    if (STATE.otpSecondsRemaining <= 0) {
      clearInterval(STATE.otpCountdownTimer);
      if (resendBtn) {
        resendBtn.classList.remove("disabled");
        resendBtn.style.pointerEvents = "auto";
        resendBtn.style.cursor = "pointer";
      }
    }
  }, 1000);
}

function verifyOtpCode(enteredCode) {
  if (!STATE.generatedOtp || !STATE.tempRegistrationData) {
    showToast("No active verification session!", "error");
    return;
  }
  
  if (enteredCode === STATE.generatedOtp) {
    const data = STATE.tempRegistrationData;
    STATE.generatedOtp = null;
    STATE.tempRegistrationData = null;
    if (STATE.otpCountdownTimer) clearInterval(STATE.otpCountdownTimer);
    
    const modal = document.getElementById("otp-verification-modal");
    if (modal) modal.classList.remove("open");
    
    registerUser(data.name, data.email, data.password, data.phone);
  } else {
    showToast("Incorrect verification code!", "error");
    speak("The verification code you entered is incorrect. Please check your simulated notifications and try again.");
    
    const inputs = document.querySelectorAll(".otp-digit-input");
    inputs.forEach(input => {
      input.classList.add("error-shake");
      setTimeout(() => input.classList.remove("error-shake"), 300);
    });
  }
}


// ==========================================
// 9. AI VOICE ASSISTANT SYSTEM
// ==========================================

let recognition = null;
let synth = window.speechSynthesis;

function speak(message) {
  if (!synth) return;
  // Cancel active narration
  synth.cancel();
  
  const utterance = new SpeechSynthesisUtterance(message);
  
  // Premium synthetic voices selection if available
  const voices = synth.getVoices();
  const femaleVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Natural") || v.name.includes("Zira") || v.lang === "en-US");
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }
  
  utterance.rate = 1.0;
  utterance.pitch = 1.05;
  synth.speak(utterance);
}

function initVoiceAssistant() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    updateAiStatus("UNSUPPORTED", "Offline - Browser Speech API not supported");
    document.getElementById("ai-handsfree-btn").style.display = "none";
    document.getElementById("ai-mic-btn").style.opacity = "0.5";
    document.getElementById("ai-mic-btn").title = "Speech recognition is unsupported by this browser.";
    return;
  }
  
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  
  // Wire Mic triggers
  const micBtn = document.getElementById("ai-mic-btn");
  micBtn.addEventListener("click", () => {
    if (STATE.isListening) {
      stopSpeechEngine();
    } else {
      startSpeechEngine();
    }
  });
  
  // Hands-free Toggle clicks
  const handsfreeBtn = document.getElementById("ai-handsfree-btn");
  handsfreeBtn.addEventListener("click", () => {
    STATE.isHandsFree = !STATE.isHandsFree;
    
    if (STATE.isHandsFree) {
      handsfreeBtn.classList.add("active");
      handsfreeBtn.textContent = "Hands-Free: ON";
      showToast("Hands-Free Mode Enabled", "success");
      speak("Hands free continuous active voice mode enabled. I am listening.");
      startSpeechEngine();
    } else {
      handsfreeBtn.classList.remove("active");
      handsfreeBtn.textContent = "Hands-Free: OFF";
      showToast("Hands-Free Mode Disabled", "info");
      speak("Continuous active voice mode disabled.");
      stopSpeechEngine();
    }
  });
  
  // Manual Typing console override form submit
  document.getElementById("ai-command-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const cmdInput = document.getElementById("ai-command-input");
    const cmd = cmdInput.value.trim();
    if (cmd) {
      processVoiceCommand(cmd);
      cmdInput.value = "";
    }
  });
  
  // Speech engine listener handlers
  recognition.onstart = () => {
    STATE.isListening = true;
    updateAiStatus("LISTENING", "AI - ACTIVE LISTENING");
    micBtn.classList.add("listening");
    
    // Show typing console
    document.getElementById("ai-command-form").style.display = "flex";
  };
  
  recognition.onend = () => {
    STATE.isListening = false;
    micBtn.classList.remove("listening");
    
    // Keep continuous listening if hands-free is checked
    if (STATE.isHandsFree) {
      try {
        recognition.start();
      } catch (err) {
        console.log("Speech restart error:", err);
      }
    } else {
      updateAiStatus("IDLE", "AI - ASSISTANT IDLE");
      document.getElementById("ai-command-form").style.display = "none";
    }
  };
  
  recognition.onerror = (e) => {
    console.warn("Speech API Error:", e.error);
    if (e.error === "not-allowed") {
      showToast("Microphone access denied!", "error");
      STATE.isHandsFree = false;
      document.getElementById("ai-handsfree-btn").classList.remove("active");
      document.getElementById("ai-handsfree-btn").textContent = "Hands-Free: OFF";
    }
  };
  
  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript.trim();
    showToast(`Voice Command: "${transcript}"`, "info");
    processVoiceCommand(transcript);
  };
  
  updateAiStatus("IDLE", "AI - ASSISTANT IDLE");
}

function startSpeechEngine() {
  if (!recognition) return;
  try {
    recognition.start();
  } catch (err) {
    // Already running
  }
}

function stopSpeechEngine() {
  if (!recognition) return;
  try {
    recognition.stop();
  } catch (err) {
    // Already stopped
  }
}

function updateAiStatus(status, textLabel) {
  const text = document.getElementById("ai-status-text");
  const dot = document.querySelector("#ai-status-tag .status-dot");
  
  text.textContent = status;
  
  if (status === "LISTENING") {
    dot.style.background = "var(--accent-emerald)";
    dot.style.boxShadow = "0 0 10px var(--accent-emerald)";
  } else if (status === "IDLE") {
    dot.style.background = "var(--accent-cyan)";
    dot.style.boxShadow = "0 0 10px var(--accent-cyan)";
  } else {
    dot.style.background = "var(--text-muted)";
    dot.style.boxShadow = "none";
  }
}

// 10. Voice NLP Processing Brain
function processVoiceCommand(rawTranscript) {
  const query = rawTranscript.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").trim();
  console.log("Processing NLP Voice Command Query:", query);
  
  // OTP VOICE VERIFICATION
  if (query.startsWith("verify code ") || query.startsWith("submit otp ") || query.startsWith("verify ") || query.startsWith("code ")) {
    let codeStr = "";
    if (query.startsWith("verify code ")) codeStr = query.substring(12);
    else if (query.startsWith("submit otp ")) codeStr = query.substring(11);
    else if (query.startsWith("verify ")) codeStr = query.substring(7);
    else if (query.startsWith("code ")) codeStr = query.substring(5);
    
    const cleanDigits = codeStr.replace(/\D/g, "");
    if (cleanDigits.length === 6) {
      speak(`Verifying code ${cleanDigits.split("").join(" ")}`);
      
      const otpInputs = document.querySelectorAll(".otp-digit-input");
      otpInputs.forEach((inp, idx) => {
        if (inp) inp.value = cleanDigits.charAt(idx);
      });
      
      setTimeout(() => {
        verifyOtpCode(cleanDigits);
      }, 800);
    } else {
      speak("Please speak a valid six digit verification code.");
      showToast("Code must be 6 digits!", "error");
    }
    return;
  }

  // TRACK ORDER NAVIGATION
  if (query.startsWith("track order ") || query.startsWith("track ") || query.startsWith("check order status ")) {
    let orderStr = "";
    if (query.startsWith("track order ")) orderStr = query.substring(12);
    else if (query.startsWith("track ")) orderStr = query.substring(6);
    else if (query.startsWith("check order status ")) orderStr = query.substring(19);
    
    orderStr = orderStr.trim().toUpperCase();
    if (orderStr.startsWith("VC ") || orderStr.startsWith("VC-")) {
      const digits = orderStr.replace(/\D/g, "");
      const normalizedId = `#VC-${digits}`;
      speak(`Tracking order ${normalizedId}`);
      navigateTo("tracking");
      setTimeout(() => renderOrderTracking(normalizedId), 300);
    } else if (orderStr) {
      const allOrders = JSON.parse(localStorage.getItem("VOICECART_ORDERS") || "[]");
      const matched = allOrders.find(o => o.id.toUpperCase().replace("#", "").includes(orderStr));
      if (matched) {
        speak(`Found order ${matched.id}. Navigating to tracking.`);
        navigateTo("tracking");
        setTimeout(() => renderOrderTracking(matched.id), 300);
      } else {
        speak(`I couldn't locate any order with code ${orderStr}`);
        showToast("Order reference not found!", "error");
      }
    } else {
      speak("Please speak a valid order number.");
    }
    return;
  }

  if (query === "track order" || query === "where is my order" || query === "check order status" || query === "order tracking") {
    speak("Opening order tracking portal. Please enter your reference ID.");
    navigateTo("tracking");
    return;
  }

  // NAVIGATE PROFILE
  if (query.match(/\b(go to|open|show|view)\b.*\b(profile|dashboard|account)\b/) || query === "profile" || query === "my account" || query === "dashboard") {
    if (!STATE.activeUser) {
      speak("You must log in to view your profile dashboard. Opening authentication page.");
      navigateTo("auth");
    } else {
      speak("Opening your customer dashboard");
      navigateTo("profile");
    }
    return;
  }

  // NAVIGATE AUTH / LOGIN / SIGNUP
  if (query.match(/\b(go to|open|show)\b.*\b(login|signin|sign in|auth)\b/) || query === "login" || query === "sign in") {
    speak("Opening the login form.");
    navigateTo("auth");
    // Switch to login tab
    setTimeout(() => {
      const loginTab = document.getElementById("tab-login-btn");
      if (loginTab) loginTab.click();
    }, 300);
    return;
  }

  if (query.match(/\b(go to|open|show)\b.*\b(signup|register|join|sign up)\b/) || query === "signup" || query === "register") {
    speak("Opening registration form.");
    navigateTo("auth");
    // Switch to signup tab
    setTimeout(() => {
      const signupTab = document.getElementById("tab-signup-btn");
      if (signupTab) signupTab.click();
    }, 300);
    return;
  }

  // LOGOUT
  if (query === "logout" || query === "log out" || query === "logout account" || query === "sign out") {
    if (!STATE.activeUser) {
      speak("You are not currently logged in.");
      showToast("Not logged in!", "error");
    } else {
      logoutUser();
    }
    return;
  }

  // NAVIGATE HOME
  if (query.match(/\b(go to|open|show)\b.*\bhome\b/) || query === "go home" || query === "homepage") {
    speak("Going to Home page");
    navigateTo("home");
    return;
  }
  
  // NAVIGATE SHOP / COLLECTION
  if (query.match(/\b(go to|open|show|browse)\b.*\b(shop|collection|catalog|products|store)\b/) || query === "shop" || query === "store") {
    speak("Opening the product catalog catalog");
    navigateTo("shop");
    return;
  }
  
  // NAVIGATE CART
  if (query.match(/\b(go to|open|show|view|check)\b.*\bcart\b/) || query === "view cart" || query === "show cart") {
    speak("Opening your shopping cart");
    navigateTo("cart");
    return;
  }
  
  // NAVIGATE CHECKOUT
  if (query.match(/\b(go to|open|show)\b.*\b(checkout|payment)\b/) || query === "checkout" || query === "proceed to checkout") {
    if (STATE.cart.length === 0) {
      speak("Your cart is empty. Please add items before checking out.");
      showToast("Cart is empty!", "error");
    } else {
      speak("Opening secure checkout wizard");
      navigateTo("checkout");
    }
    return;
  }
  
  // NAVIGATE CONTACT
  if (query.match(/\b(go to|open|show)\b.*\b(contact|support)\b/) || query === "contact us" || query === "support") {
    speak("Opening support and contact page");
    navigateTo("contact");
    return;
  }
  
  // SCROLL DOWN
  if (query === "scroll down" || query === "page down") {
    speak("Scrolling down");
    window.scrollBy({ top: 520, behavior: 'smooth' });
    return;
  }
  
  // SCROLL UP
  if (query === "scroll up" || query === "page up") {
    speak("Scrolling up");
    window.scrollBy({ top: -520, behavior: 'smooth' });
    return;
  }
  
  // SCROLL TO TOP
  if (query === "go to top" || query === "scroll to top" || query === "top") {
    speak("Scrolling back to top");
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  
  // SCROLL TO BOTTOM
  if (query === "go to bottom" || query === "scroll to bottom" || query === "bottom") {
    speak("Scrolling to the bottom");
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    return;
  }
  
  // BROWSER HISTORIES BACK/FORWARD
  if (query === "go back" || query === "previous page") {
    if (STATE.viewHistory.length > 1) {
      STATE.viewHistory.pop(); // Remove current
      const last = STATE.viewHistory.pop(); // Grab previous
      speak("Going back");
      navigateTo(last);
    } else {
      speak("No history to go back");
    }
    return;
  }
  
  // SEARCH FOR KEYWORD
  if (query.startsWith("search for ") || query.startsWith("find ") || query.startsWith("search ")) {
    let keyword = "";
    if (query.startsWith("search for ")) keyword = query.substring(11);
    else if (query.startsWith("find ")) keyword = query.substring(5);
    else if (query.startsWith("search ")) keyword = query.substring(7);
    
    keyword = keyword.trim();
    if (keyword) {
      speak(`Searching catalog for ${keyword}`);
      STATE.searchQuery = keyword;
      
      // Update DOM Search Input text
      const searchBox = document.getElementById("product-search-input");
      if (searchBox) searchBox.value = keyword;
      
      navigateTo("shop");
      renderProducts();
    }
    return;
  }
  
  // OPEN SPECIFIC PRODUCT
  if (query.startsWith("open product ") || query.startsWith("view product ") || query.startsWith("open ") || query.startsWith("view ")) {
    let targetName = "";
    if (query.startsWith("open product ")) targetName = query.substring(13);
    else if (query.startsWith("view product ")) targetName = query.substring(13);
    else if (query.startsWith("open ")) targetName = query.substring(5);
    else if (query.startsWith("view ")) targetName = query.substring(5);
    
    targetName = targetName.trim();
    if (targetName) {
      // Direct Lookup in Products Database by matching substring
      const product = PRODUCTS.find(p => p.name.toLowerCase().includes(targetName));
      if (product) {
        speak(`Opening product page for ${product.name}`);
        navigateTo("product", product.id);
      } else {
        speak(`I couldn't find a product matching ${targetName} in our store.`);
        showToast("Product not found!", "error");
      }
    }
    return;
  }
  
  // SELECT SIZES
  if (query.startsWith("select size ") || query.startsWith("choose size ") || query.startsWith("size ")) {
    let sizeVal = "";
    if (query.startsWith("select size ")) sizeVal = query.substring(12);
    else if (query.startsWith("choose size ")) sizeVal = query.substring(12);
    else if (query.startsWith("size ")) sizeVal = query.substring(5);
    
    sizeVal = sizeVal.trim().toUpperCase();
    
    // Normalize word equivalents to standard letters
    if (sizeVal === "SMALL") sizeVal = "S";
    else if (sizeVal === "MEDIUM") sizeVal = "M";
    else if (sizeVal === "LARGE") sizeVal = "L";
    else if (sizeVal === "EXTRA LARGE" || sizeVal === "XLARGE") sizeVal = "XL";
    
    if (STATE.currentView !== "product" || !STATE.activeProductId) {
      speak("You can only choose sizes on a product details page. Please open a product first.");
      showToast("Open a product detail page first!", "error");
      return;
    }
    
    const product = PRODUCTS.find(p => p.id === STATE.activeProductId);
    if (product) {
      const matchedSize = product.sizes.find(s => s.toUpperCase() === sizeVal);
      if (matchedSize) {
        selectSize(matchedSize);
      } else {
        speak(`Size ${sizeVal} is not available for this product. Available sizes are ${product.sizes.join(", ")}`);
        showToast(`Available: ${product.sizes.join(", ")}`, "error");
      }
    }
    return;
  }
  
  // ADD PRODUCT TO CART (If on details page)
  if (query === "add to cart" || query === "add this" || query === "add this to cart" || query === "buy this") {
    if (STATE.currentView !== "product" || !STATE.activeProductId) {
      speak("Please select and open a product before adding it to your cart.");
      showToast("Open product details page first!", "error");
      return;
    }
    
    addToCart(STATE.activeProductId, STATE.selectedSize);
    return;
  }
  
  // COMPACT MULTI-STAGES "ADD [Product] IN SIZE [Size] TO CART"
  if (query.includes("add ") && query.includes(" to cart")) {
    // Example: "add Luxe Cotton Slim Shirt in size large to cart"
    let extract = query.substring(4, query.indexOf(" to cart")).trim();
    let sizeSpec = "";
    
    if (extract.includes(" in size ")) {
      const parts = extract.split(" in size ");
      extract = parts[0].trim();
      sizeSpec = parts[1].trim().toUpperCase();
      
      if (sizeSpec === "SMALL" || sizeSpec === "MEDIUM" || sizeSpec === "LARGE" || sizeSpec === "EXTRA LARGE") {
        if (sizeSpec === "SMALL") sizeSpec = "S";
        if (sizeSpec === "MEDIUM") sizeSpec = "M";
        if (sizeSpec === "LARGE") sizeSpec = "L";
        if (sizeSpec === "EXTRA LARGE") sizeSpec = "XL";
      }
    }
    
    const product = PRODUCTS.find(p => p.name.toLowerCase().includes(extract));
    if (product) {
      speak(`Configuring and adding ${product.name} to cart`);
      navigateTo("product", product.id);
      
      // Delay slightly for render cycles to settle
      setTimeout(() => {
        if (sizeSpec && product.sizes.includes(sizeSpec)) {
          selectSize(sizeSpec);
          setTimeout(() => {
            addToCart(product.id, sizeSpec);
          }, 800);
        } else if (product.sizes.length > 0 && product.sizes[0] !== "Standard") {
          speak(`Please say choose size, and select a size for this garment. Available options are ${product.sizes.join(", ")}`);
          showToast(`Choose size: ${product.sizes.join(", ")}`, "info");
        } else {
          addToCart(product.id, "Standard");
        }
      }, 600);
    } else {
      speak(`I couldn't locate a product matching ${extract}`);
      showToast("Product matching keyword not found", "error");
    }
    return;
  }
  
  // SELECT PAYMENT METHODS
  if (query.match(/\b(select|choose|use)\b.*\b(cash|cod|delivery)\b/) || query === "cash on delivery" || query === "cod") {
    if (STATE.currentView !== "checkout") {
      speak("You can only configure payment method on the checkout wizard page.");
      showToast("Navigate to Checkout view first", "error");
      return;
    }
    selectPaymentMethod("cod");
    return;
  }
  
  if (query.match(/\b(select|choose|use)\b.*\b(online|razorpay|card|upi)\b/) || query === "razorpay" || query === "online payment") {
    if (STATE.currentView !== "checkout") {
      speak("You can only configure payment method on the checkout wizard page.");
      showToast("Navigate to Checkout view first", "error");
      return;
    }
    selectPaymentMethod("online");
    return;
  }
  
  // PLACE / SUBMIT ORDER (Checkout Submit)
  if (query === "place order" || query === "submit order" || query === "confirm order" || query === "complete purchase") {
    if (STATE.currentView !== "checkout") {
      speak("Please navigate to the checkout page to submit your order.");
      showToast("Navigate to checkout first", "error");
      return;
    }
    
    // Auto-fill mock customer details if left blank for seamless handsfree experience!
    const fields = [
      { id: "ship-firstname", val: "Aria" },
      { id: "ship-lastname", val: "Sharma" },
      { id: "ship-email", val: "aria@example.com" },
      { id: "ship-address", val: "45 Cyber Boulevard, Suite 10" },
      { id: "ship-city", val: "Mumbai" },
      { id: "ship-pincode", val: "400001" }
    ];
    
    let autofilled = false;
    fields.forEach(field => {
      const el = document.getElementById(field.id);
      if (el && !el.value.trim()) {
        el.value = field.val;
        autofilled = true;
      }
    });
    
    if (autofilled) {
      speak("Auto-completed shipping details with mock profile data for hands-free convenience.");
      showToast("Auto-filled Shipping Info!", "info");
    }
    
    setTimeout(() => {
      if (STATE.activePaymentMethod === "online") {
        startRazorpayPayment();
      } else {
        submitOrder();
      }
    }, 1200);
    return;
  }
  
  // CLEAR CART
  if (query === "clear cart" || query === "empty cart" || query === "reset cart") {
    clearCart();
    return;
  }
  
  // FAILED MATCHES
  speak("Sorry, I didn't recognize that command. Try asking to go to shop or search for headphones.");
  showToast("Voice Command Not Recognized", "error");
}
