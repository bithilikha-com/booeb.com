// === booeb.com v32 - Complete JS ===
const STORE = {
  products: [
    {id:1,title:"Samsung Galaxy S24",price:89900,old:99900,img:"https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",category:"Electronics",sellerId:1,rating:4.5},
    {id:2,title:"Men's Casual Shirt",price:1290,old:1890,img:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",category:"Fashion",sellerId:2,rating:4.2},
    {id:3,title:"Wireless Headphones",price:3490,img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",category:"Electronics",sellerId:1,rating:4.7},
    {id:4,title:"Running Shoes",price:2590,old:3290,img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",category:"Fashion",sellerId:2,rating:4.3},
    {id:5,title:"Smart Watch",price:5990,img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",category:"Electronics",sellerId:1,rating:4.6},
    {id:6,title:"Backpack",price:1890,img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",category:"Fashion",sellerId:2,rating:4.1}
  ],
  cart: JSON.parse(localStorage.getItem('booeb_cart'))||[],
  wishlist: JSON.parse(localStorage.getItem('booeb_wish'))||[],
  user: JSON.parse(localStorage.getItem('booeb_user'))||null,
  orders: JSON.parse(localStorage.getItem('booeb_orders'))||[],
  sellers: [{id:1,name:"Tech Store",rating:4.8},{id:2,name:"Fashion Hub",rating:4.5}],
  coupons: {BOOEB10:10,WELCOME50:50},
  prime: localStorage.getItem('booeb_prime')==='true',
  addresses: JSON.parse(localStorage.getItem('booeb_addr'))||[],
  reviews: JSON.parse(localStorage.getItem('booeb_reviews'))||{},
  branding: JSON.parse(localStorage.getItem('booeb_branding'))||{},
  chatbotTraining: JSON.parse(localStorage.getItem('booeb_chatbot_training'))||[],
  socialMedia: JSON.parse(localStorage.getItem('booeb_social_media'))||[],
  paymentMethods: JSON.parse(localStorage.getItem('booeb_payment_methods'))||[]
};
// Safe element bindings: try existing globals, otherwise resolve by ID
const __els = ['productGrid','searchInput','cartCount','wishlistCount','pBody','productModal','revList','revText','cartModal','cartBody','checkoutModal','checkoutBody','couponIn','couponMsg','loginModal','loginEmail','loginBtn','chatBox','chatIn','chatBody','coPay','coName','coPhone','coAddr','coCity','orderSum','orderSum','orderSum'];
__els.forEach(n=>{ if(typeof window[n]==='undefined') window[n]=document.getElementById(n)||null; });

function save(){ localStorage.setItem('booeb_cart',JSON.stringify(STORE.cart)); localStorage.setItem('booeb_wish',JSON.stringify(STORE.wishlist)); localStorage.setItem('booeb_orders',JSON.stringify(STORE.orders)); localStorage.setItem('booeb_user',JSON.stringify(STORE.user)); updateCounts(); }
function updateCounts(){ if(window.cartCount) cartCount.textContent=STORE.cart.reduce((s,i)=>s+i.qty,0); if(window.wishlistCount) wishlistCount.textContent=STORE.wishlist.length; }

// Render Products
function renderProducts(list=STORE.products){
  const logo = STORE.branding.logo ? `<img src="${STORE.branding.logo}" style="width:120px;height:120px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.2)">` : `<div style="width:120px;height:120px;background:linear-gradient(135deg,var(--royal),var(--teal));border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:60px;color:white">🏪</div>`;
  
  const logoSection = `<div style="text-align:center;margin:32px 0;padding:32px;background:linear-gradient(135deg,var(--royal),var(--teal));border-radius:20px;display:flex;flex-direction:column;align-items:center;gap:16px">
    <h2 style="color:white;margin:0">Welcome to booeb.com</h2>
    ${logo}
    <p style="color:white;font-size:14px;max-width:400px;margin:0">Premium Shopping Destination • Fast Delivery • Secure Checkout</p>
  </div>`;

  const firstHalf = list.slice(0, Math.ceil(list.length/2));
  const secondHalf = list.slice(Math.ceil(list.length/2));
  
  let html = firstHalf.map(p=>`<div class="card" onclick="viewProduct(${p.id})">
    <img src="${p.img}" alt="${p.title}">
    <div class="card-body">
      <div class="card-title">${p.title}</div>
      <div class="price">৳${p.price.toLocaleString()}${p.old?`<small>৳${p.old.toLocaleString()}</small>`:''}</div>
      ${STORE.prime?'<span class="prime-badge">PRIME</span>':''}
    </div>
  </div>`).join('');
  
  html += logoSection;
  
  html += secondHalf.map(p=>`<div class="card" onclick="viewProduct(${p.id})">
    <img src="${p.img}" alt="${p.title}">
    <div class="card-body">
      <div class="card-title">${p.title}</div>
      <div class="price">৳${p.price.toLocaleString()}${p.old?`<small>৳${p.old.toLocaleString()}</small>`:''}</div>
      ${STORE.prime?'<span class="prime-badge">PRIME</span>':''}
    </div>
  </div>`).join('');
  
  productGrid.innerHTML = html;
}
// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCounts();
  renderSocialMediaLinks();
  
  // Load favicon if available
  if (STORE.branding.favicon) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = STORE.branding.favicon;
  }
});

// Search
if(document.getElementById('searchInput')) {
  document.getElementById('searchInput').oninput = e => { 
    const q=e.target.value.toLowerCase(); 
    renderProducts(STORE.products.filter(p=>p.title.toLowerCase().includes(q))); 
  };
}

// Voice Search
function voiceSearch(){ const r=new (window.SpeechRecognition||window.webkitSpeechRecognition)(); r.lang='bn-BD'; r.onresult=e=>{ searchInput.value=e.results[0][0].transcript; searchInput.dispatchEvent(new Event('input')); }; r.start(); }

// View Product
function viewProduct(id){
  const p=STORE.products.find(x=>x.id===id);
  pBody.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
    <img src="${p.img}" style="width:100%;border-radius:12px">
    <div>
      <h2>${p.title}</h2>
      <p style="color:var(--gray)">Category: ${p.category} | Rating: ${p.rating}★</p>
      <div class="price" style="font-size:26px;margin:12px 0">৳${p.price.toLocaleString()}</div>
      <button class="btn amber" onclick="addToCart(${p.id});closeModal('productModal')">Add to Cart</button>
      <button class="btn" onclick="buyNow(${p.id})" style="margin-left:8px">Buy Now</button>
      <button class="btn teal" onclick="toggleWish(${p.id})">♡ Wishlist</button>
    </div>
  </div>`;
  productModal.style.display='flex';

  // STEP 18 Reviews
  setTimeout(()=>{
    const revDiv=document.createElement('div'); revDiv.innerHTML=`<h4 style="margin-top:20px">Reviews</h4><div id="revList"></div><textarea id="revText" placeholder="Write review"></textarea><button class="btn" onclick="addRev(${id})">Post</button>`;
    pBody.appendChild(revDiv); loadRev(id);
  },100);

  // STEP 23 AR
  if(['Fashion','Electronics'].includes(p.category)){
    setTimeout(()=>{ const b=document.createElement('button'); b.className='btn'; b.textContent='👓 AR Try-On'; b.style.marginTop='8px'; b.onclick=()=>openAR(p.img); pBody.children[0].children[1].appendChild(b); },150);
  }
}
function loadRev(id){ revList.innerHTML=(STORE.reviews[id]||[]).map(r=>`<div style="padding:6px 0;border-bottom:1px solid #eee"><b>${r.user}</b>: ${r.txt}</div>`).join(''); }
function addRev(id){ const txt=revText.value; if(!txt)return; (STORE.reviews[id]=STORE.reviews[id]||[]).push({txt,user:STORE.user?.name||'Guest'}); localStorage.setItem('booeb_reviews',JSON.stringify(STORE.reviews)); loadRev(id); revText.value=''; }

// Cart
function addToCart(id){ const f=STORE.cart.find(i=>i.id===id); f?f.qty++:STORE.cart.push({id,qty:1}); save(); notify('Added to cart'); }
function buyNow(id){ addToCart(id); openCart(); }
function toggleWish(id){ const i=STORE.wishlist.indexOf(id); i>-1?STORE.wishlist.splice(i,1):STORE.wishlist.push(id); save(); }
function openCart(){ cartModal.style.display='flex'; renderCart(); }
function renderCart(){
  if(!STORE.cart.length){ cartBody.innerHTML='<p>Cart empty</p>'; return; }
  cartBody.innerHTML = STORE.cart.map(it=>{ const p=STORE.products.find(x=>x.id===it.id); return `<div class="cart-item"><img src="${p.img}"><div style="flex:1"><b>${p.title}</b><div class="qty"><button onclick="chgQty(${it.id},-1)">-</button><span>${it.qty}</span><button onclick="chgQty(${it.id},1)">+</button></div></div><div>৳${(p.price*it.qty).toLocaleString()}</div></div>`; }).join('');
  const total=STORE.cart.reduce((s,it)=>s+STORE.products.find(p=>p.id===it.id).price*it.qty,0);
  cartBody.innerHTML+=`<div style="text-align:right;margin-top:12px"><h3>Total: ৳${total.toLocaleString()}</h3><button class="btn amber" onclick="checkout()">Checkout</button></div>`;
}
function chgQty(id,d){ const it=STORE.cart.find(i=>i.id===id); it.qty+=d; if(it.qty<1)STORE.cart=STORE.cart.filter(i=>i.id!==id); save(); renderCart(); }

// Checkout
function checkout(){
  if(!STORE.user) return alert('Please login first');
  closeModal('cartModal'); checkoutModal.style.display='flex';
  const total=STORE.cart.reduce((s,it)=>s+STORE.products.find(p=>p.id===it.id).price*it.qty,0);
  window._orderTotal = total + 60;
  
  // Build payment methods HTML
  const paymentMethods = STORE.paymentMethods.length > 0 
    ? STORE.paymentMethods.filter(m => m.active).map(m => `<option value="${m.name}">${m.provider} (${m.name})</option>`).join('')
    : '<option value="cod">Cash on Delivery</option><option value="bkash">bKash</option><option value="card">Card</option><option value="crypto">Crypto (USDT)</option>';
  
  checkoutBody.innerHTML = `<div class="form-grid">
    <input id="coName" placeholder="Full Name" value="${STORE.user.name||''}">
    <input id="coPhone" placeholder="Phone">
    <input id="coAddr" placeholder="Address" class="full">
    <input id="coCity" placeholder="City">
    <select id="coPay">${paymentMethods}</select>
    <div class="full" id="orderSum"><h4>Order Summary</h4>${STORE.cart.map(it=>{const p=STORE.products.find(x=>x.id===it.id);return `<p>${p.title} x${it.qty} - ৳${(p.price*it.qty).toLocaleString()}</p>`}).join('')}<p>Delivery: ৳60</p><h3>Total: ৳${window._orderTotal.toLocaleString()}</h3><p id="couponMsg" style="color:green"></p></div>
    <input id="couponIn" placeholder="Coupon code"><button class="btn" onclick="applyCoupon()">Apply</button>
    <button class="btn amber full" onclick="placeOrder()">Place Order</button>
  </div>`;
  if(STORE.prime){ window._orderTotal-=60; document.querySelector('#orderSum h3').textContent='Total: ৳'+window._orderTotal.toLocaleString()+' (Prime Free)'; }
}
function applyCoupon(){ const c=couponIn.value.toUpperCase(); if(STORE.coupons[c]){ window._orderTotal-=STORE.coupons[c]; couponMsg.textContent='Coupon applied! -৳'+STORE.coupons[c]; document.querySelector('#orderSum h3').textContent='Total: ৳'+window._orderTotal.toLocaleString(); } }
function placeOrder(){
  const pay=coPay.value;
  if(pay==='crypto'){
    const usd=(window._orderTotal/110).toFixed(2); const addr='0xBooeb'+Math.random().toString(16).slice(2,10).toUpperCase();
    orderSum.innerHTML+=`<div class="crypto-box"><h4>Pay $${usd} USDT</h4><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${addr}"><p style="font-family:monospace">${addr}</p><button class="btn full" onclick="confirmOrder()">I Paid</button></div>`; return;
  }
  if(pay==='bkash'||pay==='card'){ alert('Redirecting to payment...'); setTimeout(confirmOrder,1000); return; }
  confirmOrder();
}
function confirmOrder(){
  const order={id:Date.now(),user:STORE.user.email,name:coName.value,items:[...STORE.cart],total:window._orderTotal,date:new Date().toLocaleString(),status:'Processing'};
  STORE.orders.push(order); STORE.cart=[]; save(); closeModal('checkoutModal'); alert('Order #'+order.id+' confirmed!'); notify('Order placed');
}

// Login with OTP
function openLogin(){ loginModal.style.display='flex'; }
function doLogin(){ const email=loginEmail.value; const otp=prompt('OTP sent: 1234 (demo)'); if(otp==='1234'){ STORE.user={email,name:email.split('@')[0]}; save(); closeModal('loginModal'); updateUI(); } }
function updateUI(){ if(STORE.user){ loginBtn.textContent=STORE.user.name; } }
updateUI();

// My Orders
function showMyOrders(){ if(!STORE.user)return openLogin(); const o=STORE.orders.filter(x=>x.user===STORE.user.email); alert(o.length?o.map(x=>`#${x.id} - ৳${x.total} - ${x.status}`).join('\n'):'No orders'); }

// Dark Mode
function toggleDark(){ document.body.classList.toggle('dark'); localStorage.setItem('booeb_dark',document.body.classList.contains('dark')); }
if(localStorage.getItem('booeb_dark')==='true')document.body.classList.add('dark');

// Prime
function togglePrime(){ STORE.prime=!STORE.prime; localStorage.setItem('booeb_prime',STORE.prime); location.reload(); }
if(STORE.prime){ const b=document.createElement('button'); b.className='btn amber'; b.textContent='PRIME ✓'; b.onclick=togglePrime; document.querySelector('.actions').appendChild(b); }

// Chat Bot with AI Training
function toggleChat(){ chatBox.style.display=chatBox.style.display==='block'?'none':'block'; }
function sendChat(){ 
  const txt=chatIn.value; 
  if(!txt)return; 
  chatBody.innerHTML+=`<div><b>You:</b> ${txt}</div>`; 
  chatIn.value=''; 
  
  // Check trained responses first
  let ans = null;
  const q = txt.toLowerCase();
  
  // Search in chatbot training data
  for (const training of STORE.chatbotTraining) {
    const keywords = training.phrase.toLowerCase().split(' ');
    if (keywords.some(k => q.includes(k))) {
      ans = training.response;
      break;
    }
  }
  
  // Fallback to default responses
  if (!ans) {
    if(q.includes('order'))ans=`আপনার ${STORE.orders.length} টি অর্ডার আছে`;
    else if(q.includes('delivery')||q.includes('ship'))ans=STORE.prime?'Prime সদস্য হিসেবে আপনার ফ্রি ডেলিভারি':'ডেলিভারি চার্জ ৳60';
    else if(q.includes('return')||q.includes('return'))ans='পণ্য ৭ দিনের মধ্যে রিটার্ন করতে পারবেন';
    else if(q.includes('payment')||q.includes('pay'))ans='আমরা COD, bKash, কার্ড এবং ক্রিপ্টো সাপোর্ট করি';
    else if(q.includes('track'))ans='আপনার অর্ডার ট্র্যাক করুন "My Orders" এ';
    else ans='আমি সাহায্য করতে পারি। কিভাবে সাহায্য করব?';
  }
  
  setTimeout(()=>{chatBody.innerHTML+=`<div><b>Bot:</b> ${ans}</div>`;chatBody.scrollTop=9999},500); 
}

// AR
async function openAR(img){ const m=document.createElement('div'); m.className='modal'; m.style.display='flex'; m.innerHTML=`<div class="modal-content"><div class="modal-head"><h3>AR Try-On</h3><span class="close" onclick="this.closest('.modal').remove()">&times;</span></div><div class="modal-body"><div class="ar-wrap"><video class="ar-video" autoplay playsinline id="arVid"></video><img class="ar-overlay" src="${img}"></div></div></div>`; document.body.appendChild(m); try{ document.getElementById('arVid').srcObject=await navigator.mediaDevices.getUserMedia({video:true}); }catch(e){alert('Camera allow করুন')} }

// Social Media Links
function renderSocialMediaLinks() {
  const container = document.getElementById('socialLinks');
  if (!container || !STORE.socialMedia || STORE.socialMedia.length === 0) return;
  
  const platformEmojis = {
    facebook: '👍',
    instagram: '📷',
    twitter: '🐦',
    tiktok: '🎵',
    youtube: '📺',
    linkedin: '💼',
    whatsapp: '💬',
    telegram: '✈️'
  };
  
  container.innerHTML = STORE.socialMedia.map(s => `
    <a href="${s.url}" target="_blank" style="text-decoration:none;display:flex;align-items:center;gap:6px;background:var(--teal);color:#fff;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;transition:.2s" title="${s.name || s.platform}">
      ${s.logo ? `<img src="${s.logo}" style="width:16px;height:16px;border-radius:2px">` : (platformEmojis[s.platform] || '🔗')}
      ${s.name || s.platform.charAt(0).toUpperCase() + s.platform.slice(1)}
    </a>
  `).join('');
}

// Notify
function notify(msg){ if(Notification.permission==='granted')new Notification('booeb.com',{body:msg}); }
if('Notification' in window)Notification.requestPermission();

// Helpers
function closeModal(id){ document.getElementById(id).style.display='none'; }
updateCounts();
