let products = [
    { id: 1, name: "Chocolat Chaud", price: 0.40, stock: 50, minStock: 5, category: "Boisson", image: "image/benco.jpg" },
    { id: 2, name: "Café", price: 1.00, stock: 50, minStock: 10, category: "Boisson", image: "image/café.jpg" },
    { id: 3, name: "Café au lait", price: 1.00, stock: 30, minStock: 5, category: "Boisson", image: "image/caféaulait.jpg" },
    { id: 4, name: "Coca-Cola", price: 1.00, stock: 40, minStock: 5, category: "Boisson", image: "image/cocacola.jpg" },
    { id: 5, name: "Oasis Pomme-Cassis", price: 1.00, stock: 40, minStock: 5, category: "Boisson", image: "image/oasispommecasis.jpg" },
    { id: 6, name: "Lipton", price: 1.00, stock: 24, minStock: 5, category: "Boisson", image: "image/lipton.jpg" },
    { id: 7, name: "Sirop", price: 0.50, stock: 25, minStock: 5, category: "Boisson", image: "image/sirop.jpg" },
    { id: 8, name: "Bouteille Sirop", price: 0.30, stock: 40, minStock: 5, category: "Boisson", image: "image/siropbouteille.jpg" },
    { id: 9, name: "Diabolo", price: 1.50, stock: 40, minStock: 5, category: "Boisson", image: "image/diabolo.jpg" },
    { id: 10, name: "Thé", price: 2.00, stock: 40, minStock: 5, category: "Boisson", image: "image/thé.jpg" },
    { id: 11, name: "Chips BBQ", price: 3.50, stock: 40, minStock: 5, category: "Salé", image: "image/chipsbbq.jpg" },
    { id: 12, name: "Chips Nature", price: 1.50, stock: 40, minStock: 5, category: "Salé", image: "image/chipsnature.jpg" },
    { id: 13, name: "Chips Poulet", price: 2.00, stock: 40, minStock: 5, category: "Salé", image: "image/chipspouletroti.jpg" },
    { id: 14, name: "Saucisson", price: 2.50, stock: 40, minStock: 5, category: "Salé", image: "image/saucisson.jpg" },
    { id: 15, name: "Croissant", price: 1.50, stock: 40, minStock: 5, category: "Sucré", image: "image/croissant.jpg" },
    { id: 16, name: "Twix", price: 1.50, stock: 40, minStock: 5, category: "Sucré", image: "image/twix.jpg" },
    { id: 17, name: "Oréo", price: 1.50, stock: 40, minStock: 5, category: "Sucré", image: "image/oréo.jpg" },
    { id: 18, name: "M&M's", price: 2.00, stock: 40, minStock: 5, category: "Sucré", image: "image/M&Ms.jpg" },
    { id: 19, name: "Bonbon", price: 2.50, stock: 40, minStock: 5, category: "Sucré", image: "image/bonbons.jpg" },
    { id: 20, name: "Crêpe", price: 1.50, stock: 40, minStock: 5, category: "Sucré", image: "image/crepe.jpg" },
];

let cart = [];
let sales = [];
let editingId = null;
let autoSaveInterval = null;
let lastSaveTime = null;

// Persistent storage avec sauvegarde automatique et fallback localStorage
async function loadData() {
    try {
        // Essayer d'abord avec window.storage
        if (window.storage) {
            const productsData = await window.storage.get('mdl_products');
            const salesData = await window.storage.get('mdl_sales');
            const cartData = await window.storage.get('mdl_cart');
            
            if (productsData) products = JSON.parse(productsData.value);
            if (salesData) sales = JSON.parse(salesData.value);
            if (cartData) cart = JSON.parse(cartData.value);
        }
    } catch (error) {
        // Fallback vers localStorage si window.storage n'est pas disponible
        try {
            const productsLocal = localStorage.getItem('mdl_products');
            const salesLocal = localStorage.getItem('mdl_sales');
            const cartLocal = localStorage.getItem('mdl_cart');
            
            if (productsLocal) products = JSON.parse(productsLocal);
            if (salesLocal) sales = JSON.parse(salesLocal);
            if (cartLocal) cart = JSON.parse(cartLocal);
        } catch (localError) {
            console.log('Chargement initial des données par défaut');
        }
    }
    
    renderProducts();
    renderCart();
    updateLastSaveIndicator();
}

