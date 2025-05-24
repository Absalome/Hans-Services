/**
 * Script para sincronização de produtos entre painéis
 * Garante que os produtos adicionados pelo administrador sejam exibidos para funcionários e clientes
 */

// Função para inicializar a sincronização de produtos
function initProductSync() {
    // Configurar eventos de sincronização
    setupSyncEvents();
    
    // Carregar produtos para o painel atual
    loadProductsForCurrentPanel();
    
    console.log('Sincronização de produtos inicializada com sucesso');
}

// Configurar eventos de sincronização
function setupSyncEvents() {
    // Verificar alterações no localStorage a cada 5 segundos
    setInterval(checkForProductChanges, 5000);
    
    // Adicionar evento para sincronização quando a página for recarregada
    window.addEventListener('focus', loadProductsForCurrentPanel);
}

// Verificar alterações nos produtos
function checkForProductChanges() {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo) return;
    
    // Obter último timestamp de sincronização
    const lastSync = window.utils.getFromLocalStorage('lastProductSync') || 0;
    
    // Verificar se há alterações nos produtos
    const hasChanges = dadosExemplo.produtos.some(produto => {
        const produtoTimestamp = new Date(produto.updatedAt || 0).getTime();
        return produtoTimestamp > lastSync;
    });
    
    // Se houver alterações, atualizar a interface
    if (hasChanges) {
        loadProductsForCurrentPanel();
        
        // Atualizar timestamp de sincronização
        window.utils.saveToLocalStorage('lastProductSync', Date.now());
    }
}

// Carregar produtos para o painel atual
function loadProductsForCurrentPanel() {
    // Obter tipo de usuário atual
    const currentUser = window.utils.getFromLocalStorage('currentUser');
    if (!currentUser) return;
    
    // Carregar produtos de acordo com o tipo de usuário
    switch (currentUser.type) {
        case 'admin':
            loadProductsForAdmin();
            break;
        case 'funcionario':
            loadProductsForFuncionario();
            break;
        case 'cliente':
            loadProductsForCliente();
            break;
        default:
            console.error('Tipo de usuário desconhecido');
    }
}

// Carregar produtos para o painel do administrador
function loadProductsForAdmin() {
    // Verificar se a função de gestão de produtos está disponível
    if (window.productManagement && typeof window.productManagement.loadProductList === 'function') {
        window.productManagement.loadProductList();
    }
}

