/* =========================================================
   Urban Threads - script.js
   SABSE PEHLE NEECHE CONFIG ME APNI DETAILS BADAL LEIN
   ========================================================= */

const CONFIG = {
  brandName: "Urban Threads",                 // apne brand ka naam
  whatsappNumber: "919000000000",             // country code ke saath, bina + ke (India: 91...)
  phoneDisplay: "+91 90000 00000",
  email: "hello@example.com",
  address: "Main Market, Bareilly, Uttar Pradesh",
  instagram: "https://instagram.com/yourbrand",
  facebook: "https://facebook.com/yourbrand",
  currency: "₹",
  couponCode: "URBAN20"
};

/* Categories: image apni photo se badlein (images/ folder me rakhein) */
/* Photos Unsplash (free) se hain. Apni photo lagani ho to image me
   "images/apni-photo.jpg" likh dein. Ye helper Unsplash link banata hai. */
function U(id, w) {
  return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=" + (w || 800) + "&q=75";
}

const CATEGORIES = [
  { name: "Men",    image: U("1564859228273-274232fdb516", 600) },
  { name: "Women",  image: U("1625832954356-6ddaffc45853", 600) },
  { name: "Kids",   image: U("1628345703968-6767aeea2728", 600) },
  { name: "Ethnic", image: U("1610189013429-a703f4b245cf", 600) },
  { name: "Winter", image: U("1706765779494-2705542ebe74", 600) }
];

/* Products: naye products yaha add/edit karein.
   image = images/ folder me aapki photo ka naam
   oldPrice = purana daam (sale dikhane ke liye), na ho to 0 likhein
   badge = "New", "Sale", "Bestseller" ya khaali "" */