async function save() {
    try {
        // Essayer d'abord avec window.storage
        if (window.storage) {
            await window.storage.set('mdl_products', JSON.stringify(products));
            await window.storage.set('mdl_sales', JSON.stringify(sales));
            await window.storage.set('mdl_cart', JSON.stringify(cart));
            lastSaveTime = new Date();
            updateLastSaveIndicator();
            return true;
        }
    } catch (error) {
        // Rien faire, on va utiliser localStorage
    }
    
    // Fallback vers localStorage
    try {
        localStorage.setItem('mdl_products', JSON.stringify(products));
        localStorage.setItem('mdl_sales', JSON.stringify(sales));
        localStorage.setItem('mdl_cart', JSON.stringify(cart));
        lastSaveTime = new Date();
        updateLastSaveIndicator();
        return true;
    } catch (error) {
        console.error('Erreur de sauvegarde:', error);
        return false;
    }
}

// Sauvegarde automatique toutes les 30 secondes
function startAutoSave() {
    // Sauvegarde toutes les 30 secondes
    autoSaveInterval = setInterval(async () => {
        const success = await save();
        if (success) {
            console.log('💾 Sauvegarde automatique effectuée');
        }
    }, 30000);
}

// Arrêter la sauvegarde automatique (au cas où)
function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
        autoSaveInterval = null;
    }
}

// Afficher l'indicateur de dernière sauvegarde
function updateLastSaveIndicator() {
    const indicator = document.getElementById('lastSaveIndicator');
    if (!indicator) return;
    
    if (!lastSaveTime) {
        indicator.textContent = '💾 Sauvegarde auto activée';
        indicator.style.background = 'rgba(16, 185, 129, 0.2)';
        indicator.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        return;
    }
    
    const now = new Date();
    const diff = Math.floor((now - lastSaveTime) / 1000); // en secondes
    
    let text = '✅ Sauvegardé ';
    if (diff < 60) {
        text += 'à l\'instant';
    } else if (diff < 3600) {
        text += `il y a ${Math.floor(diff / 60)} min`;
    } else {
        text += lastSaveTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    
    indicator.textContent = text;
    indicator.style.background = 'rgba(16, 185, 129, 0.2)';
    indicator.style.borderColor = 'rgba(16, 185, 129, 0.3)';
}

// Sauvegarder avant de quitter la page
window.addEventListener('beforeunload', (e) => {
    save();
});

// Sauvegarder en cas de visibilité cachée (changement d'onglet, mise en veille)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        save();
        console.log('💾 Sauvegarde avant mise en arrière-plan');
    }
});

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
    
    document.getElementById('productsList').innerHTML = filtered.length ? filtered.map(p => {
        const imageContent = p.image && p.image.trim() !== '' && p.image !== 'image/' 
            ? `<img src="${p.image}" alt="${p.name}" onerror="this.parentElement.innerHTML='📦'">` 
            : '📦';
        
        const isOutOfStock = p.stock === 0;
        const isLowStock = p.stock > 0 && p.stock <= p.minStock;
        const cardClass = isOutOfStock ? 'product-card out-of-stock' : isLowStock ? 'product-card low-stock' : 'product-card';
        
        return `
            <div class="${cardClass}" onclick="${isOutOfStock ? '' : `addToCart(${p.id})`}">
                <div class="product-image">
                    ${imageContent}
                </div>
                <div class="product-name">${p.name}</div>
                <div class="product-price">${p.price.toFixed(2)} €</div>
                <div class="product-stock" style="color: ${isOutOfStock ? '#dc2626' : isLowStock ? '#f59e0b' : '#10b981'}; font-weight: ${isOutOfStock || isLowStock ? '700' : '400'}">
                    ${isOutOfStock ? '❌ Rupture' : isLowStock ? '⚠️ Stock faible: ' + p.stock : '✓ Stock: ' + p.stock}
                </div>
            </div>
        `;
    }).join('') : '<div class="empty-state"><div class="empty-emoji">🔍</div><div>Aucun produit trouvé</div></div>';
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
    
    // Sauvegarder automatiquement le panier
    save();
}

