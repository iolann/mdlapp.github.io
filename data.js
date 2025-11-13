let products = [
    { id: 1, name: "Chocolat Chaud", price: 0.40, stock: 50, minStock: 10, category: "Boisson", image: "image/benco.jpg" },
    { id: 2, name: "Café", price: 1.00, stock: 50, minStock: 10, category: "Boisson", image: "image/café.jpg" },
    { id: 3, name: "Café au lait", price: 1.00, stock: 30, minStock: 15, category: "Boisson", image: "image/caféaulait.jpg" },
    { id: 4, name: "Coca-Cola", price: 1.00, stock: 45, minStock: 20, category: "Boisson", image: "image/cocacola.jpg" },
    { id: 5, name: "Coca-Cola Cherry", price: 1.00, stock: 25, minStock: 10, category: "Boisson", image: "image/cocacolacherry.jpg" },
    { id: 6, name: "Oasis Pomme-Cassis", price: 1.00, stock: 35, minStock: 15, category: "Boisson", image: "image/oasispommecasis.jpg" },
    { id: 7, name: "Fanta", price: 1.00, stock: 30, minStock: 15, category: "Boisson", image: "image/orange.jpg" },
    { id: 8, name: "Lipton", price: 1.00, stock: 45, minStock: 20, category: "Boisson", image: "image/lipton.jpg" },
    { id: 9, name: "Sirop", price: 0.50, stock: 25, minStock: 10, category: "Boisson", image: "image/sirop.jpg" },
    { id: 10, name: "Bouteille Sirop", price: 0.30, stock: 35, minStock: 15, category: "Boisson", image: "image/siropbouteille.jpg" },
    { id: 11, name: "Diabolo", price: 1.50, stock: 30, minStock: 15, category: "Boisson", image: "image/diabolo.jpg" },
    { id: 12, name: "Thé", price: 2.00, stock: 45, minStock: 20, category: "Boisson", image: "image/thé.jpg" },
    { id: 13, name: "Jus de fruit", price: 2.00, stock: 45, minStock: 20, category: "Boisson", image: "image/jusfruit.jpg" },
    { id: 14, name: "Jus de Pomme", price: 2.00, stock: 45, minStock: 20, category: "Boisson", image: "image/jusdepomme.jpg" },
    { id: 15, name: "Chips BBQ", price: 3.50, stock: 50, minStock: 10, category: "Salé", image: "image/chipsbbq.jpg" },
    { id: 16, name: "Chips Nature", price: 1.50, stock: 30, minStock: 15, category: "Salé", image: "image/chipsnature.jpg" },
    { id: 17, name: "Chips Poulet", price: 2.00, stock: 45, minStock: 20, category: "Salé", image: "image/chipspouletroti.jpg" },
    { id: 18, name: "Saucisson", price: 2.50, stock: 25, minStock: 10, category: "Salé", image: "image/saucisson.jpg" },
    { id: 19, name: "Pain au Chocolat", price: 1.50, stock: 35, minStock: 15, category: "Sucré", image: "image/painchocolat.jpg" },
    { id: 20, name: "Croissant", price: 1.50, stock: 30, minStock: 15, category: "Sucré", image: "image/croissant.jpg" },
    { id: 21, name: "Lion", price: 2.00, stock: 45, minStock: 20, category: "Sucré", image: "image/lion.jpg" },
    { id: 22, name: "KitKat", price: 2.50, stock: 25, minStock: 10, category: "Sucré", image: "image/kitkat.jpg" },
    { id: 23, name: "Twix", price: 1.50, stock: 35, minStock: 15, category: "Sucré", image: "image/twix.jpg" },
    { id: 24, name: "Oréo", price: 1.50, stock: 30, minStock: 15, category: "Sucré", image: "image/oréo.jpg" },
    { id: 25, name: "Petit écolier", price: 2.00, stock: 45, minStock: 20, category: "Sucré", image: "image/petitécolier.jpg" },
    { id: 26, name: "M&M's", price: 2.00, stock: 45, minStock: 20, category: "Sucré", image: "image/M&Ms.jpg" },
    { id: 27, name: "Bonbon", price: 2.50, stock: 25, minStock: 10, category: "Sucré", image: "image/bonbons.jpg" },
    { id: 28, name: "Crêpe", price: 1.50, stock: 35, minStock: 15, category: "Sucré", image: "image/crepe.jpg" },
    { id: 29, name: "Kinder Bueno", price: 1.50, stock: 30, minStock: 15, category: "Sucré", image: "image/kinderbueno.jpg" },
    { id: 30, name: "Compote", price: 2.00, stock: 45, minStock: 20, category: "Sucré", image: "image/compote.jpg" }
];

