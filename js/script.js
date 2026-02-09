// Menu móvel
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Scroll animations
const fadeElements = document.querySelectorAll('.fade-in');

const appearOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            appearOnScroll.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(element => {
    appearOnScroll.observe(element);
});

// Form submission
const leadForm = document.getElementById('lead-form');

leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const emailInput = leadForm.querySelector('.email-input');
    const email = emailInput.value;
    
    if (validateEmail(email)) {
        // Aqui você normalmente enviaria os dados para um servidor
        alert(`Obrigado! Você foi adicionado à lista de espera com o e-mail: ${email}\nEm breve você receberá nossas novidades.`);
        emailInput.value = '';
    } else {
        alert('Por favor, insira um endereço de e-mail válido.');
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Smooth scroll para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Carrinho de compras
let cart = [];
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const totalPrice = document.getElementById('total-price');
const addToCartBtn = document.getElementById('add-to-cart');
const mainProductImg = document.getElementById('main-product-img');

// Toggle do carrinho
cartToggle.addEventListener('click', (e) => {
    e.preventDefault();
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

cartOverlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

// Troca de imagens do produto
document.querySelectorAll('.thumbnail').forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        // Remover classe active de todas as thumbnails
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.classList.remove('active');
        });
        
        // Adicionar classe active à thumbnail clicada
        thumbnail.classList.add('active');
        
        // Atualizar imagem principal
        const imgSrc = thumbnail.getAttribute('data-img');
        const imgAlt = thumbnail.getAttribute('data-alt');
        
        mainProductImg.src = imgSrc;
        mainProductImg.alt = imgAlt;
        
        // Adicionar efeito de fade
        mainProductImg.style.opacity = '0.7';
        setTimeout(() => {
            mainProductImg.style.opacity = '1';
        }, 150);
    });
});

// Atualizar carrinho
function updateCart() {
    // Atualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Atualizar itens do carrinho
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
        totalPrice.textContent = 'R$ 0,00';
        return;
    }
    
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        // Determinar qual imagem usar baseada na cor
        let imgSrc = 'assets/images/frente.jpeg';
        if (item.color === 'branco') {
            // Se tiver imagem branca específica, usar aqui
            imgSrc = 'assets/images/frente.jpeg';
        } else if (item.color === 'cinza') {
            // Se tiver imagem cinza específica, usar aqui
            imgSrc = 'assets/images/frente.jpeg';
        }
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${imgSrc}" alt="Camiseta ${item.color}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">Camiseta Essential</div>
                <div class="cart-item-meta">Cor: ${item.color.charAt(0).toUpperCase() + item.color.slice(1)} • Tamanho: ${item.size}</div>
                <div class="cart-item-meta">Quantidade: ${item.quantity}</div>
                <div class="cart-item-price">R$ ${itemTotal.toFixed(2)}</div>
            </div>
            <button class="cart-item-remove" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Adicionar eventos para remover itens
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.currentTarget.getAttribute('data-index');
            cart.splice(index, 1);
            updateCart();
        });
    });
    
    totalPrice.textContent = `R$ ${total.toFixed(2)}`;
}

// Adicionar ao carrinho
addToCartBtn.addEventListener('click', () => {
    const color = document.querySelector('.color-option.active').getAttribute('data-color');
    const size = document.querySelector('.size-option.active').getAttribute('data-size');
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = 89.90;
    
    // Verificar se já existe o mesmo produto no carrinho
    const existingItemIndex = cart.findIndex(item => 
        item.color === color && item.size === size
    );
    
    if (existingItemIndex !== -1) {
        // Atualizar quantidade se já existir
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Adicionar novo item
        cart.push({
            color,
            size,
            quantity,
            price
        });
    }
    
    updateCart();
    
    // Mostrar mensagem de confirmação
    alert(`Adicionado ao carrinho: Camiseta ${color} tamanho ${size} (${quantity}x)`);
    
    // Abrir carrinho
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
});

// Seleção de cores
document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.color-option').forEach(opt => {
            opt.classList.remove('active');
        });
        option.classList.add('active');
    });
});

// Seleção de tamanhos
document.querySelectorAll('.size-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.size-option').forEach(opt => {
            opt.classList.remove('active');
        });
        option.classList.add('active');
    });
});

