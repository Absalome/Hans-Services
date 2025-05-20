/**
 * Script para gestão de produtos no painel do administrador
 * Implementa funcionalidades de upload de imagem e gestão completa de produtos
 */

// Função para inicializar a gestão de produtos
function initProductManagement() {
    // Carregar modal de produtos
    loadProductModal();
    
    // Configurar eventos do modal de produtos
    setupProductModalEvents();
    
    // Carregar lista de produtos
    loadProductList();
    
    // Carregar lista de armazéns no select
    loadWarehouseSelect();
    
    console.log('Gestão de produtos inicializada com sucesso');
}

// Carregar modal de produtos
async function loadProductModal() {
    try {
        // Criar container para modais se não existir
        if (!document.getElementById('modals-container')) {
            const modalsContainer = document.createElement('div');
            modalsContainer.id = 'modals-container';
            document.body.appendChild(modalsContainer);
        }
        
        // Carregar HTML do modal
        const response = await fetch('components/modals/produto.html');
        if (!response.ok) {
            throw new Error(`Erro ao carregar modal: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById('modals-container').innerHTML = html;
        
        return true;
    } catch (error) {
        console.error('Erro ao carregar modal de produtos:', error);
        return false;
    }
}

// Configurar eventos do modal de produtos
function setupProductModalEvents() {
    // Botões do modal
    const btnCancelarProduto = document.getElementById('btn-cancelar-produto');
    const btnSalvarProduto = document.getElementById('btn-salvar-produto');
    const btnFecharVisualizarProduto = document.getElementById('btn-fechar-visualizar-produto');
    const closeButtons = document.querySelectorAll('.modal .close');
    
    // Modal
    const modalProduto = document.getElementById('modal-produto');
    const modalVisualizarProduto = document.getElementById('modal-visualizar-produto');
    
    // Configurar preview de imagem
    window.utils.setupImagePreview('produto-imagem-input', 'produto-imagem-preview');
    
    // Fechar modais
    if (btnCancelarProduto) {
        btnCancelarProduto.addEventListener('click', () => {
            window.utils.closeModal(modalProduto);
        });
    }
    
    if (btnFecharVisualizarProduto) {
        btnFecharVisualizarProduto.addEventListener('click', () => {
            window.utils.closeModal(modalVisualizarProduto);
        });
    }
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            window.utils.closeModal(modal);
        });
    });
    
    // Salvar produto
    if (btnSalvarProduto) {
        btnSalvarProduto.addEventListener('click', saveProduct);
    }
    
    // Fechar modais ao clicar fora
    window.addEventListener('click', event => {
        if (event.target.classList.contains('modal')) {
            window.utils.closeModal(event.target);
        }
    });
}

// Carregar lista de produtos
function loadProductList() {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo) return;
    
    // Obter tabela de produtos
    const tbody = document.getElementById('stock-table-body');
    if (!tbody) return;
    
    // Limpar tabela
    tbody.innerHTML = '';
    
    // Verificar se há produtos
    if (dadosExemplo.produtos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhum produto encontrado.</td></tr>';
        return;
    }
    
    // Calcular total
    let valorTotal = 0;
    
    // Adicionar produtos à tabela
    dadosExemplo.produtos.forEach(produto => {
        const valorProduto = produto.quantidade * produto.preco;
        valorTotal += valorProduto;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${produto.nome}</td>
            <td>
                <img src="${produto.imagem}" alt="${produto.nome}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
            </td>
            <td>${produto.armazemNome}</td>
            <td>${produto.quantidade}</td>
            <td>${window.utils.formatCurrency(produto.preco)}</td>
            <td>${window.utils.formatCurrency(valorProduto)}</td>
            <td class="table-actions">
                <button class="view" onclick="visualizarProduto('${produto.id}')"><i class="fas fa-eye"></i></button>
                <button class="edit" onclick="editarProduto('${produto.id}')"><i class="fas fa-edit"></i></button>
                <button class="delete" onclick="excluirProduto('${produto.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Atualizar total
    const tfoot = document.querySelector('table tfoot');
    if (tfoot) {
        tfoot.querySelector('td:nth-child(6)').innerHTML = `<strong>${window.utils.formatCurrency(valorTotal)}</strong>`;
    }
}

// Carregar lista de armazéns no select
function loadWarehouseSelect() {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo) return;
    
    // Obter select de armazéns
    const select = document.getElementById('produto-armazem');
    if (!select) return;
    
    // Limpar select
    select.innerHTML = '<option value="">Selecione um armazém</option>';
    
    // Adicionar armazéns ao select
    dadosExemplo.armazens.forEach(armazem => {
        const option = document.createElement('option');
        option.value = armazem.id;
        option.textContent = armazem.nome;
        select.appendChild(option);
    });
}

// Salvar produto
function saveProduct() {
    // Obter dados do formulário
    const nome = document.getElementById('produto-nome').value;
    const descricao = document.getElementById('produto-descricao').value;
    const armazemId = document.getElementById('produto-armazem').value;
    const quantidade = parseInt(document.getElementById('produto-quantidade').value);
    const preco = parseFloat(document.getElementById('produto-preco').value);
    const categoriaId = document.getElementById('produto-categoria').value;
    const imagemInput = document.getElementById('produto-imagem-input');
    
    // Validar campos obrigatórios
    if (!nome || !armazemId || isNaN(quantidade) || isNaN(preco)) {
        alert('Por favor, preencha os campos obrigatórios.');
        return;
    }
    
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo) return;
    
    // Obter nome do armazém
    const armazem = dadosExemplo.armazens.find(a => a.id === armazemId);
    const armazemNome = armazem ? armazem.nome : 'Armazém não encontrado';
    
    // Obter nome da categoria
    let categoriaNome = '';
    if (categoriaId === '1') categoriaNome = 'Categoria 1';
    else if (categoriaId === '2') categoriaNome = 'Categoria 2';
    else if (categoriaId === '3') categoriaNome = 'Categoria 3';
    else categoriaNome = 'Sem categoria';
    
    // Verificar se é edição ou adição
    const formProduto = document.getElementById('form-produto');
    const produtoId = formProduto.getAttribute('data-id');
    
    // Processar imagem
    const imagemPreview = document.getElementById('produto-imagem-preview');
    const imagemSrc = imagemPreview.querySelector('img') ? 
        imagemPreview.querySelector('img').src : 
        '../img/produtos/produto_default.jpg';
    
    if (produtoId) {
        // Edição de produto existente
        const index = dadosExemplo.produtos.findIndex(p => p.id === produtoId);
        
        if (index !== -1) {
            // Atualizar produto
            dadosExemplo.produtos[index] = {
                ...dadosExemplo.produtos[index],
                nome,
                descricao,
                armazem: armazemId,
                armazemNome,
                quantidade,
                preco,
                categoria: categoriaId,
                categoriaNome,
                imagem: imagemSrc
            };
            
            // Adicionar movimentação
            dadosExemplo.movimentacoes = dadosExemplo.movimentacoes || [];
            dadosExemplo.movimentacoes.push({
                produtoId,
                data: new Date().toISOString(),
                tipo: 'Atualização',
                quantidade,
                responsavel: 'Admin'
            });
        }
    } else {
        // Adição de novo produto
        const novoProduto = {
            id: window.utils.generateId(),
            nome,
            descricao,
            armazem: armazemId,
            armazemNome,
            quantidade,
            preco,
            categoria: categoriaId,
            categoriaNome,
            imagem: imagemSrc
        };
        
        // Adicionar produto
        dadosExemplo.produtos.push(novoProduto);
        
        // Adicionar movimentação
        dadosExemplo.movimentacoes = dadosExemplo.movimentacoes || [];
        dadosExemplo.movimentacoes.push({
            produtoId: novoProduto.id,
            data: new Date().toISOString(),
            tipo: 'Entrada',
            quantidade,
            responsavel: 'Admin'
        });
        
        // Atualizar estatísticas do armazém
        if (armazem) {
            armazem.produtos = (armazem.produtos || 0) + quantidade;
        }
    }
    
    // Salvar dados no localStorage
    window.utils.saveToLocalStorage('dadosExemplo', dadosExemplo);
    
    // Fechar modal
    const modalProduto = document.getElementById('modal-produto');
    window.utils.closeModal(modalProduto);
    
    // Atualizar lista de produtos
    loadProductList();
    
    // Mostrar mensagem de sucesso
    alert(produtoId ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!');
}

// Função global para visualizar produto
window.visualizarProduto = function(id) {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo) return;
    
    // Encontrar produto
    const produto = dadosExemplo.produtos.find(p => p.id === id);
    if (!produto) {
        alert('Produto não encontrado.');
        return;
    }
    
    // Preencher informações do produto
    document.getElementById('visualizar-produto-nome').textContent = produto.nome;
    document.getElementById('visualizar-produto-descricao').textContent = produto.descricao || 'Sem descrição';
    document.getElementById('visualizar-produto-armazem').textContent = produto.armazemNome;
    document.getElementById('visualizar-produto-quantidade').textContent = produto.quantidade;
    document.getElementById('visualizar-produto-preco').textContent = window.utils.formatCurrency(produto.preco);
    document.getElementById('visualizar-produto-total').textContent = window.utils.formatCurrency(produto.quantidade * produto.preco);
    document.getElementById('visualizar-produto-categoria').textContent = produto.categoriaNome;
    document.getElementById('visualizar-produto-imagem').src = produto.imagem;
    
    // Preencher movimentações
    const movimentacoes = dadosExemplo.movimentacoes ? 
        dadosExemplo.movimentacoes.filter(m => m.produtoId === id) : 
        [];
    
    const tbody = document.getElementById('produto-movimentacao');
    
    if (tbody) {
        tbody.innerHTML = '';
        
        if (movimentacoes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhuma movimentação registrada.</td></tr>';
        } else {
            movimentacoes.forEach(mov => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${window.utils.formatDate(mov.data)}</td>
                    <td>${mov.tipo}</td>
                    <td>${mov.quantidade}</td>
                    <td>${mov.responsavel}</td>
                `;
                tbody.appendChild(row);
            });
        }
    }
    
    // Abrir modal
    const modalVisualizarProduto = document.getElementById('modal-visualizar-produto');
    window.utils.openModal(modalVisualizarProduto);
};

