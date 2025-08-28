// Fetch products from backend API
if (document.getElementById("productList")) {
    fetch("http://localhost:3000/api/products")
        .then(res => res.json())
        .then(products => {
            const productList = document.getElementById("productList");
            productList.innerHTML = products.map(p => `
        <div class="bg-white p-4 shadow rounded">
          <h3 class="font-bold">${p.name}</h3>
          <p>₹${p.price}</p>
          <button onclick='addToCart(${JSON.stringify(p)})' class="bg-blue-600 text-white px-3 py-1 mt-2 rounded">Add to Cart</button>
        </div>
      `).join("");
        });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(p => p._id === product._id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
}

// Load cart
if (document.getElementById("cartItems")) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const list = document.getElementById("cartItems");
    let total = 0;
    list.innerHTML = cart.map(p => {
        total += p.qty * p.price;
        return `
      <div class="bg-white p-4 shadow rounded">
        <h4 class="font-bold">${p.name}</h4>
        <p>Price: ₹${p.price}</p>
        <p>Qty: ${p.qty}</p>
        <button onclick="removeFromCart('${p._id}')" class="text-red-600 mt-2">Remove</button>
      </div>
    `;
    }).join("");
    document.getElementById("totalAmount").innerText = total;
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(p => p._id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
}