// Carregar produtos para o painel do funcionário
function loadProductsForFuncionario() {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo) return;
    
    // Obter tabela de estoque
    const tbody = document.getElementById('estoque-table-body');
    if (!tbody) return;
    
    // Limpar tabela
    tbody.innerHTML = '';
    
    // Verificar se há produtos
    if (dadosExemplo.produtos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum produto encontrado.</td></tr>';
        return;
    }
    
    // Adicionar produtos à tabela
    dadosExemplo.produtos.forEach(produto => {
        // Determinar status do estoque
        let status = 'Normal';
        let statusClass = 'text-success';
        
        if (produto.quantidade <= 5) {
            status = 'Baixo';
            statusClass = 'text-danger';
        } else if (produto.quantidade <= 10) {
            status = 'Médio';
            statusClass = 'text-warning';
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${produto.nome}</td>
            <td>
                <img src="${produto.imagem}" alt="${produto.nome}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
            </td>
            <td>${produto.armazemNome}</td>
            <td>${produto.quantidade}</td>
            <td>${window.utils.formatCurrency(produto.preco)}</td>
            <td class="${statusClass}">${status}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Atualizar produtos com estoque baixo
    updateLowStockProducts(dadosExemplo.produtos);
}

// Atualizar produtos com estoque baixo
function updateLowStockProducts(produtos) {
    // Obter container de produtos com estoque baixo
    const estoqueBaixo = document.getElementById('estoque-baixo');
    if (!estoqueBaixo) return;
    
    // Filtrar produtos com estoque baixo
    const produtosBaixo = produtos.filter(produto => produto.quantidade <= 5);
    
    // Verificar se há produtos com estoque baixo
    if (produtosBaixo.length === 0) {
        estoqueBaixo.innerHTML = '<p>Nenhum produto com estoque baixo.</p>';
        return;
    }
    
    // Adicionar produtos com estoque baixo
    let html = '';
    
    produtosBaixo.forEach(produto => {
        html += `
            <div class="estoque-baixo-item">
                <div class="estoque-baixo-info">
                    <h4>${produto.nome}</h4>
                    <p><strong>Armazém:</strong> ${produto.armazemNome}</p>
                    <p><strong>Quantidade:</strong> <span class="text-danger">${produto.quantidade}</span></p>
                </div>
                <div class="estoque-baixo-actions">
                    <button class="btn btn-sm btn-warning" onclick="notificarEstoqueBaixo('${produto.id}')">
                        <i class="fas fa-bell"></i> Notificar
                    </button>
                </div>
            </div>
        `;
    });
    
    estoqueBaixo.innerHTML = html;
}

// Carregar produtos para o painel do cliente
function loadProductsForCliente() {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo) return;
    
    // Obter container de produtos disponíveis
    const produtosDisponiveis = document.getElementById('produtos-disponiveis');
    if (!produtosDisponiveis) return;
    
    // Obter armazém selecionado
    const armazemSelect = document.getElementById('compra-armazem');
    const armazemId = armazemSelect ? armazemSelect.value : '';
    
    // Filtrar produtos pelo armazém selecionado
    let produtosFiltrados = dadosExemplo.produtos;
    
    if (armazemId) {
        produtosFiltrados = produtosFiltrados.filter(produto => produto.armazem === armazemId);
    }
    
    // Verificar se há produtos
    if (produtosFiltrados.length === 0) {
        produtosDisponiveis.innerHTML = '<p class="text-center">Nenhum produto disponível para este armazém.</p>';
        return;
    }
    
    // Adicionar produtos ao grid
    let html = '<div class="produtos-grid">';
    
    produtosFiltrados.forEach(produto => {
        html += `
            <div class="produto-card">
                <div class="produto-imagem">
                    <img src="${produto.imagem}" alt="${produto.nome}">
                </div>
                <div class="produto-info">
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao || 'Sem descrição'}</p>
                    <div class="produto-preco">${window.utils.formatCurrency(produto.preco)}</div>
                    <div class="produto-actions">
                        <div class="quantidade-controle">
                            <button class="btn-quantidade-menos" data-id="${produto.id}">-</button>
                            <input type="number" class="quantidade-input" data-id="${produto.id}" value="1" min="1" max="${produto.quantidade}">
                            <button class="btn-quantidade-mais" data-id="${produto.id}">+</button>
                        </div>
                        <button class="btn btn-sm btn-primary btn-adicionar-carrinho" 
                                data-id="${produto.id}" 
                                data-nome="${produto.nome}" 
                                data-preco="${produto.preco}">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    produtosDisponiveis.innerHTML = html;
    
    // Configurar eventos de quantidade
    setupQuantityEvents();
    
    // Configurar eventos de adicionar ao carrinho
    setupAddToCartEvents();
    
    // Atualizar select de armazéns
    updateWarehouseSelect(dadosExemplo.armazens);
}

// Atualizar select de armazéns
function updateWarehouseSelect(armazens) {
    // Obter select de armazéns
    const armazemSelect = document.getElementById('compra-armazem');
    if (!armazemSelect) return;
    
    // Verificar se já está preenchido
    if (armazemSelect.options.length > 1) return;
    
    // Limpar select
    armazemSelect.innerHTML = '<option value="">Selecione um armazém</option>';
    
    // Adicionar armazéns ao select
    armazens.forEach(armazem => {
        const option = document.createElement('option');
        option.value = armazem.id;
        option.textContent = armazem.nome;
        armazemSelect.appendChild(option);
    });
    
    // Adicionar evento de mudança
    armazemSelect.addEventListener('change', loadProductsForCliente);
}

// Configurar eventos de quantidade
function setupQuantityEvents() {
    // Botões de quantidade
    document.querySelectorAll('.btn-quantidade-menos, .btn-quantidade-mais').forEach(button => {
        button.addEventListener('click', event => {
            const produtoId = event.target.getAttribute('data-id');
            const input = document.querySelector(`.quantidade-input[data-id="${produtoId}"]`);
            let valor = parseInt(input.value);
            
            if (event.target.classList.contains('btn-quantidade-menos')) {
                valor = Math.max(1, valor - 1);
            } else {
                valor = Math.min(parseInt(input.getAttribute('max')), valor + 1);
            }
            
            input.value = valor;
        });
    });
}

// Configurar eventos de adicionar ao carrinho
function setupAddToCartEvents() {
    // Botões de adicionar ao carrinho
    document.querySelectorAll('.btn-adicionar-carrinho').forEach(button => {
        button.addEventListener('click', event => {
            const produtoId = event.target.getAttribute('data-id') || event.target.closest('.btn-adicionar-carrinho').getAttribute('data-id');
            const produtoNome = event.target.getAttribute('data-nome') || event.target.closest('.btn-adicionar-carrinho').getAttribute('data-nome');
            const produtoPreco = parseFloat(event.target.getAttribute('data-preco') || event.target.closest('.btn-adicionar-carrinho').getAttribute('data-preco'));
            const quantidade = parseInt(document.querySelector(`.quantidade-input[data-id="${produtoId}"]`).value);
            
            // Adicionar ao carrinho
            addToCart(produtoId, produtoNome, produtoPreco, quantidade);
        });
    });
}

// Adicionar produto ao carrinho
function addToCart(produtoId, produtoNome, produtoPreco, quantidade) {
    // Obter carrinho atual
    const carrinho = window.utils.getFromLocalStorage('carrinho') || [];
    
    // Verificar se o produto já está no carrinho
    const index = carrinho.findIndex(item => item.id === produtoId);
    
    if (index !== -1) {
        // Atualizar quantidade
        carrinho[index].quantidade += quantidade;
    } else {
        // Adicionar novo item
        carrinho.push({
            id: produtoId,
            nome: produtoNome,
            preco: produtoPreco,
            quantidade: quantidade
        });
    }
    
    // Salvar carrinho no localStorage
    window.utils.saveToLocalStorage('carrinho', carrinho);
    
    // Atualizar interface do carrinho
    updateCartInterface();
    
    // Mostrar mensagem
    alert(`${quantidade}x ${produtoNome} adicionado ao carrinho!`);
}

// Atualizar interface do carrinho
function updateCartInterface() {
    // Obter carrinho atual
    const carrinho = window.utils.getFromLocalStorage('carrinho') || [];
    
    // Obter container do carrinho
    const carrinhoCompra = document.getElementById('carrinho-compra');
    const compraTotal = document.getElementById('compra-total');
    
    if (!carrinhoCompra || !compraTotal) return;
    
    // Verificar se o carrinho está vazio
    if (carrinho.length === 0) {
        carrinhoCompra.innerHTML = '<p class="text-center">Seu carrinho está vazio.</p>';
        compraTotal.textContent = window.utils.formatCurrency(0);
        return;
    }
    
    // Calcular total
    let total = 0;
    
    // Adicionar itens ao carrinho
    let html = '';
    
    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        
        html += `
            <div class="carrinho-item">
                <div class="carrinho-item-info">
                    <h4>${item.nome}</h4>
                    <p>${item.quantidade} x ${window.utils.formatCurrency(item.preco)} = ${window.utils.formatCurrency(subtotal)}</p>
                </div>
                <div class="carrinho-item-actions">
                    <button class="btn btn-sm btn-danger btn-remover-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    carrinhoCompra.innerHTML = html;
    compraTotal.textContent = window.utils.formatCurrency(total);
    
    // Configurar eventos de remoção
    document.querySelectorAll('.btn-remover-item').forEach(button => {
        button.addEventListener('click', event => {
            const produtoId = event.target.getAttribute('data-id') || event.target.closest('.btn-remover-item').getAttribute('data-id');
            removeFromCart(produtoId);
        });
    });
}

// Remover produto do carrinho
function removeFromCart(produtoId) {
    // Obter carrinho atual
    const carrinho = window.utils.getFromLocalStorage('carrinho') || [];
    
    // Remover produto
    const novoCarrinho = carrinho.filter(item => item.id !== produtoId);
    
    // Salvar carrinho no localStorage
    window.utils.saveToLocalStorage('carrinho', novoCarrinho);
    
    // Atualizar interface do carrinho
    updateCartInterface();
}

// Função global para notificar estoque baixo
window.notificarEstoqueBaixo = function(produtoId) {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo) return;
    
    // Encontrar produto
    const produto = dadosExemplo.produtos.find(p => p.id === produtoId);
    if (!produto) {
        alert('Produto não encontrado.');
        return;
    }
    
    // Simular notificação
    alert(`Notificação enviada ao administrador sobre estoque baixo do produto ${produto.nome} (${produto.quantidade} unidades).`);
};

// Exportar funções
window.productSync = {
    init: initProductSync,
    loadProductsForCurrentPanel,
    updateCartInterface
};