let cart = [];
let sales = [];
let editingId = null;

// Persistent storage
async function loadData() {
    try {
        const productsData = await window.storage.get('mdl_products');
        const salesData = await window.storage.get('mdl_sales');
        if (productsData) products = JSON.parse(productsData.value);
        if (salesData) sales = JSON.parse(salesData.value);
    } catch (error) {
        console.error('Erreur de chargement:', error);
    }
    renderProducts();
    renderCart();
}

async function save() {
    try {
        await window.storage.set('mdl_products', JSON.stringify(products));
        await window.storage.set('mdl_sales', JSON.stringify(sales));
    } catch (error) {
        console.error('Erreur de sauvegarde:', error);
    }
}

function switchTab(event, tab) {
    document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    event.target.classList.add('active');
    if (tab === 'stock') renderStock();
    if (tab === 'stats') renderStats();
    if (tab === 'courses') renderCourses();
}

function renderProducts() {
    const search = document.getElementById('searchProduct').value.toLowerCase();
    const filtered = products.filter(p => p.name && p.name.toLowerCase().includes(search));
    const container = document.getElementById('productsList');
    container.innerHTML = filtered.length
        ? filtered.map(p => {
            const imageContent = p.image && p.image.trim() !== '' && p.image !== 'image/'
                ? `<img src="${p.image}" alt="${p.name}" onerror="this.parentElement.innerHTML='📦'">`
                : '📦';
            const isOutOfStock = p.stock === 0;
            const isLowStock = p.stock > 0 && p.stock <= p.minStock;
            const cardClass = isOutOfStock ? 'product-card out-of-stock' : isLowStock ? 'product-card low-stock' : 'product-card';
            return `
                <div class="${cardClass}" onclick="${isOutOfStock ? '' : `addToCart(${p.id})`}">
                    <div class="product-image">${imageContent}</div>
                    <div class="product-name">${p.name}</div>
                    <div class="product-price">${p.price.toFixed(2)} €</div>
                    <div class="product-stock" style="color: ${isOutOfStock ? '#dc2626' : isLowStock ? '#f59e0b' : '#10b981'}; font-weight: ${isOutOfStock || isLowStock ? '700' : '400'}">
                        ${isOutOfStock ? '❌ Rupture' : isLowStock ? '⚠️ Stock faible: ' + p.stock : '✓ Stock: ' + p.stock}
                    </div>
                </div>
            `;
        }).join('')
        : '<div class="empty-state"><div class="empty-emoji">🔍</div><div>Aucun produit trouvé</div></div>';
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product || product.stock === 0) {
        showNotification('⚠️ Produit en rupture de stock', 'error');
        return;
    }
    const item = cart.find(i => i.id === id);
    if (item) {
        if (item.quantity >= product.stock) {
            showNotification('⚠️ Stock insuffisant', 'error');
            return;
        }
        item.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    renderCart();
}

