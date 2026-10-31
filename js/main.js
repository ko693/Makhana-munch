/**
 * MAKHANA MUNCH - OFFICIAL WEBSITE JAVASCRIPT
 * Brand Tagline: Crunch Healthy. Live Happy!
 * Contact Numbers: +91 9485807604 | +91 93506 60883
 */

document.addEventListener('DOMContentLoaded', () => {
  // Official Phone Numbers (Format for WhatsApp api links)
  const PHONE_PRIMARY = '919485807604';
  const PHONE_SECONDARY = '919350660883';

  // Available Products Catalog
  const PRODUCTS = {
    'classic-salted': {
      id: 'classic-salted',
      name: 'Classic Salted Makhana',
      price: 119,
      weight: '70g',
      image: 'images/classic-salted.jpg'
    },
    'peri-peri': {
      id: 'peri-peri',
      name: 'Peri Peri Makhana',
      price: 129,
      weight: '70g',
      image: 'images/peri-peri.jpg'
    },
    'cream-and-onion': {
      id: 'cream-and-onion',
      name: 'Cream & Onion Makhana',
      price: 129,
      weight: '70g',
      image: 'images/cream-and-onion.jpg'
    },
    'pudina': {
      id: 'pudina',
      name: 'Pudina Makhana',
      price: 129,
      weight: '70g',
      image: 'images/pudina.jpg'
    },
    'combo-pack': {
      id: 'combo-pack',
      name: 'All-4 Signature Combo Box',
      price: 449,
      weight: '4 x 70g',
      image: 'images/hero.jpg'
    }
  };

  // Cart State
  let cart = [];

  // DOM Elements
  const cartToggleBtn = document.getElementById('cartToggleBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartDrawer = document.getElementById('cartDrawer');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartTotalPriceEl = document.getElementById('cartTotalPrice');
  const cartBadgeCountEl = document.getElementById('cartBadgeCount');
  const checkoutWhatsAppBtn = document.getElementById('checkoutWhatsAppBtn');
  const checkoutPhoneSelect = document.getElementById('checkoutPhoneSelect');
  const toastEl = document.getElementById('toastMsg');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const contactForm = document.getElementById('contactForm');

  // ---------------- Cart Open / Close ----------------
  function openCart() {
    cartOverlay.classList.add('active');
    cartDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartOverlay.classList.remove('active');
    cartDrawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // ---------------- Mobile Navigation Toggle ----------------
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // ---------------- Toast Notification ----------------
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3200);
  }

  // ---------------- Add to Cart ----------------
  window.addToCart = function(productId) {
    const product = PRODUCTS[productId];
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({
        ...product,
        qty: 1
      });
    }

    renderCart();
    showToast(`Added ${product.name} to cart!`);
    openCart();
  };

  // ---------------- Update Quantity ----------------
  window.updateCartQty = function(productId, delta) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;

    cart[itemIndex].qty += delta;

    if (cart[itemIndex].qty <= 0) {
      cart.splice(itemIndex, 1);
    }

    renderCart();
  };

  // ---------------- Render Cart ----------------
  function renderCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Update Badges
    if (cartBadgeCountEl) {
      cartBadgeCountEl.textContent = totalItems;
    }
    if (cartTotalPriceEl) {
      cartTotalPriceEl.textContent = `₹${totalPrice}`;
    }

    // Render Items
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-message">
          <p style="font-size: 2.2rem; margin-bottom: 10px;">🧺</p>
          <p>Your snack cart is currently empty.</p>
          <p style="font-size: 0.85rem; margin-top: 6px; color: var(--green-light);">Add some crispy roasted makhana to start!</p>
        </div>
      `;
      if (checkoutWhatsAppBtn) {
        checkoutWhatsAppBtn.style.opacity = '0.5';
        checkoutWhatsAppBtn.style.pointerEvents = 'none';
      }
      return;
    }

    if (checkoutWhatsAppBtn) {
      checkoutWhatsAppBtn.style.opacity = '1';
      checkoutWhatsAppBtn.style.pointerEvents = 'auto';
    }

    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item-row">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="cart-item-price">₹${item.price} <span style="color:#718979; font-size:0.75rem;">(${item.weight})</span></div>
        </div>
        <div class="cart-qty-ctrl">
          <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">−</button>
          <span style="font-weight: 700; min-width: 18px; text-align: center;">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
        </div>
      </div>
    `).join('');
  }

  // ---------------- Direct WhatsApp Checkout ----------------
  if (checkoutWhatsAppBtn) {
    checkoutWhatsAppBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Please add items to cart first.');
        return;
      }

      const selectedPhone = checkoutPhoneSelect ? checkoutPhoneSelect.value : PHONE_PRIMARY;
      const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

      let orderSummary = `*New Order - Makhana Munch*\n\n`;
      cart.forEach((item, index) => {
        orderSummary += `${index + 1}. ${item.name} (${item.weight}) x ${item.qty} = ₹${item.price * item.qty}\n`;
      });
      orderSummary += `\n*Total Order Value:* ₹${totalPrice}\n\n`;
      orderSummary += `Hi Makhana Munch! I would like to confirm this order. Please send delivery and payment details!`;

      const encodedMsg = encodeURIComponent(orderSummary);
      const waUrl = `https://wa.me/${selectedPhone}?text=${encodedMsg}`;

      window.open(waUrl, '_blank');
    });
  }

  // ---------------- Quick WhatsApp Order for Single Item ----------------
  window.orderSingleOnWhatsApp = function(productId, phoneChoice = PHONE_PRIMARY) {
    const product = PRODUCTS[productId];
    if (!product) return;

    const message = `Hello Makhana Munch! I'd like to order *1 pack of ${product.name}* (₹${product.price}, ${product.weight}). Please share delivery and payment details!`;
    const encodedMsg = encodeURIComponent(message);
    const waUrl = `https://wa.me/${phoneChoice}?text=${encodedMsg}`;
    window.open(waUrl, '_blank');
  };

  // ---------------- Contact & Bulk Order Form ----------------
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName')?.value.trim();
      const phone = document.getElementById('contactPhone')?.value.trim();
      const productPref = document.getElementById('contactProduct')?.value;
      const targetPhone = document.getElementById('contactTargetPhone')?.value || PHONE_PRIMARY;
      const message = document.getElementById('contactMessage')?.value.trim();

      if (!name || !phone) {
        showToast('Please enter your name and phone number.');
        return;
      }

      let formattedMessage = `*New Inquiry - Makhana Munch Website*\n\n`;
      formattedMessage += `👤 *Name:* ${name}\n`;
      formattedMessage += `📞 *Phone:* ${phone}\n`;
      if (productPref) {
        formattedMessage += `🍿 *Interest / Flavour:* ${productPref}\n`;
      }
      if (message) {
        formattedMessage += `💬 *Note / Requirement:* ${message}\n`;
      }
      formattedMessage += `\nLooking forward to hearing from your team!`;

      const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(formattedMessage)}`;
      window.open(waUrl, '_blank');
      showToast('Opening WhatsApp to send your inquiry...');
      contactForm.reset();
    });
  }

  // Initialize empty cart
  renderCart();
});