const PRODUCTS = [
  { id: 1,  name: "Classic White Shirt",      category: "Men",    price: 1199, oldPrice: 1499, badge: "Sale",       image: U("1564859228273-274232fdb516") },
  { id: 2,  name: "Slim Fit Denim Jeans",     category: "Men",    price: 1599, oldPrice: 0,    badge: "Bestseller", image: U("1714143136372-ddaf8b606da7") },
  { id: 3,  name: "Cotton Round Neck T-Shirt",category: "Men",    price: 599,  oldPrice: 799,  badge: "Sale",       image: U("1618354691373-d851c5c3a990") },
  { id: 4,  name: "Floral Summer Dress",      category: "Women",  price: 1799, oldPrice: 0,    badge: "New",        image: U("1625832954356-6ddaffc45853") },
  { id: 5,  name: "Wide Leg Palazzo Pants",   category: "Women",  price: 899,  oldPrice: 1099, badge: "Sale",       image: U("1687825515654-23620796760c") },
  { id: 6,  name: "Casual Kurti",             category: "Women",  price: 749,  oldPrice: 0,    badge: "",           image: U("1759840278381-bf7d5e332050") },
  { id: 7,  name: "Kids Casual T-Shirt",      category: "Kids",   price: 649,  oldPrice: 849,  badge: "Sale",       image: U("1628345703968-6767aeea2728") },
  { id: 8,  name: "Kids Striped Summer Dress",category: "Kids",   price: 1099, oldPrice: 0,    badge: "New",        image: U("1523881374236-dd34f6ac1226") },
  { id: 9,  name: "Embroidered Festive Sherwani", category: "Ethnic", price: 2299, oldPrice: 2799, badge: "Bestseller", image: U("1760080838961-4208536db385") },
  { id: 10, name: "Designer Silk Saree",      category: "Ethnic", price: 2999, oldPrice: 0,    badge: "New",        image: U("1610189013429-a703f4b245cf") },
  { id: 11, name: "Pullover Hooded Sweatshirt", category: "Winter", price: 1399, oldPrice: 1799, badge: "Sale",     image: U("1556821840-3a63f95609a7") },
  { id: 12, name: "Puffer Winter Jacket",     category: "Winter", price: 2499, oldPrice: 0,    badge: "New",        image: U("1706765779494-2705542ebe74") }
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

/* ---------------- Helpers ---------------- */
const $ = (id) => document.getElementById(id);
const money = (n) => CONFIG.currency + n.toLocaleString("en-IN");
let activeCategory = "All";
let searchText = "";

/* Cart localStorage me save hota hai */
let cart = [];
try { cart = JSON.parse(localStorage.getItem("ut_cart")) || []; } catch (e) { cart = []; }
const saveCart = () => { try { localStorage.setItem("ut_cart", JSON.stringify(cart)); } catch (e) {} };

/* ---------------- Config ko page par lagana ---------------- */
function applyConfig() {
  document.querySelectorAll("[data-brand]").forEach((el) => (el.textContent = CONFIG.brandName));
  document.title = CONFIG.brandName + " | Premium Clothing";
  $("addr").textContent = CONFIG.address;
  $("phoneTxt").textContent = CONFIG.phoneDisplay;
  $("mailTxt").textContent = CONFIG.email;
  $("igLink").href = CONFIG.instagram;
  $("fbLink").href = CONFIG.facebook;
  const wa = "https://wa.me/" + CONFIG.whatsappNumber;
  $("waLink").href = wa;
  $("waFloat").href = wa + "?text=" + encodeURIComponent("Hello " + CONFIG.brandName + ", mujhe kuch puchna hai.");
  $("year").textContent = new Date().getFullYear();
}

/* ---------------- Categories ---------------- */
function renderCategories() {
  $("catGrid").innerHTML = CATEGORIES.map(
    (c) => `
    <div class="cat-card fade" data-cat="${c.name}">
      <img src="${c.image}" alt="${c.name}" loading="lazy" onerror="this.style.display='none'">
      <span>${c.name}</span>
    </div>`
  ).join("");
  document.querySelectorAll(".cat-card").forEach((card) =>
    card.addEventListener("click", () => {
      setCategory(card.dataset.cat);
      $("shop").scrollIntoView({ behavior: "smooth" });
    })
  );
}

/* ---------------- Filters ---------------- */
function renderFilters() {
  const names = ["All", ...CATEGORIES.map((c) => c.name)];
  $("filters").innerHTML = names
    .map((n) => `<button class="filter-btn ${n === activeCategory ? "active" : ""}" data-f="${n}">${n}</button>`)
    .join("");
  document.querySelectorAll(".filter-btn").forEach((b) =>
    b.addEventListener("click", () => setCategory(b.dataset.f))
  );
}
function setCategory(name) {
  activeCategory = name;
  renderFilters();
  renderProducts();
}

/* ---------------- Products ---------------- */
function renderProducts() {
  const list = PRODUCTS.filter(
    (p) =>
      (activeCategory === "All" || p.category === activeCategory) &&
      p.name.toLowerCase().includes(searchText)
  );
  $("emptyMsg").hidden = list.length > 0;
  $("productGrid").innerHTML = list
    .map(
      (p) => `
    <article class="product fade visible">
      <div class="p-img">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.classList.add('noimg')">
      </div>
      <div class="p-body">
        <div class="p-cat">${p.category}</div>
        <h3 class="p-name">${p.name}</h3>
        <div class="p-price">
          <strong>${money(p.price)}</strong>
          ${p.oldPrice ? `<del>${money(p.oldPrice)}</del>` : ""}
        </div>
        <select class="p-size" id="size-${p.id}" aria-label="Size chunein">
          ${SIZES.map((s) => `<option value="${s}">Size: ${s}</option>`).join("")}
        </select>
        <button class="add-btn" data-add="${p.id}">Add to Cart</button>
      </div>
    </article>`
    )
    .join("");
  document.querySelectorAll("[data-add]").forEach((b) =>
    b.addEventListener("click", () => addToCart(Number(b.dataset.add)))
  );
}

/* ---------------- Cart ---------------- */
function addToCart(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  const size = $("size-" + id).value;
  const found = cart.find((i) => i.id === id && i.size === size);
  if (found) found.qty++;
  else cart.push({ id, size, qty: 1 });
  saveCart();
  renderCart();
  toast(p.name + " cart me add hua");
}
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
  renderCart();
}
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}
function cartTotal() {
  return cart.reduce((sum, i) => sum + PRODUCTS.find((p) => p.id === i.id).price * i.qty, 0);
}
function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  $("cartCount").textContent = count;
  $("cartTotal").textContent = money(cartTotal());
  if (!cart.length) {
    $("cartItems").innerHTML = `<p class="cart-empty">Aapka cart khaali hai 🛒</p>`;
    return;
  }
  $("cartItems").innerHTML = cart
    .map((i, idx) => {
      const p = PRODUCTS.find((x) => x.id === i.id);
      return `
      <div class="c-item">
        <img class="c-thumb" src="${p.image}" alt="" onerror="this.style.visibility='hidden'">
        <div class="c-info">
          <h4>${p.name}</h4>
          <small>Size: ${i.size} • ${money(p.price)}</small>
          <div class="qty">
            <button data-q="${idx}" data-d="-1" aria-label="Kam karo">−</button>
            <span>${i.qty}</span>
            <button data-q="${idx}" data-d="1" aria-label="Badhao">+</button>
          </div>
          <button class="c-remove" data-r="${idx}">Hatayein</button>
        </div>
        <div class="c-price">${money(p.price * i.qty)}</div>
      </div>`;
    })
    .join("");
  document.querySelectorAll("[data-q]").forEach((b) =>
    b.addEventListener("click", () => changeQty(Number(b.dataset.q), Number(b.dataset.d)))
  );
  document.querySelectorAll("[data-r]").forEach((b) =>
    b.addEventListener("click", () => removeItem(Number(b.dataset.r)))
  );
}
const openCart = () => { $("cart").classList.add("open"); $("overlay").classList.add("show"); };
const closeCart = () => { $("cart").classList.remove("open"); $("overlay").classList.remove("show"); };