// Seletor de quantidade
const quantityInput = document.getElementById('quantity');
document.querySelector('.quantity-btn.minus').addEventListener('click', () => {
    if (quantityInput.value > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
});

document.querySelector('.quantity-btn.plus').addEventListener('click', () => {
    if (quantityInput.value < 10) {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    }
});

quantityInput.addEventListener('change', () => {
    if (quantityInput.value < 1) quantityInput.value = 1;
    if (quantityInput.value > 10) quantityInput.value = 10;
});

// Checkout
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = document.getElementById('close-checkout');
const checkoutForm = document.getElementById('checkout-form');
const orderSummary = document.getElementById('order-summary');
const orderSubtotal = document.getElementById('order-subtotal');
const shippingCost = document.getElementById('shipping-cost');
const orderTotal = document.getElementById('order-total');
const cepInput = document.getElementById('cep');
const cityInput = document.getElementById('city');
const stateInput = document.getElementById('state');

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio. Adicione produtos antes de finalizar.');
        return;
    }
    
    // Atualizar resumo do pedido
    updateOrderSummary();
    
    // Mostrar modal
    checkoutModal.classList.add('active');
});

closeCheckout.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
});

// Fechar modal ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
        checkoutModal.classList.remove('active');
    }
});

// Atualizar resumo do pedido
function updateOrderSummary() {
    orderSummary.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div>
                <div>Camiseta Essential (${item.color.charAt(0).toUpperCase() + item.color.slice(1)}, ${item.size})</div>
                <small>Quantidade: ${item.quantity}</small>
            </div>
            <div>R$ ${itemTotal.toFixed(2)}</div>
        `;
        orderSummary.appendChild(orderItem);
    });
    
    const shipping = 10.00;
    const total = subtotal + shipping;
    
    orderSubtotal.textContent = `R$ ${subtotal.toFixed(2)}`;
    shippingCost.textContent = `R$ ${shipping.toFixed(2)}`;
    orderTotal.textContent = `R$ ${total.toFixed(2)}`;
}

// Máscara para CEP
cepInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    
    e.target.value = value;
    
    // Auto-preenchimento para CEP de São Ludgero
    if (value === '88730-000') {
        cityInput.value = 'São Ludgero';
        stateInput.value = 'SC';
    }
});

// Auto-preenchimento de endereço via CEP (simulação)
cepInput.addEventListener('blur', () => {
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length === 8) {
        // Simulação de API de CEP
        // Na implementação real, você usaria uma API como ViaCEP
        
        // Para demonstração, apenas preenchemos com dados fictícios
        // ou específicos para 88730-000
        if (cep === '88730000') {
            cityInput.value = 'São Ludgero';
            stateInput.value = 'SC';
            document.getElementById('street').value = 'Rua Exemplo';
            document.getElementById('neighborhood').value = 'Centro';
        } else {
            // Para outros CEPs, você poderia fazer uma chamada à API
            // Aqui estamos apenas simulando
            cityInput.value = 'Cidade Exemplo';
            stateInput.value = 'XX';
            document.getElementById('street').value = 'Rua Exemplo';
            document.getElementById('neighborhood').value = 'Bairro Exemplo';
        }
    }
});

// Máscara para CPF
const cpfInput = document.getElementById('cpf');
cpfInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 3 && value.length <= 6) {
        value = value.substring(0, 3) + '.' + value.substring(3);
    } else if (value.length > 6 && value.length <= 9) {
        value = value.substring(0, 3) + '.' + value.substring(3, 6) + '.' + value.substring(6);
    } else if (value.length > 9) {
        value = value.substring(0, 3) + '.' + value.substring(3, 6) + '.' + value.substring(6, 9) + '-' + value.substring(9, 11);
    }
    
    e.target.value = value;
});

// Máscara para telefone
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 2 && value.length <= 6) {
        value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
    } else if (value.length > 6 && value.length <= 10) {
        value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 6) + '-' + value.substring(6);
    } else if (value.length > 10) {
        value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 7) + '-' + value.substring(7, 11);
    } else if (value.length === 2) {
        value = '(' + value;
    }
    
    e.target.value = value;
});

// Envio do formulário de checkout
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validar formulário
    const requiredFields = ['full-name', 'email', 'phone', 'cpf', 'cep', 'street', 'number', 'neighborhood', 'city', 'state'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#ff3333';
        } else {
            field.style.borderColor = '#ddd';
        }
    });
    
    if (!isValid) {
        alert('Por favor, preencha todos os campos obrigatórios marcados com *');
        return;
    }
    
    // Coletar dados do formulário
    const formData = {
        nome: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('phone').value,
        cpf: document.getElementById('cpf').value,
        cep: document.getElementById('cep').value,
        rua: document.getElementById('street').value,
        numero: document.getElementById('number').value,
        complemento: document.getElementById('complement').value,
        bairro: document.getElementById('neighborhood').value,
        cidade: document.getElementById('city').value,
        estado: document.getElementById('state').value,
        observacoes: document.getElementById('notes').value,
        pedido: cart.map(item => ({
            produto: 'Camiseta Essential',
            cor: item.color.charAt(0).toUpperCase() + item.color.slice(1),
            tamanho: item.size,
            quantidade: item.quantity,
            preco: item.price
        })),
        subtotal: parseFloat(orderSubtotal.textContent.replace('R$ ', '').replace(',', '.')),
        frete: parseFloat(shippingCost.textContent.replace('R$ ', '').replace(',', '.')),
        total: parseFloat(orderTotal.textContent.replace('R$ ', '').replace(',', '.'))
    };
    
    // Criar mensagem para WhatsApp
    const whatsappMessage = createWhatsAppMessage(formData);
    
    // Número de WhatsApp (substitua pelo seu)
    const whatsappNumber = '5548999999999'; // Exemplo: 55 (BR) + 48 (DDD) + 999999999
    
    // URL do WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Abrir WhatsApp em nova aba
    window.open(whatsappUrl, '_blank');
    
    // Fechar modal
    checkoutModal.classList.remove('active');
    
    // Limpar carrinho
    cart = [];
    updateCart();
    
    // Mostrar mensagem de confirmação
    alert('Pedido enviado! Você será redirecionado para o WhatsApp para confirmar seu pedido.');
});

// Criar mensagem para WhatsApp
function createWhatsAppMessage(formData) {
    let message = `*NOVA PRÉ-VENDA RIZE - DROP 1.0*\n\n`;
    message += `*Informações do Cliente:*\n`;
    message += `Nome: ${formData.nome}\n`;
    message += `E-mail: ${formData.email}\n`;
    message += `Telefone: ${formData.telefone}\n`;
    message += `CPF: ${formData.cpf}\n\n`;
    
    message += `*Endereço de Entrega:*\n`;
    message += `${formData.rua}, ${formData.numero}\n`;
    if (formData.complemento) message += `Complemento: ${formData.complemento}\n`;
    message += `${formData.bairro}\n`;
    message += `${formData.cidade} - ${formData.estado}\n`;
    message += `CEP: ${formData.cep}\n\n`;
    
    message += `*Pedido:*\n`;
    formData.pedido.forEach((item, index) => {
        message += `${index + 1}. ${item.produto} - ${item.cor} - Tamanho: ${item.tamanho} - Quantidade: ${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
    });
    
    message += `\n*Resumo Financeiro:*\n`;
    message += `Subtotal: R$ ${formData.subtotal.toFixed(2)}\n`;
    message += `Frete: R$ ${formData.frete.toFixed(2)}\n`;
    message += `*Total: R$ ${formData.total.toFixed(2)}*\n\n`;
    
    if (formData.observacoes) {
        message += `*Observações:*\n${formData.observacoes}\n\n`;
    }
    
    message += `---\n`;
    message += `Data do pedido: ${new Date().toLocaleDateString('pt-BR')}\n`;
    message += `Forma de pagamento: A combinar`;
    
    return message;
}

// Inicializar carrinho e funcionalidades
updateCart();

// Adicionar fallback para imagens que não carregarem
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        // Se a imagem não carregar, mostrar placeholder
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNFMEUwRTAiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiPkltYWdlbTwvdGV4dD48L3N2Zz4=';
        this.alt = 'Imagem não disponível';
    });
});