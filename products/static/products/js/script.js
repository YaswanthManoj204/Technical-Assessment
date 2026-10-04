'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. DOM ELEMENTS & STATE
     ========================================== */

  // Navbar
  const navbar = document.querySelector('.navbar');

  // Mobile Nav Elements
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

  // Search Elements
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchBtns = document.querySelectorAll('.search-btn');
  const searchClose = document.querySelector('.search-close');

  // Cart Elements
  const cartOverlay = document.getElementById('cartOverlay');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartTotal = document.getElementById('cartTotal');
  const cartCount = document.getElementById('cartCount');
  const cartBtns = document.querySelectorAll('.cart-btn');
  const cartCloseBtn = document.querySelector('.cart-close');

  // Toast Elements
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout;

  // Newsletter Elements
  const newsletterForm = document.querySelector('.newsletter-form');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterMessage = document.getElementById('newsletterMessage');

  // Scroll Reveal Elements
  const revealElements = document.querySelectorAll('.reveal');

  /* ==========================================
     2. DYNAMIC PRODUCT DATA FROM DJANGO
     ========================================== */

  /*
   * Products are now read directly from the
   * Django-generated product cards.
   *
   * No hardcoded products here.
   */

  const productCards = document.querySelectorAll('.product-card');

  const products = Array.from(productCards).map(card => {

    const image = card.querySelector('.product-image img');
    const description = card.querySelector('.product-description');

    return {
      id: Number(card.dataset.productId),
      name: card.dataset.name || '',
      description: description
        ? description.textContent.trim()
        : '',
      price: Number(card.dataset.price) || 0,
      category: card.querySelector('.product-category')
        ? card.querySelector('.product-category').textContent.trim()
        : '',
      image: image ? image.src : ''
    };

  });

  // Cart State
  let cart = [];

  /* ==========================================
     3. MOBILE NAVIGATION
     ========================================== */

  function openMobileNav() {

    if (mobileNav && mobileNavOverlay) {

      mobileNav.classList.add('active');
      mobileNavOverlay.classList.add('active');

      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileNav() {

    if (mobileNav && mobileNavOverlay) {

      mobileNav.classList.remove('active');
      mobileNavOverlay.classList.remove('active');

      document.body.style.overflow = '';
    }
  }

  /* ==========================================
     4. NAVBAR SCROLL EFFECT
     ========================================== */

  function handleNavbarScroll() {

    if (!navbar) return;

    if (window.scrollY > 50) {

      navbar.classList.add('scrolled');

    } else {

      navbar.classList.remove('scrolled');

    }
  }

  /* ==========================================
     5. SEARCH FUNCTIONALITY
     ========================================== */

  function openSearch() {

    if (searchOverlay && searchInput) {

      searchOverlay.classList.add('active');

      setTimeout(() => {
        searchInput.focus();
      }, 100);

      document.body.style.overflow = 'hidden';
    }
  }

  function closeSearch() {

    if (searchOverlay) {

      searchOverlay.classList.remove('active');

      if (searchInput) {
        searchInput.value = '';
      }

      if (searchResults) {
        searchResults.innerHTML = '';
      }

      document.body.style.overflow = '';
    }
  }

  function handleSearch(e) {

    const query = e.target.value.trim().toLowerCase();

    if (!query) {

      if (searchResults) {
        searchResults.innerHTML = '';
      }

      return;
    }

    const matches = products.filter(product =>

      product.name.toLowerCase().includes(query) ||

      product.description.toLowerCase().includes(query) ||

      product.category.toLowerCase().includes(query)

    );

    if (matches.length > 0) {

      searchResults.innerHTML = matches.map(product => `

        <div
          class="search-result-item"
          data-product-id="${product.id}"
        >

          <img
            src="${product.image}"
            alt="${product.name}"
            class="result-visual"
            style="
              width:48px;
              height:48px;
              border-radius:10px;
              flex-shrink:0;
              object-fit:contain;
            "
          >

          <div class="result-info">

            <h4>${product.name}</h4>

            <p>${product.description}</p>

          </div>

          <span class="result-price">
            ₹${product.price.toLocaleString('en-IN')}
          </span>

        </div>

      `).join('');

    } else {

      searchResults.innerHTML = `
        <div class="search-no-results">
          No products found for "${e.target.value.trim()}"
        </div>
      `;
    }
  }

  /* ==========================================
     6. CART FUNCTIONALITY
     ========================================== */

  function loadCart() {

    try {

      const savedCart = localStorage.getItem('novaStoreCart');

      cart = savedCart
        ? JSON.parse(savedCart)
        : [];

    } catch (e) {

      cart = [];
    }
  }

  function saveCart() {

    localStorage.setItem(
      'novaStoreCart',
      JSON.stringify(cart)
    );
  }

  function addToCart(productId) {

    const id = parseInt(productId, 10);

    const product = products.find(
      product => product.id === id
    );

    if (!product) return;

    const existingItem = cart.find(
      item => item.id === id
    );

    if (existingItem) {

      existingItem.quantity += 1;

    } else {

      cart.push({
        ...product,
        quantity: 1
      });

    }

    saveCart();

    updateCartUI();

    showToast(
      `${product.name} added to cart`
    );
  }

  function removeFromCart(productId) {

    const id = parseInt(productId, 10);

    cart = cart.filter(
      item => item.id !== id
    );

    saveCart();

    updateCartUI();
  }

  function updateQuantity(productId, change) {

    const id = parseInt(productId, 10);

    const item = cart.find(
      item => item.id === id
    );

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {

      removeFromCart(id);

    } else {

      saveCart();

      updateCartUI();
    }
  }

  function updateCartUI() {

    const totalItems = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const totalPrice = cart.reduce(
      (sum, item) =>
        sum + (item.price * item.quantity),
      0
    );

    /* ------------------------------------------
       Cart Count
       ------------------------------------------ */

    if (cartCount) {

      cartCount.textContent = totalItems;

      if (totalItems > 0) {

        cartCount.classList.add('has-items');

      } else {

        cartCount.classList.remove('has-items');
      }
    }

    /* ------------------------------------------
       Cart Total
       ------------------------------------------ */

    if (cartTotal) {

      cartTotal.textContent =
        `₹${totalPrice.toLocaleString('en-IN')}`;
    }

    /* ------------------------------------------
       Empty Cart
       ------------------------------------------ */

    if (totalItems === 0) {

      if (cartEmpty) {
        cartEmpty.style.display = 'block';
      }

      if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
      }

      return;
    }

    /* ------------------------------------------
       Cart Items
       ------------------------------------------ */

    if (cartEmpty) {
      cartEmpty.style.display = 'none';
    }

    if (cartItemsContainer) {

      cartItemsContainer.innerHTML = cart.map(item => `

        <div class="cart-item">

          <div class="cart-item-image">

            <img
              src="${item.image}"
              alt="${item.name}"
              style="
                width:100%;
                height:100%;
                object-fit:contain;
                border-radius:10px;
              "
            >

          </div>

          <div class="cart-item-info">

            <div class="cart-item-name">
              ${item.name}
            </div>

            <div class="cart-item-price">
              ₹${item.price.toLocaleString('en-IN')}
            </div>

            <div class="cart-item-quantity">

              <button
                class="qty-btn minus"
                data-id="${item.id}"
              >
                −
              </button>

              <span>
                ${item.quantity}
              </span>

              <button
                class="qty-btn plus"
                data-id="${item.id}"
              >
                +
              </button>

            </div>

          </div>

          <button
            class="cart-item-remove"
            data-id="${item.id}"
          >
            Remove
          </button>

        </div>

      `).join('');
    }
  }

  /* ==========================================
     7. CART OPEN / CLOSE
     ========================================== */

  function openCart() {

    if (cartOverlay && cartDrawer) {

      cartOverlay.classList.add('active');

      cartDrawer.classList.add('active');

      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {

    if (cartOverlay && cartDrawer) {

      cartOverlay.classList.remove('active');

      cartDrawer.classList.remove('active');

      document.body.style.overflow = '';
    }
  }

  /* ==========================================
     8. TOAST NOTIFICATIONS
     ========================================== */

  function showToast(
    message,
    duration = 3000
  ) {

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;

    toast.classList.add('active');

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {

      toast.classList.remove('active');

    }, duration);
  }

  /* ==========================================
     9. NEWSLETTER VALIDATION
     ========================================== */

  function handleNewsletter(e) {

    e.preventDefault();

    if (!newsletterEmail || !newsletterMessage) {
      return;
    }

    const email =
      newsletterEmail.value.trim();

    const isValid =
      email.length > 0 &&
      email.includes('@') &&
      email.includes('.');

    if (isValid) {

      newsletterMessage.textContent =
        'Thanks for subscribing!';

      newsletterMessage.style.color =
        '#34c759';

      newsletterEmail.value = '';

      showToast(
        'Successfully subscribed!'
      );

    } else {

      newsletterMessage.textContent =
        'Please enter a valid email address.';

      newsletterMessage.style.color =
        '#ff3b30';
    }
  }

  /* ==========================================
     10. SCROLL REVEAL ANIMATIONS
     ========================================== */

  function initScrollReveal() {

    if (revealElements.length === 0) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries, obs) => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                'revealed'
              );

              obs.unobserve(entry.target);
            }

          });

        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

    revealElements.forEach(element => {
      observer.observe(element);
    });
  }

  /* ==========================================
     11. SMOOTH SCROLL
     ========================================== */

  function initSmoothScroll() {

    document
      .querySelectorAll('a[href^="#"]')
      .forEach(anchor => {

        anchor.addEventListener(
          'click',
          function (e) {

            const targetId =
              this.getAttribute('href');

            if (targetId === '#') {
              return;
            }

            const targetElement =
              document.querySelector(targetId);

            if (targetElement) {

              e.preventDefault();

              targetElement.scrollIntoView({
                behavior: 'smooth'
              });
            }

          }
        );
      });
  }

  /* ==========================================
     12. EVENT LISTENERS
     ========================================== */

  function setupEventListeners() {

    /* ------------------------------------------
       Mobile Navigation
       ------------------------------------------ */

    if (hamburger) {
      hamburger.addEventListener(
        'click',
        openMobileNav
      );
    }

    if (mobileNavOverlay) {
      mobileNavOverlay.addEventListener(
        'click',
        closeMobileNav
      );
    }

    if (mobileNavClose) {
      mobileNavClose.addEventListener(
        'click',
        closeMobileNav
      );
    }

    mobileNavLinks.forEach(link => {

      link.addEventListener(
        'click',
        closeMobileNav
      );

    });

    /* ------------------------------------------
       Navbar Scroll
       ------------------------------------------ */

    window.addEventListener(
      'scroll',
      handleNavbarScroll
    );

    /* ------------------------------------------
       Search
       ------------------------------------------ */

    searchBtns.forEach(btn => {

      btn.addEventListener(
        'click',
        (e) => {

          e.preventDefault();

          openSearch();
        }
      );

    });

    if (searchClose) {

      searchClose.addEventListener(
        'click',
        closeSearch
      );
    }

    if (searchOverlay) {

      searchOverlay.addEventListener(
        'click',
        (e) => {

          if (e.target === searchOverlay) {
            closeSearch();
          }

        }
      );
    }

    if (searchInput) {

      searchInput.addEventListener(
        'input',
        handleSearch
      );
    }

    /* ------------------------------------------
       Escape Key
       ------------------------------------------ */

    document.addEventListener(
      'keydown',
      (e) => {

        if (e.key === 'Escape') {

          closeSearch();

          closeCart();

          closeMobileNav();
        }

      }
    );

    /* ------------------------------------------
       Search Result Click
       ------------------------------------------ */

    if (searchResults) {

      searchResults.addEventListener(
        'click',
        (e) => {

          const item =
            e.target.closest(
              '.search-result-item'
            );

          if (item) {

            const id =
              item.getAttribute(
                'data-product-id'
              );

            if (id) {

              addToCart(id);

              closeSearch();
            }
          }

        }
      );
    }

    /* ------------------------------------------
       Cart Open
       ------------------------------------------ */

    cartBtns.forEach(btn => {

      btn.addEventListener(
        'click',
        (e) => {

          e.preventDefault();

          openCart();
        }
      );

    });

    /* ------------------------------------------
       Cart Close
       ------------------------------------------ */

    if (cartOverlay) {

      cartOverlay.addEventListener(
        'click',
        closeCart
      );
    }

    if (cartCloseBtn) {

      cartCloseBtn.addEventListener(
        'click',
        closeCart
      );
    }

    /* ------------------------------------------
       Add To Cart
       ------------------------------------------ */

    document.addEventListener(
      'click',
      (e) => {

        const addBtn =
          e.target.closest(
            '.add-to-cart-btn'
          );

        if (!addBtn) {
          return;
        }

        const card =
          addBtn.closest(
            '.product-card'
          );

        if (!card) {
          return;
        }

        const id =
          card.getAttribute(
            'data-product-id'
          );

        if (id) {
          addToCart(id);
        }

      }
    );

    /* ------------------------------------------
       Cart Quantity / Remove
       ------------------------------------------ */

    if (cartItemsContainer) {

      cartItemsContainer.addEventListener(
        'click',
        (e) => {

          const button = e.target;

          if (
            button.classList.contains('minus')
          ) {

            updateQuantity(
              button.getAttribute('data-id'),
              -1
            );

          } else if (
            button.classList.contains('plus')
          ) {

            updateQuantity(
              button.getAttribute('data-id'),
              1
            );

          } else if (
            button.classList.contains(
              'cart-item-remove'
            )
          ) {

            removeFromCart(
              button.getAttribute('data-id')
            );
          }

        }
      );
    }

    /* ------------------------------------------
       Newsletter
       ------------------------------------------ */

    if (newsletterForm) {

      newsletterForm.addEventListener(
        'submit',
        handleNewsletter
      );
    }
  }

  /* ==========================================
     13. INITIALIZATION
     ========================================== */

  function init() {

    loadCart();

    updateCartUI();

    setupEventListeners();

    initScrollReveal();

    initSmoothScroll();

    handleNavbarScroll();
  }

  init();

});