let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCartDisplay();

let deleteIndex = null;
//  AJOUT AU PANIER
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();

    const productCard = this.closest(".card-main");
    const name = productCard.querySelector("h2").textContent;
    const price = parseFloat(
      productCard.querySelector(".price").textContent.replace("DT", "")
    );

    const qtyInput = productCard.querySelector(".qty-input");
    const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

    // 👉 Vérifier si le produit existe déjà
    const existing = cart.find((item) => item.name === name);

    if (existing) {
      // Augmenter la quantité
      existing.quantity += quantity;
      showNotification(`${existing.quantity} × "${name}" dans le panier.`);
    } else {
      // Ajouter un nouveau produit
      cart.push({ name, price, quantity });
      showNotification(`${quantity} × "${name}" ajouté(s) au panier !`);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
  });
});

//  SUPPRESSION PRODUIT
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
}

//  AFFICHAGE DU PANIER
function updateCartDisplay() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("total-amount");

  if (!container || !totalEl) return;

  container.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.classList.add("cart-row");

    row.innerHTML = `
  <span class="cart-name">${item.name}</span>

  <div class="cart-qty">
    <button class="qty-minus" data-index="${index}">−</button>
    <span class="qty-value">${item.quantity}</span>
    <button class="qty-plus" data-index="${index}">+</button>
  </div>

  <span class="cart-price">${(item.price * item.quantity).toFixed(2)} DT</span>

  <button class="cart-delete" onclick="confirmRemove(${index})">Supprimer</button>
`;

    container.appendChild(row);
    total += item.price * (item.quantity || 1);
  });

  totalEl.textContent = total.toFixed(2);
}
// Gestion + / -
document.addEventListener("click", function (e) {
  // Bouton +
  if (e.target.classList.contains("qty-plus")) {
    const index = e.target.dataset.index;
    cart[index].quantity++;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
  }

  // Bouton -
  if (e.target.classList.contains("qty-minus")) {
    const index = e.target.dataset.index;

    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      // Si quantité = 1 → confirmation suppression
      confirmRemove(index);
      return;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
  }
});
//favoris
document.querySelectorAll(".fav-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const name = this.dataset.name;

    favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.includes(name)) {
      favorites.push(name);
      localStorage.setItem("favorites", JSON.stringify(favorites));

      showNotification(`"${name}" ajouté aux favoris ❤️`);
      loadFavoriteSlider(); // 🔥 Met le slider à jour instantanément
    } else {
      showNotification(`"${name}" est déjà dans les favoris`, "#777");
    }
  });
});

//slider
function loadFavoriteSlider() {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const slider = document.getElementById("favoritesSlider");
  slider.innerHTML = "";

  if (favorites.length === 0) {
    slider.innerHTML = '<p class="no-favs">Aucun favori pour le moment.</p>';
    return;
  }

  favorites.forEach((favName, index) => {
    // Find matching product card
    const productCard = [...document.querySelectorAll(".product")].find(
      (card) =>
        card.querySelector("h2") &&
        card.querySelector("h2").textContent.trim() === favName
    );

    if (productCard) {
      const imgSrc = productCard.querySelector("img").src;

      const item = document.createElement("div");
      item.classList.add("fav-item");
      item.innerHTML = `
        <img src="${imgSrc}" alt="${favName}">
        <h3>${favName}</h3>
        <button class="delete-one-btn" data-index="${index}">Supprimer</button>
      `;

      slider.appendChild(item);
    }
  });

  // 🔥 Handle delete buttons
  document.querySelectorAll(".delete-one-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const index = btn.dataset.index;

      favorites.splice(index, 1); // remove from array
      localStorage.setItem("favorites", JSON.stringify(favorites));

      loadFavoriteSlider(); // refresh view

      showNotification("Favori supprimé ❌");
    });
  });
}
// Slider navigation
document.getElementById("prevFav").addEventListener("click", () => {
  document.getElementById("favoritesSlider").scrollLeft -= 200;
});