function renderCart() {
    const div = document.getElementById('cartItems');
    const validateBtn = document.querySelector('.validate-btn');
    if (cart.length === 0) {
        div.innerHTML = '<div class="empty-state"><div class="empty-emoji">🛒</div><div>Panier vide</div></div>';
        document.getElementById('cartTotal').textContent = '0.00 €';
        if (validateBtn) validateBtn.disabled = true;
        return;
    }
    if (validateBtn) validateBtn.disabled = false;
    div.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price.toFixed(2)} € × ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} €</div>
            </div>
            <div class="cart-controls">
                <button class="cart-btn" onclick="updateCart(${item.id}, -1)">−</button>
                <span class="cart-quantity">${item.quantity}</span>
                <button class="cart-btn" onclick="updateCart(${item.id}, 1)">+</button>
                <button class="cart-btn delete" onclick="removeCart(${item.id})">×</button>
            </div>
        </div>
    `).join('');
    const total = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    document.getElementById('cartTotal').textContent = total.toFixed(2) + ' €';
}

function updateCart(id, delta) {
    const item = cart.find(i => i.id === id);
    const product = products.find(p => p.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity > product.stock) item.quantity = product.stock;
        if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
        renderCart();
    }
}

function removeCart(id) {
    cart = cart.filter(i => i.id !== id);
    renderCart();
}

function validateSale() {
    if (cart.length === 0) {
        showNotification('⚠️ Le panier est vide !', 'error');
        return;
    }
    for (const item of cart) {
        const product = products.find(p => p.id === item.id);
        if (!product || product.stock < item.quantity) {
            showNotification(`⚠️ Stock insuffisant pour ${item.name}`, 'error');
            return;
        }
    }
    const total = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    sales.unshift({
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        total
    });
    products = products.map(p => {
        const item = cart.find(i => i.id === p.id);
        return item ? { ...p, stock: p.stock - item.quantity } : p;
    });
    cart = [];
    save();
    renderCart();
    renderProducts();
    showNotification('✅ Vente validée avec succès !', 'success');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function renderStock() {
    const container = document.getElementById('stockTable');
    container.innerHTML = products.map(p => {
        const imageContent = p.image && p.image.trim() !== '' && p.image !== 'image/'
            ? `<img src="${p.image}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='📦'">`
            : '📦';
        return `
            <tr>
                <td>
                    ${editingId === p.id
                        ? `<input type="file" accept="image/*" onchange="uploadImage(${p.id}, event)" style="font-size: 0.75rem;">`
                        : `<div style="width: 50px; height: 50px; border-radius: 8px; overflow: hidden; background: #f1f5f9; display: flex; align-items: center; justify-content: center;">${imageContent}</div>`
                    }
                </td>
                <td>${editingId === p.id
                    ? `<input value="${p.name}" onchange="updateProd(${p.id}, 'name', this.value)" style="width:100%">`
                    : `<strong>${p.name || '-'}</strong>`
                }</td>
                <td>${editingId === p.id
                    ? `<input value="${p.category}" onchange="updateProd(${p.id}, 'category', this.value)" style="width:100%">`
                    : `${p.category || '-'}`
                }</td>
                <td>${editingId === p.id
                    ? `<input type="number" step="0.01" value="${p.price}" onchange="updateProd(${p.id}, 'price', parseFloat(this.value))" style="width:80px">`
                    : `<strong style="color: #3b82f6">${p.price.toFixed(2)} €</strong>`
                }</td>
                <td>${editingId === p.id
                    ? `<input type="number" value="${p.stock}" onchange="updateProd(${p.id}, 'stock', parseInt(this.value))" style="width:60px">`
                    : `<strong style="color: ${p.stock <= p.minStock ? '#dc2626' : '#10b981'}">${p.stock}</strong>`
                }</td>
                <td>${editingId === p.id
                    ? `<input type="number" value="${p.minStock}" onchange="updateProd(${p.id}, 'minStock', parseInt(this.value))" style="width:60px">`
                    : p.minStock
                }</td>
                <td>
                    ${editingId === p.id
                        ? `<button class="btn-icon btn-save" onclick="editingId=null; save(); renderStock()">✓</button>`
                        : `<button class="btn-icon btn-edit" onclick="editingId=${p.id}; renderStock()">✏️</button><button class="btn-icon btn-delete" onclick="deleteProd(${p.id})">🗑️</button>`
                    }
                </td>
            </tr>
        `;
    }).join('');
}

function uploadImage(id, event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            updateProd(id, 'image', e.target.result);
            renderStock();
        };
        reader.readAsDataURL(file);
    }
}

function updateProd(id, field, value) {
    products = products.map(p => p.id === id ? { ...p, [field]: value } : p);
    save();
}

function addProduct() {
    const newP = {
        id: Date.now(),
        name: 'Nouveau Produit',
        price: 0,
        stock: 0,
        category: 'Boisson',
        minStock: 5,
        image: ''
    };
    products.push(newP);
    editingId = newP.id;
    save();
    renderStock();
}

function deleteProd(id) {
    if (confirm('Supprimer ce produit ?')) {
        products = products.filter(p => p.id !== id);
        save();
        renderStock();
        showNotification('🗑️ Produit supprimé', 'success');
    }
}

function renderStats() {
    const period = document.getElementById('statsPeriod')?.value || 'all';
    const now = new Date();
    const filtered = sales.filter(s => {
        const saleDate = new Date(s.date);
        if (period === 'today') return saleDate.toDateString() === now.toDateString();
        if (period === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return saleDate >= weekAgo;
        }
        if (period === 'month') return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
        if (period === 'year') return saleDate.getFullYear() === now.getFullYear();
        return true;
    });
    const total = filtered.reduce((sum, s) => sum + s.total, 0);
    const count = filtered.length;
    const avg = count > 0 ? total / count : 0;
    const totalItems = filtered.reduce((sum, s) => sum + s.items.reduce((iSum, i) => iSum + i.quantity, 0), 0);
    document.getElementById('statRevenue').textContent = total.toFixed(2) + ' €';
    document.getElementById('statSales').textContent = count;
    document.getElementById('statAvg').textContent = avg.toFixed(2) + ' €';
    document.getElementById('statTotalItems').textContent = totalItems;
    // ... (le reste de la fonction renderStats reste inchangé)
}

function renderRevenueChart(salesData) {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const chartDays = parseInt(document.getElementById('chartPeriod')?.value || '14');
    const dailyData = {};
    salesData.forEach(s => {
        const day = new Date(s.date).toLocaleDateString('fr-FR');
        dailyData[day] = (dailyData[day] || 0) + s.total;
    });
    const sortedDays = Object.keys(dailyData).sort((a, b) => {
        const dateA = a.split('/').reverse().join('-');
        const dateB = b.split('/').reverse().join('-');
        return dateA.localeCompare(dateB);
    }).slice(-chartDays);
    const data = sortedDays.map(day => dailyData[day] || 0);
    const maxValue = Math.max(...data, 1);
    canvas.height = 300;
    canvas.width = canvas.offsetWidth;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const padding = 50;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const barWidth = Math.max(chartWidth / sortedDays.length - 4, 20);
    const spacing = chartWidth / sortedDays.length;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
        const value = maxValue * (1 - i / 5);
        ctx.fillStyle = '#64748b';
        ctx.font = '11px Outfit';
        ctx.textAlign = 'right';
        ctx.fillText(value.toFixed(0) + '€', padding - 5, y + 4);
    }
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + index * spacing + (spacing - barWidth) / 2;
        const y = canvas.height - padding - barHeight;
        const gradient = ctx.createLinearGradient(0, y, 0, canvas.height - padding);
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#1e40af');
        ctx.shadowColor = 'rgba(59, 130, 246, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        ctx.shadowColor = 'transparent';
        if (value > 0) {
            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 11px Outfit';
            ctx.textAlign = 'center';
            ctx.fillText(value.toFixed(0) + '€', x + barWidth / 2, y - 8);
        }
    });
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Outfit';
    sortedDays.forEach((day, index) => {
        const x = padding + index * spacing + spacing / 2;
        ctx.save();
        ctx.translate(x, canvas.height - 25);
        ctx.rotate(-Math.PI / 4);
        ctx.textAlign = 'right';
        ctx.fillText(day.substring(0, 5), 0, 0);
        ctx.restore();
    });
}

// ... (le reste des fonctions renderHourlyChart, renderWeekdayChart, renderCourses, etc.)