/* ---------------- WhatsApp order ---------------- */
function checkout() {
  if (!cart.length) { toast("Pehle cart me kuch add karein"); return; }
  let msg = `*${CONFIG.brandName} - Naya Order*\n\n`;
  cart.forEach((i, n) => {
    const p = PRODUCTS.find((x) => x.id === i.id);
    msg += `${n + 1}. ${p.name} (Size: ${i.size}) x ${i.qty} = ${money(p.price * i.qty)}\n`;
  });
  msg += `\n*Total: ${money(cartTotal())}*\n\nMera naam:\nPura address:\nPhone:`;
  window.open("https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(msg), "_blank");
}

/* ---------------- Contact form -> WhatsApp ---------------- */
function sendContact(e) {
  e.preventDefault();
  const text = `Naam: ${$("cName").value}\nPhone: ${$("cPhone").value}\nMessage: ${$("cMsg").value}`;
  window.open("https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(text), "_blank");
  e.target.reset();
}

/* ---------------- Toast ---------------- */
let toastTimer;
function toast(text) {
  let t = document.querySelector(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------------- Scroll effects ---------------- */
function initScroll() {
  const nav = $("navbar");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll);
  onScroll();

  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".fade").forEach((el) => io.observe(el));
}

/* ---------------- Init ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  renderCategories();
  renderFilters();
  renderProducts();
  renderCart();
  initScroll();

  $("searchInput").addEventListener("input", (e) => { searchText = e.target.value.trim().toLowerCase(); renderProducts(); });
  $("openCart").addEventListener("click", openCart);
  $("closeCart").addEventListener("click", closeCart);
  $("overlay").addEventListener("click", closeCart);
  $("checkoutBtn").addEventListener("click", checkout);
  $("clearCart").addEventListener("click", () => { cart = []; saveCart(); renderCart(); });
  $("contactForm").addEventListener("submit", sendContact);
  $("menuBtn").addEventListener("click", () => $("navLinks").classList.toggle("open"));
  document.querySelectorAll("#navLinks a").forEach((a) => a.addEventListener("click", () => $("navLinks").classList.remove("open")));
});
