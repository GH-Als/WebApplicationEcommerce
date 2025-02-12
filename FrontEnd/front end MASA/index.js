const apiBaseUrl = "http://localhost:8082/api/products";


document.addEventListener("DOMContentLoaded", () => {
  // Check if authToken is present in localStorage
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    // If no token is present, redirect to login.html
    window.location.href = "login.html";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true"; // Check if admin
  const authToken = localStorage.getItem("authToken"); // Check if logged in
  const navbar = document.querySelector(".navbar-nav");

  if (authToken && isAdmin) {
    // Create the "Manage Products" button
    const manageProductsButton = document.createElement("li");
    manageProductsButton.className = "nav-item";
    manageProductsButton.innerHTML = `
      <a class="nav-link me-4" href="manage.html">Manage Products</a>
    `;

    // Append the button to the navbar
    navbar.appendChild(manageProductsButton);
  }
});


document.addEventListener("DOMContentLoaded", () => {
  // Logout button functionality
  const logoutButton = document.querySelector(".logout-button");
  
  logoutButton.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    
    // Remove all relevant items from localStorage
    localStorage.removeItem("authToken"); // Remove the auth token
    localStorage.removeItem("userEmail"); // Remove the email
    localStorage.removeItem("isAdmin"); // Remove admin status
    localStorage.removeItem("cart"); // Clear the cart

    alert("You have been logged out.");
    window.location.href = "login.html"; // Redirect to login page
  });
});



// Add to Cart functionality
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-primary")) {
    const productCard = event.target.closest(".card");
    const productName = productCard.querySelector(".card-title").textContent;
    const productPrice = parseFloat(
      productCard.querySelector(".card-text").textContent.replace(" AED", "")
    );

    // Prepare item object
    const item = {
      name: productName,
      price: productPrice,
      quantity: 1,
    };

    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if item already exists
    const existingItem = cart.find((product) => product.name === item.name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(item);
    }

    // Update localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${item.name} has been added to the cart.`);
  }
});


// Load Cart (for Cart.html)
function loadCart() {
  const cartContainer = document.getElementById("cart-items-container");
  const cartTotal = document.getElementById("cart-total");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.classList.add(
      "cart-item",
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "border",
      "p-3",
      "mb-3"
    );
    cartItem.innerHTML = `
      <div>
        <h5>${item.name}</h5>
        <p>Price: ${item.price} AED</p>
        <p>Quantity: ${item.quantity}</p>
      </div>
      <div>
        <button class="btn btn-secondary btn-sm" onclick="updateQuantity(${index}, -1)">-</button>
        <button class="btn btn-secondary btn-sm" onclick="updateQuantity(${index}, 1)">+</button>
        <button class="btn btn-danger btn-sm" onclick="removeItem(${index})">Remove</button>
      </div>
    `;
    cartContainer.appendChild(cartItem);
  });

  cartTotal.textContent = `Total: ${total.toFixed(2)} AED`;
}

// Update Quantity
function updateQuantity(index, change) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart[index]) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1); // Remove item if quantity is 0
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
  }
}

// Remove Item
function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// Clear Cart
document.getElementById("clear-cart")?.addEventListener("click", () => {
  localStorage.removeItem("cart");
  loadCart();
});

// Checkout Functionality
document.getElementById("checkout-button")?.addEventListener("click", async () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const userEmail = localStorage.getItem("userEmail");

  // Validate cart and user email
  if (!cart.length) {
    alert("Your cart is empty. Please add items before checking out.");
    return;
  }

  if (!userEmail) {
    alert("You need to be logged in to checkout.");
    return;
  }

  // Prepare order data
  const order = {
    email: userEmail,
    items: cart,
  };

  try {
    // Send order to backend
    const response = await fetch("http://localhost:8082/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (response.ok) {
      alert("Checkout successful! Your order has been placed.");
      localStorage.removeItem("cart"); // Clear cart
      loadCart(); // Refresh the cart UI
    } else {
      const error = await response.text();
      alert(`Checkout failed: ${error}`);
    }
  } catch (error) {
    console.error("Error during checkout:", error);
    alert("An error occurred while processing your checkout. Please try again.");
  }
});


// Load Cart on Page Load (Cart.html)
if (window.location.pathname.endsWith("cart.html")) {
  loadCart();
}