// Função global para editar produto
window.editarProduto = function(id) {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo) return;
    
    // Encontrar produto
    const produto = dadosExemplo.produtos.find(p => p.id === id);
    if (!produto) {
        alert('Produto não encontrado.');
        return;
    }
    
    // Atualizar título do modal
    document.getElementById('modal-produto-title').textContent = 'Editar Produto';
    
    // Preencher formulário
    document.getElementById('produto-nome').value = produto.nome;
    document.getElementById('produto-descricao').value = produto.descricao || '';
    document.getElementById('produto-armazem').value = produto.armazem;
    document.getElementById('produto-quantidade').value = produto.quantidade;
    document.getElementById('produto-preco').value = produto.preco;
    document.getElementById('produto-categoria').value = produto.categoria || '';
    
    // Preencher preview de imagem
    const imagemPreview = document.getElementById('produto-imagem-preview');
    imagemPreview.innerHTML = `<img src="${produto.imagem}" alt="${produto.nome}">`;
    
    // Adicionar ID ao formulário para identificar que é uma edição
    document.getElementById('form-produto').setAttribute('data-id', id);
    
    // Abrir modal
    const modalProduto = document.getElementById('modal-produto');
    window.utils.openModal(modalProduto);
};

// Função global para excluir produto
window.excluirProduto = function(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        // Obter dados do localStorage
        const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
        if (!dadosExemplo) return;
        
        // Encontrar produto
        const produto = dadosExemplo.produtos.find(p => p.id === id);
        if (!produto) {
            alert('Produto não encontrado.');
            return;
        }
        
        // Remover produto
        dadosExemplo.produtos = dadosExemplo.produtos.filter(p => p.id !== id);
        
        // Atualizar estatísticas do armazém
        const armazem = dadosExemplo.armazens.find(a => a.id === produto.armazem);
        if (armazem) {
            armazem.produtos = Math.max(0, (armazem.produtos || 0) - produto.quantidade);
        }
        
        // Salvar dados no localStorage
        window.utils.saveToLocalStorage('dadosExemplo', dadosExemplo);
        
        // Atualizar lista de produtos
        loadProductList();
        
        // Mostrar mensagem de sucesso
        alert('Produto excluído com sucesso!');
    }
};

// Exportar funções
window.productManagement = {
    init: initProductManagement,
    loadProductList,
    loadWarehouseSelect
};