document.getElementById("nextFav").addEventListener("click", () => {
  document.getElementById("favoritesSlider").scrollLeft += 200;
});

window.addEventListener("load", loadFavoriteSlider);

//  NOTIFICATION
function showNotification(message, bgColor = "#ff69b4") {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.backgroundColor = bgColor;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 2500);
}
//favoris delete all:
document.getElementById("deleteAllFavs").addEventListener("click", () => {
  favorites = [];
  localStorage.setItem("favorites", JSON.stringify(favorites));

  loadFavoriteSlider(); // 🔥 Refresh instantané

  if (typeof showNotification === "function") {
    showNotification("Tous les favoris ont été supprimés 🗑️");
  }
});

//  MODAL DE CONFIRMATION
function confirmRemove(index) {
  deleteIndex = index;
  const productName = cart[index].name;
  document.getElementById(
    "modalText"
  ).textContent = `Continuer la suppression de "${productName}" ?`;
  document.getElementById("confirmModal").style.display = "flex";
}

document.getElementById("modalYes").addEventListener("click", () => {
  const name = cart[deleteIndex].name;
  removeItem(deleteIndex);
  document.getElementById("confirmModal").style.display = "none";
  showNotification(`Produit "${name}" supprimé !`, "#ff1493");
});

document.getElementById("modalNo").addEventListener("click", () => {
  document.getElementById("confirmModal").style.display = "none";
});

document.getElementById("modalClose").addEventListener("click", () => {
  document.getElementById("confirmModal").style.display = "none";
});
/*Supprimer tout */
document.getElementById("clearCartBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    showNotification("Le panier est déjà vide !", "#555");
    return;
  }
  document.getElementById("modalText").textContent =
    "Continuer la suppression de TOUS les produits ?";
  document.getElementById("confirmModal").style.display = "flex";

  deleteIndex = "all";
});
document.getElementById("modalYes").addEventListener("click", () => {
  if (deleteIndex === "all") {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
    showNotification("Tous les produits ont été supprimés !", "#ff1493");
  } else {
    const name = cart[deleteIndex].name;
    removeItem(deleteIndex);
    showNotification(`Produit "${name}" supprimé !`, "#ff1493");
  }

  deleteIndex = null;
  document.getElementById("confirmModal").style.display = "none";
});
//Filtrage
const savedFilter = localStorage.getItem("selectedFilter") || "all";
function applyFilter(filter) {
  const products = document.querySelectorAll(".card-main");

  products.forEach((product) => {
    if (filter === "all" || product.classList.contains(filter)) {
      product.style.display = "flex";
    } else {
      product.style.display = "none";
    }
  });

  // Effet visuel
  document
    .querySelectorAll(".category-card")
    .forEach((c) => c.classList.remove("active-cat"));
  const activeCard = document.querySelector(
    `.category-card[data-filter="${filter}"]`
  );
  if (activeCard) activeCard.classList.add("active-cat");
}
applyFilter(savedFilter);
//  FILTRAGE + SAUVEGARDE LOCALSTORAGE
document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("click", () => {
    const filter = card.getAttribute("data-filter");
    applyFilter(filter);
    localStorage.setItem("selectedFilter", filter);
  });
});

// Empêcher le rechargement de la page pour les boutons Commander
document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Commande cliquée sans rechargement !");
  });
});
//Filtrage : affichage de tout
const showAllBtn = document.getElementById("showAll");
const products = document.querySelectorAll(".product");

showAllBtn.addEventListener("click", () => {
  products.forEach((prod) => {
    prod.style.display = "block";
  });
});

document.querySelectorAll(".disabled-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
  });
});
//preloader
// Duration in milliseconds
const loadingDuration = 1500; 

// Show preloader immediately
const preloader = document.getElementById("preloader");
preloader.style.display = "flex"; // make sure it is visible

// Hide preloader after fixed duration
setTimeout(() => {
  preloader.style.opacity = "0";
  preloader.style.transition = "opacity 0.5s ease";
  setTimeout(() => {
    preloader.style.display = "none";
  }, 500); // match fade duration
}, loadingDuration);
