function toggleMenu() {
  const header = document.querySelector(".wrapper .header");
  const toggleMenu = document.querySelector(".wrapper .header .toggle-menu");
  const navbarUl = document.querySelector(".navbar ul");
  const openIcon = document.querySelector(".fa-bars");
  const closeIcon = document.querySelector(".fa-xmark");

  header.style.transition = "none";
  navbarUl.style.transition = "none";

  setTimeout(() => {
    header.style.transition = "max-height 0.5s ease";
    navbarUl.style.transition = "transform 0.5s ease, opacity 0.5s ease";
  }, 0);

  header.classList.remove("expanded");
  navbarUl.classList.remove("show");
  openIcon.style.display = "block";
  closeIcon.style.display = "none";

  toggleMenu.addEventListener("click", () => {
    if (navbarUl.classList.contains("show")) {
      navbarUl.classList.remove("show");
      header.classList.remove("expanded");
      openIcon.style.display = "block";
      closeIcon.style.display = "none";
    } else {
      navbarUl.classList.add("show");
      header.classList.add("expanded");
      openIcon.style.display = "none";
      closeIcon.style.display = "block";
    }
  });
}
toggleMenu();

function setActiveLink() {
  const links = document.querySelectorAll(".wrapper .header .navbar ul li a");
  const currentUrl = window.location.href;

  links.forEach((link) => {
    link.classList.remove("active");

    if (link.href === currentUrl) {
      link.classList.add("active");
    }
  });
}
setActiveLink();

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cartCountElement = document.querySelector(".cart-count");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}

function addToCart(event) {
  const button = event.target;
  const id = parseInt(button.getAttribute("data-id"));
  const name = button.getAttribute("data-name");
  const price = parseFloat(button.getAttribute("data-price"));
  const image = button.getAttribute("data-image");

  const existingProduct = cart.find((item) => item.id === id);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id,
      name,
      price,
      image,
      quantity: 1,
    });
  }

  saveCart();
  updateCartCount();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  if (cart.length === 0) {
    renderEmptyCartMessage();
  } else {
    renderCart();
  }

  updateCartCount();
}

function updateQuantity(productId, newQuantity) {
  const product = cart.find((item) => item.id === productId);
  if (product) {
    product.quantity = newQuantity > 1 ? newQuantity : 1;
  }
  saveCart();
  renderCart();
}

function renderEmptyCartMessage() {
  const cartItemsContainer = document.querySelector(".cart-items");
  const totalPriceContainer = document.querySelector(".total-price");

  if (cartItemsContainer && totalPriceContainer) {
    cartItemsContainer.innerHTML = "<li>Вашата количка е празна.</li>";
    totalPriceContainer.textContent = "0.00лв";
  }
}

function renderCart() {
  const cartItemsContainer = document.querySelector(".cart-items");
  const totalPriceContainer = document.querySelector(".total-price");

  if (!cartItemsContainer || !totalPriceContainer) return;

  if (cart.length === 0) {
    renderEmptyCartMessage();
    return;
  }

  cartItemsContainer.innerHTML = "";
  let totalPrice = 0;

  cart.forEach((product) => {
    const itemElement = document.createElement("li");
    itemElement.classList.add("cart-item");
    itemElement.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="cart-item-details">
        <h3>${product.name}</h3>
        <p>Цена: ${product.price.toFixed(2)}лв</p>
        <p>Количество:
          <button class="quantity-decrease" data-id="${product.id}">-</button>
          <span>${product.quantity}</span>
          <button class="quantity-increase" data-id="${product.id}">+</button>
        </p>
      </div>
      <span class="cart-item-price">${(
        product.price * product.quantity
      ).toFixed(2)}лв</span>
      <button class="remove-item" data-id="${product.id}">Премахни</button>
    `;
    cartItemsContainer.appendChild(itemElement);

    totalPrice += product.price * product.quantity;
  });

  totalPriceContainer.textContent = `${totalPrice.toFixed(2)}лв`;

  document.querySelectorAll(".quantity-increase").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = parseInt(event.target.getAttribute("data-id"));
      updateQuantity(
        productId,
        cart.find((item) => item.id === productId).quantity + 1
      );
    });
  });

  document.querySelectorAll(".quantity-decrease").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = parseInt(event.target.getAttribute("data-id"));
      const product = cart.find((item) => item.id === productId);

      if (product.quantity > 1) {
        updateQuantity(productId, product.quantity - 1);
      }
    });
  });

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = parseInt(event.target.getAttribute("data-id"));
      removeFromCart(productId);
    });
  });
}

function initializeApp() {
  if (document.querySelector(".buy-button")) {
    document.querySelectorAll(".buy-button").forEach((button) => {
      button.addEventListener("click", addToCart);
    });
  }

  if (document.querySelector(".cart-items")) {
    if (cart.length === 0) {
      renderEmptyCartMessage();
    } else {
      renderCart();
    }
  }

  updateCartCount();
}

initializeApp();