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

    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();

    showNotification(`Produit "${name}" ajouté au panier !`);
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
      <span class="cart-price">${item.price.toFixed(2)} DT</span>
      <button class="cart-delete" onclick="confirmRemove(${index})">Supprimer</button>
    `;

    container.appendChild(row);
    total += item.price;
  });

  totalEl.textContent = total.toFixed(2);
}

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