function updateCart(id, delta) {
    const item = cart.find(i => i.id === id);
    const product = products.find(p => p.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity > product.stock) {
            item.quantity = product.stock;
        }
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
        alert('⚠️ Le panier est vide !');
        return;
    }
    
    for (const item of cart) {
        const product = products.find(p => p.id === item.id);
        if (!product || product.stock < item.quantity) {
            alert(`⚠️ Stock insuffisant pour ${item.name}`);
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

// NOUVELLE FONCTION : Supprimer une vente
function deleteSale(saleId) {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;
    
    const confirmMsg = `Voulez-vous vraiment supprimer cette vente ?\n\nDate: ${new Date(sale.date).toLocaleString('fr-FR')}\nMontant: ${sale.total.toFixed(2)} €\n\nLes produits seront remis en stock.`;
    
    if (!confirm(confirmMsg)) return;
    
    // Remettre les produits en stock
    sale.items.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            product.stock += item.quantity;
        }
    });
    
    // Supprimer la vente de l'historique
    sales = sales.filter(s => s.id !== saleId);
    
    // Sauvegarder et rafraîchir
    save();
    renderStats();
    renderProducts();
    
    showNotification('🗑️ Vente supprimée et stock restauré', 'success');
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
    document.getElementById('stockTable').innerHTML = products.map(p => {
        const imageContent = p.image && p.image.trim() !== '' && p.image !== 'image/' 
            ? `<img src="${p.image}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='📦'">` 
            : '📦';
        
        return `
        <tr>
            <td>
                ${editingId === p.id ? 
                    `<input type="file" accept="image/*" onchange="uploadImage(${p.id}, event)" style="font-size: 0.75rem;">` :
                    `<div style="width: 50px; height: 50px; border-radius: 8px; overflow: hidden; background: #f1f5f9; display: flex; align-items: center; justify-content: center;">
                        ${imageContent}
                    </div>`
                }
            </td>
            <td>${editingId === p.id ?
                `<input value="${p.name}" onchange="updateProd(${p.id}, 'name', this.value)" style="width:100%">` : 
                `<strong>${p.name || '-'}</strong>`}</td>
            <td>${editingId === p.id ?
                `<input value="${p.category}" onchange="updateProd(${p.id}, 'category', this.value)" style="width:100%">` : 
                `${p.category || '-'}`}</td>
            <td>${editingId === p.id ?
                `<input type="number" step="0.01" value="${p.price}" onchange="updateProd(${p.id}, 'price', parseFloat(this.value))" style="width:80px">` :
                `<strong style="color: #3b82f6">${p.price.toFixed(2)} €</strong>`}</td>
            <td>${editingId === p.id ?
                `<input type="number" value="${p.stock}" onchange="updateProd(${p.id}, 'stock', parseInt(this.value))" style="width:60px">` :
                `<strong style="color: ${p.stock <= p.minStock ? '#dc2626' : '#10b981'}">${p.stock}</strong>`}</td>
            <td>${editingId === p.id ?
                `<input type="number" value="${p.minStock}" onchange="updateProd(${p.id}, 'minStock', parseInt(this.value))" style="width:60px">` :
                p.minStock}</td>
            <td>
                ${editingId === p.id ?
                    `<button class="btn-icon btn-save" onclick="editingId=null; save(); renderStock()">✓</button>` :
                    `<button class="btn-icon btn-edit" onclick="editingId=${p.id}; renderStock()">✏️</button>
                     <button class="btn-icon btn-delete" onclick="deleteProd(${p.id})">🗑️</button>`
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
        if (period === 'today') {
            return saleDate.toDateString() === now.toDateString();
        } else if (period === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return saleDate >= weekAgo;
        } else if (period === 'month') {
            return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
        } else if (period === 'year') {
            return saleDate.getFullYear() === now.getFullYear();
        }
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
    
    const prevFiltered = sales.filter(s => {
        const saleDate = new Date(s.date);
        if (period === 'today') {
            const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            return saleDate.toDateString() === yesterday.toDateString();
        } else if (period === 'week') {
            const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return saleDate >= twoWeeksAgo && saleDate < weekAgo;
        } else if (period === 'month') {
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            return saleDate.getMonth() === lastMonth.getMonth() && saleDate.getFullYear() === lastMonth.getFullYear();
        }
        return false;
    });
    
    const prevTotal = prevFiltered.reduce((sum, s) => sum + s.total, 0);
    const prevCount = prevFiltered.length;
    const prevAvg = prevCount > 0 ? prevTotal / prevCount : 0;
    
    const revenueEvol = prevTotal > 0 ? ((total - prevTotal) / prevTotal * 100).toFixed(1) : 0;
    const salesEvol = prevCount > 0 ? ((count - prevCount) / prevCount * 100).toFixed(1) : 0;
    const avgEvol = prevAvg > 0 ? ((avg - prevAvg) / prevAvg * 100).toFixed(1) : 0;
    
    document.getElementById('statRevenueEvolution').innerHTML = revenueEvol > 0 ? `📈 +${revenueEvol}%` : revenueEvol < 0 ? `📉 ${revenueEvol}%` : '➡️ 0%';
    document.getElementById('statSalesEvolution').innerHTML = salesEvol > 0 ? `📈 +${salesEvol}%` : salesEvol < 0 ? `📉 ${salesEvol}%` : '➡️ 0%';
    document.getElementById('statAvgEvolution').innerHTML = avgEvol > 0 ? `📈 +${avgEvol}%` : avgEvol < 0 ? `📉 ${avgEvol}%` : '➡️ 0%';
    
    const productSales = {};
    filtered.forEach(s => {
        s.items.forEach(item => {
            if (!productSales[item.id]) {
                productSales[item.id] = { ...item, sold: 0, revenue: 0 };
            }
            productSales[item.id].sold += item.quantity;
            productSales[item.id].revenue += item.quantity * item.price;
        });
    });
    
    const topProds = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 40);
    
    document.getElementById('topProducts').innerHTML = topProds.length ? topProds.map((p, i) => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: ${i === 0 ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : '#f8fafc'}; border-radius: 12px; margin-bottom: 0.75rem; ${i === 0 ? 'border: 2px solid #f59e0b;' : ''}">
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="width: 35px; height: 35px; background: ${i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7f32' : '#3b82f6'}; color: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem;">${i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : i+1}</div>
                <div>
                    <div style="font-weight: 600; font-size: 0.9rem;">${p.name}</div>
                    <div style="font-size: 0.75rem; color: #64748b;">${p.category} • ${p.sold} vendus</div>
                </div>
            </div>
            <div style="text-align: right;">
                <div style="font-weight: 700; color: ${i === 0 ? '#f59e0b' : '#3b82f6'}; font-size: 1rem;">${p.revenue.toFixed(2)} €</div>
                <div style="font-size: 0.75rem; color: #64748b;">${p.price.toFixed(2)}€ × ${p.sold}</div>
            </div>
        </div>
    `).join('') : '<div class="empty-state"><div class="empty-emoji">🏆</div><div>Aucune donnée</div></div>';
    
    // MODIFICATION : Ajout du bouton de suppression dans l'historique
    document.getElementById('recentSales').innerHTML = filtered.slice(0, 20).map(s => `
        <div style="padding: 1rem; background: #f8fafc; border-radius: 12px; margin-bottom: 0.75rem; position: relative;">
            <button onclick="deleteSale(${s.id})" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ef4444; color: white; border: none; border-radius: 8px; padding: 0.4rem 0.6rem; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s;" onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">🗑️ Suppr.</button>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; padding-right: 80px;">
                <span style="font-size: 0.8rem; color: #64748b;">${new Date(s.date).toLocaleString('fr-FR', {dateStyle: 'short', timeStyle: 'short'})}</span>
                <span style="font-weight: 700; color: #10b981; font-size: 0.9rem;">${s.total.toFixed(2)} €</span>
            </div>
            <div style="font-size: 0.85rem; color: #475569;">${s.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}</div>
        </div>
    `).join('') || '<div class="empty-state"><div class="empty-emoji">📊</div><div>Aucune vente</div></div>';
    
    const categoryStats = {};
    filtered.forEach(s => {
        s.items.forEach(item => {
            const cat = item.category || 'Autre';
            if (!categoryStats[cat]) {
                categoryStats[cat] = { revenue: 0, quantity: 0 };
            }
            categoryStats[cat].revenue += item.quantity * item.price;
            categoryStats[cat].quantity += item.quantity;
        });
    });
    
    const categoryArray = Object.entries(categoryStats).sort((a, b) => b[1].revenue - a[1].revenue);
    const totalCatRevenue = categoryArray.reduce((sum, [, data]) => sum + data.revenue, 0);
    
    const categoryColors = {
        'Boisson': '#3b82f6',
        'Sucré': '#f59e0b',
        'Salé': '#10b981',
        'Autre': '#8b5cf6'
    };
    
    document.getElementById('categoryStats').innerHTML = categoryArray.length ? categoryArray.map(([cat, data]) => {
        const percent = totalCatRevenue > 0 ? (data.revenue / totalCatRevenue * 100).toFixed(1) : 0;
        const color = categoryColors[cat] || '#64748b';
        return `
            <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="font-weight: 600;">${cat}</span>
                    <span style="font-weight: 700; color: ${color};">${data.revenue.toFixed(2)} €</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="flex: 1; height: 10px; background: #e2e8f0; border-radius: 5px; overflow: hidden;">
                        <div style="height: 100%; background: ${color}; width: ${percent}%; transition: width 0.5s ease;"></div>
                    </div>
                    <span style="font-size: 0.85rem; color: #64748b; min-width: 50px; text-align: right;">${percent}%</span>
                </div>
                <div style="font-size: 0.8rem; color: #64748b; margin-top: 0.25rem;">${data.quantity} articles vendus</div>
            </div>
        `;
    }).join('') : '<div class="empty-state"><div class="empty-emoji">🏷️</div><div>Aucune donnée</div></div>';
    
    const uniqueDays = [...new Set(filtered.map(s => new Date(s.date).toDateString()))].length;
    const avgDailyRev = uniqueDays > 0 ? total / uniqueDays : 0;
    document.getElementById('avgDailyRevenue').textContent = avgDailyRev.toFixed(2) + ' €';
    
    const dailyRevenues = {};
    filtered.forEach(s => {
        const day = new Date(s.date).toDateString();
        dailyRevenues[day] = (dailyRevenues[day] || 0) + s.total;
    });
    const bestDayRevenue = Math.max(...Object.values(dailyRevenues), 0);
    document.getElementById('bestDay').textContent = bestDayRevenue.toFixed(2) + ' €';
    
    const stockValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
    document.getElementById('stockValue').textContent = stockValue.toFixed(2) + ' €';
    
    const topProd = topProds[0];
    document.getElementById('topProduct').textContent = topProd ? `${topProd.name} (${topProd.revenue.toFixed(2)}€)` : '-';
    
    const forecast = avgDailyRev * 7;
    const forecastMonth = avgDailyRev * 30;
    document.getElementById('forecastWeek').textContent = forecast.toFixed(2) + ' €';
    document.getElementById('forecastMonth').textContent = forecastMonth.toFixed(2) + ' €';
    
    renderRevenueChart(filtered);
    renderHourlyChart(filtered);
    renderWeekdayChart(filtered);
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

function renderHourlyChart(salesData) {
    const canvas = document.getElementById('hourlyChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const hourlyData = new Array(24).fill(0);
    const hourlyCounts = new Array(24).fill(0);
    
    salesData.forEach(s => {
        const hour = new Date(s.date).getHours();
        hourlyData[hour] += s.total;
        hourlyCounts[hour]++;
    });
    
    canvas.height = 250;
    canvas.width = canvas.offsetWidth;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = Math.max(...hourlyData, 1);
    
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }
    
    ctx.beginPath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    hourlyData.forEach((value, hour) => {
        const x = padding + (hour / 23) * chartWidth;
        const y = canvas.height - padding - (value / maxValue) * chartHeight;
        if (hour === 0) {
            ctx.moveTo(x, canvas.height - padding);
            ctx.lineTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    hourlyData.forEach((value, hour) => {
        const x = padding + (hour / 23) * chartWidth;
        const y = canvas.height - padding - (value / maxValue) * chartHeight;
        
        if (hour === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    hourlyData.forEach((value, hour) => {
        if (value > 0) {
            const x = padding + (hour / 23) * chartWidth;
            const y = canvas.height - padding - (value / maxValue) * chartHeight;
            
            ctx.beginPath();
            ctx.fillStyle = 'white';
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 3;
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            if (value > maxValue * 0.7) {
                ctx.fillStyle = '#0f172a';
                ctx.font = 'bold 10px Outfit';
                ctx.textAlign = 'center';
                ctx.fillText(value.toFixed(0) + '€', x, y - 12);
            }
        }
    });
    
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Outfit';
    ctx.textAlign = 'center';
    for (let h = 0; h < 24; h += 2) {
        const x = padding + (h / 23) * chartWidth;
        ctx.fillText(h + 'h', x, canvas.height - 10);
    }
    
    ctx.textAlign = 'right';
    ctx.font = '10px Outfit';
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        const value = maxValue * (1 - i / 4);
        ctx.fillText(value.toFixed(0) + '€', padding - 5, y + 4);
    }
}

function renderWeekdayChart(salesData) {
    const canvas = document.getElementById('weekdayChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const weekdays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const weekdayData = new Array(7).fill(0);
    const weekdayCounts = new Array(7).fill(0);
    
    salesData.forEach(s => {
        const day = new Date(s.date).getDay();
        weekdayData[day] += s.total;
        weekdayCounts[day]++;
    });
    
    const avgData = weekdayData.map((total, i) => weekdayCounts[i] > 0 ? total / weekdayCounts[i] : 0);
    
    canvas.height = 250;
    canvas.width = canvas.offsetWidth;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const padding = 50;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = Math.max(...avgData, 1);
    const barWidth = Math.min(chartWidth / 7 - 10, 80);
    const spacing = chartWidth / 7;
    
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
        
        const value = maxValue * (1 - i / 4);
        ctx.fillStyle = '#64748b';
        ctx.font = '11px Outfit';
        ctx.textAlign = 'right';
        ctx.fillText(value.toFixed(0) + '€', padding - 5, y + 4);
    }
    
    avgData.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + index * spacing + (spacing - barWidth) / 2;
        const y = canvas.height - padding - barHeight;
        
        let color1, color2;
        if (index === 0 || index === 6) {
            color1 = '#8b5cf6';
            color2 = '#6d28d9';
        } else {
            color1 = '#3b82f6';
            color2 = '#1e40af';
        }
        
        const gradient = ctx.createLinearGradient(0, y, 0, canvas.height - padding);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        
        ctx.shadowColor = `rgba(59, 130, 246, 0.3)`;
        ctx.shadowBlur = 8;
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
        
        if (weekdayCounts[index] > 0) {
            ctx.fillStyle = '#94a3b8';
            ctx.font = '9px Outfit';
            ctx.fillText(`(${weekdayCounts[index]} j)`, x + barWidth / 2, y - 20);
        }
    });
    
    ctx.fillStyle = '#475569';
    ctx.font = '11px Outfit';
    ctx.textAlign = 'center';
    weekdays.forEach((day, index) => {
        const x = padding + index * spacing + spacing / 2;
        ctx.fillText(day.substring(0, 3), x, canvas.height - 10);
    });
}

function renderCourses() {
    const lowStock = products.filter(p => p.stock <= p.minStock && p.name);
    
    if (lowStock.length === 0) {
        document.getElementById('shoppingList').innerHTML = `
            <div class="empty-state">
                <div class="empty-emoji">✅</div>
                <div style="font-size: 1.25rem; font-weight: 700; color: #10b981; margin-bottom: 0.5rem;">Stock suffisant</div>
                <div>Tous les produits sont bien approvisionnés</div>
            </div>
        `;
    } else {
        document.getElementById('shoppingList').innerHTML = lowStock.map(p => {
            const imageContent = p.image && p.image.trim() !== '' && p.image !== 'image/' 
                ? `<img src="${p.image}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='<span style=\\'font-size: 1.5rem;\\'>📦</span>'">` 
                : '<span style="font-size: 1.5rem;">📦</span>';
            
            return `
                <div class="alert-box alert-warning" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 50px; height: 50px; border-radius: 10px; overflow: hidden; background: #f1f5f9; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            ${imageContent}
                        </div>
                        <div>
                            <div style="font-weight: 700; font-size: 1rem;">${p.name}</div>
                            <div style="font-size: 0.85rem;">${p.category}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 700; color: #dc2626; font-size: 0.9rem;">Stock: ${p.stock}</div>
                        <div style="font-size: 0.85rem;">Min: ${p.minStock}</div>
                        <div style="font-weight: 700; color: #1e40af; margin-top: 0.25rem; font-size: 0.9rem;">À commander: ${Math.max(p.minStock * 2 - p.stock, 0)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

async function exportData() {
    const data = { products, sales, exportDate: new Date().toISOString() };
    
    try {
        // Ouvre une fenêtre pour choisir où enregistrer
        const handle = await window.showSaveFilePicker({
            suggestedName: `mdl-backup-${new Date().toISOString().split('T')[0]}.json`,
            types: [{
                description: 'JSON File',
                accept: {'application/json': ['.json']},
            }],
        });

        const writable = await handle.createWritable();
        await writable.write(JSON.stringify(data, null, 2));
        await writable.close();

        showNotification('💾 Données sauvegardées dans votre dossier !', 'success');
    } catch (err) {
        showNotification('❌ Sauvegarde annulée', 'error');
    }
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (data.products && data.sales) {
                        products = data.products;
                        sales = data.sales;
                        await save();
                        renderProducts();
                        renderCart();
                        showNotification('✅ Données importées avec succès !', 'success');
                    }
                } catch (error) {
                    showNotification('❌ Erreur lors de l\'import du fichier', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert('Impossible de passer en plein écran');
        });
    } else {
        document.exitFullscreen();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadData();
    startAutoSave();
    
    // Mettre à jour l'indicateur toutes les 10 secondes
    setInterval(updateLastSaveIndicator, 10000);
});