document.addEventListener("DOMContentLoaded", async () => {
  
  if (window.location.pathname.endsWith("Shop.html")) {
    
  
  
  const productSection = document.querySelector(".row");

  try {
    const response = await fetch(`${apiBaseUrl}`); 
    if (response.ok) {
      const products = await response.json();
      productSection.innerHTML = ""; // Clear any existing static content

      products.forEach((product) => {
        if (product.stockQuantity > 0) { // Check if stockQuantity is above 0
          const productCard = `
            <div class="col">
              <div class="card h-100 shadow-sm">
                <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}" />
                <div class="card-body">
                  <h5 class="card-title">${product.name}</h5>
                  <p class="card-text textcolor">${product.price} AED</p>
                  <button class="btn btn-primary">Add to Cart</button>
                </div>
              </div>
            </div>
          `;
          productSection.innerHTML += productCard;
        }
      });
      
    } else {
      console.error("Failed to fetch products:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }

}
});


document.addEventListener("DOMContentLoaded", async () => {
  
  if (window.location.pathname.endsWith("manage.html")) {
   
  
  const productSection = document.querySelector(".row");
  const addProductBtn = document.getElementById("addProductBtn");
  const productModal = document.getElementById("productModal");
  const saveProductBtn = document.getElementById("saveProductBtn");

  // Load products from the database
  async function loadProducts() {
    try {
      const response = await fetch(`${apiBaseUrl}`);
      if (response.ok) {
        const products = await response.json();
        productSection.innerHTML = ""; // Clear existing content

        products.forEach((product) => {
          const productCard = `
            <div class="col">
              <div class="card h-100 shadow-sm">
                <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}" />
                <div class="card-body">
                  <h5 class="card-title">${product.name}</h5>
                  <p class="card-text textcolor">${product.price} AED</p>
                  <div class="d-flex justify-content-between">
                    <button class="btn btn-warning edit-btn" data-id="${product.id}">Edit</button>
                    <button class="btn btn-danger delete-btn" data-id="${product.id}">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          `;
          productSection.innerHTML += productCard;
        });

        // Attach event listeners to edit and delete buttons
        document.querySelectorAll(".edit-btn").forEach((button) => {
          button.addEventListener("click", handleEdit);
        });
        document.querySelectorAll(".delete-btn").forEach((button) => {
          button.addEventListener("click", handleDelete);
        });
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }

  // Handle add product
  addProductBtn.addEventListener("click", () => {
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
    const productModalLabel = document.getElementById("productModalLabel");
    productModalLabel.textContent = "Add Product";
    new bootstrap.Modal(productModal).show();
  });

  // Handle save product
  saveProductBtn.addEventListener("click", async () => {
    const id = document.getElementById("productId").value;
    const name = document.getElementById("productName").value;
    const imageUrl = document.getElementById("productImage").value;
    const price = parseFloat(document.getElementById("productPrice").value);
    const stockQuantity = parseInt(document.getElementById("productStock").value, 10);

    const product = { name, imageUrl, price, stockQuantity };
    const method = id ? "PUT" : "POST";
    const url = id ? `${apiBaseUrl}/${id}` : `${apiBaseUrl}`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        });

        if (response.ok) {
            alert("Product saved successfully!");
            loadProducts();
            // Explicitly close the modal
            const productModal = bootstrap.Modal.getInstance(document.getElementById("productModal"));
            productModal.hide();
            document.getElementById("productForm").reset();
        } else {
            alert("Failed to save product.");
        }
    } catch (error) {
        console.error("Error saving product:", error);
    }
  });


 // Handle edit product
  async function handleEdit(event) {
    const id = event.target.dataset.id;
    try {
        const response = await fetch(`${apiBaseUrl}/${id}`);
        if (response.ok) {
            const product = await response.json();
            document.getElementById("productId").value = product.id;
            document.getElementById("productName").value = product.name;
            document.getElementById("productImage").value = product.imageUrl;
            document.getElementById("productPrice").value = product.price;
            document.getElementById("productStock").value = product.stockQuantity;
            const productModalLabel = document.getElementById("productModalLabel");
            productModalLabel.textContent = "Edit Product";
            new bootstrap.Modal(productModal).show();
        }
    } catch (error) {
        console.error("Error fetching product details:", error);
    }
  }


  // Handle delete product
  async function handleDelete(event) {
    const id = event.target.dataset.id;
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`${apiBaseUrl}/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Product deleted successfully!");
          loadProducts();
        } else {
          alert("Failed to delete product.");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  }

  // Load products on page load
  loadProducts();
  
}
});
