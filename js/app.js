// Estado del carrito
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

const $ = sel => document.querySelector(sel);

// Actualiza contador y guarda
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  $('#cartCount').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  renderCart();
}

// Añadir al carrito
function addToCart(productEl) {
  const id = Number(productEl.dataset.id);
  const name = productEl.dataset.name;
  const price = Number(productEl.dataset.price);
  const image = productEl.dataset.image;

  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id, name, price, image, qty: 1 });

  saveCart();
  toggleModal('#cartModal', true);
}

// Render del carrito
function renderCart() {
  const list = $('#cartList');
  list.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name} — $${item.price.toLocaleString('es-CO')}</span>
      <div class="qty">
        <button data-action="dec">-</button>
        <strong>${item.qty}</strong>
        <button data-action="inc">+</button>
        <button data-action="rm">Eliminar</button>
      </div>
    `;
    li.querySelector('[data-action="dec"]').onclick = () => {
      if (item.qty > 1) { item.qty -= 1; saveCart(); }
    };
    li.querySelector('[data-action="inc"]').onclick = () => {
      item.qty += 1; saveCart();
    };
    li.querySelector('[data-action="rm"]').onclick = () => {
      cart = cart.filter(i => i.id !== item.id);
      saveCart();
    };
    list.appendChild(li);
  });

  $('#cartTotal').textContent = total.toLocaleString('es-CO');
}

// Modales
function toggleModal(sel, show) {
  const modal = $(sel);
  modal.classList.toggle('hidden', !show);
}

// Eventos principales
function init() {
  // Botones "Añadir al carrito"
  document.querySelectorAll('.addToCart').forEach(btn => {
    btn.addEventListener('click', (e) => addToCart(e.target.closest('.producto')));
  });

  // Carrito
  $('#cartBtn').onclick = () => toggleModal('#cartModal', true);
  $('#closeCart').onclick = () => toggleModal('#cartModal', false);

  // Checkout
  $('#checkoutBtn').onclick = () => toggleModal('#checkoutModal', true);
  $('#closeCheckout').onclick = () => toggleModal('#checkoutModal', false);

  // Pago simulado
  $('#payBtn').onclick = () => {
    const customer = {
      name: $('#name').value.trim(),
      email: $('#email').value.trim(),
      address: $('#address').value.trim(),
    };
    if (!customer.name || !customer.email || !customer.address) {
      alert('Completa todos los datos');
      return;
    }
    if (!cart.length) {
      alert('Tu carrito está vacío');
      return;
    }
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    alert(`Gracias, ${customer.name}. Pedido creado por $${total.toLocaleString('es-CO')} (simulado).`);
    cart = [];
    saveCart();
    toggleModal('#checkoutModal', false);
    toggleModal('#cartModal', false);
  };

  // Inicial
  saveCart();
  renderCart();
}

document.addEventListener('DOMContentLoaded', init);