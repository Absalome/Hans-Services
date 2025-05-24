/**
 * Script específico para o painel do Cliente
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Carregar componentes iniciais
    const componentsLoaded = await window.components.loadInitialComponents('cliente');
    
    if (!componentsLoaded) {
        console.error('Erro ao carregar componentes iniciais do cliente');
        return;
    }
    
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo) {
        console.error('Dados de exemplo não encontrados');
        return;
    }
    
    // Dados específicos do cliente atual
    const clienteAtual = {
        id: '1',
        nome: 'Maria Oliveira',
        email: 'maria.oliveira@gmail.com',
        telefone: '84123456',
        endereco: 'Av. Principal, 123, Maputo',
        funcionarioResponsavel: 'João Silva',
        dataCadastro: '2025-02-10'
    };
    
    // Salvar dados do cliente no localStorage
    window.utils.saveToLocalStorage('clienteAtual', clienteAtual);
    
    // Configurar eventos específicos do cliente
    setupClienteEvents();
    
    // Atualizar estatísticas do dashboard
    updateClienteDashboardStats();
    
    console.log('Painel do cliente inicializado com sucesso');
});

// Configurar eventos específicos do cliente
function setupClienteEvents() {
    // Eventos para modais e formulários serão configurados quando cada página for carregada
    
    // Adicionar evento para o botão de menu em dispositivos móveis
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('active');
        });
    }
    
    // Configurar eventos de navegação por hash
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        const pageName = hash || 'dashboard';
        
        const menuItems = document.querySelectorAll('.sidebar-menu li');
        const pageExists = Array.from(menuItems).some(item => item.getAttribute('data-page') === pageName);
        
        if (pageExists) {
            window.components.loadPageContent(pageName, 'cliente');
        }
    });
}

// Atualizar estatísticas do dashboard do cliente
function updateClienteDashboardStats() {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    const clienteAtual = window.utils.getFromLocalStorage('clienteAtual');
    
    if (!dadosExemplo || !clienteAtual) return;
    
    // Filtrar compras do cliente atual
    const comprasCliente = dadosExemplo.vendas.filter(venda => 
        venda.cliente === clienteAtual.nome
    );
    
    // Calcular estatísticas
    const totalCompras = comprasCliente.length;
    const totalGasto = comprasCliente.reduce((sum, compra) => sum + compra.total, 0);
    
    // Calcular total de produtos adquiridos (simulado)
    const totalProdutos = totalCompras * 2; // Média de 2 produtos por compra
    
    // Obter data da última compra
    const ultimaCompra = comprasCliente.length > 0 ? 
        window.utils.formatDate(comprasCliente[0].data) : 
        '--/--/----';
    
    // Atualizar cards de estatísticas
    const cards = document.querySelectorAll('.card-info h3');
    if (cards.length >= 4) {
        cards[0].textContent = totalCompras;
        cards[1].textContent = totalProdutos;
        cards[2].textContent = window.utils.formatCurrency(totalGasto);
        cards[3].textContent = ultimaCompra;
    }
    
    // Atualizar produtos recomendados
    const produtosRecomendados = document.getElementById('produtos-recomendados');
    if (produtosRecomendados) {
        if (dadosExemplo.produtos.length > 0) {
            let html = '<div class="produtos-grid">';
            
            // Mostrar até 4 produtos recomendados
            dadosExemplo.produtos.slice(0, 4).forEach(produto => {
                html += `
                    <div class="produto-card">
                        <div class="produto-imagem">
                            <img src="${produto.imagem}" alt="${produto.nome}">
                        </div>
                        <div class="produto-info">
                            <h3>${produto.nome}</h3>
                            <p>${produto.descricao}</p>
                            <div class="produto-preco">${window.utils.formatCurrency(produto.preco)}</div>
                            <div class="produto-actions">
                                <button class="btn btn-sm btn-primary" onclick="irParaCompras()">
                                    <i class="fas fa-shopping-cart"></i> Comprar
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            produtosRecomendados.innerHTML = html;
        } else {
            produtosRecomendados.innerHTML = '<p>Nenhum produto recomendado no momento.</p>';
        }
    }
    
    // Atualizar compras recentes
    const comprasRecentes = document.getElementById('compras-recentes');
    if (comprasRecentes) {
        if (comprasCliente.length > 0) {
            let html = '';
            
            comprasCliente.slice(0, 3).forEach(compra => {
                html += `
                    <div class="compra-item">
                        <div class="compra-header">
                            <h3>Compra #${compra.id}</h3>
                            <span class="compra-valor">${window.utils.formatCurrency(compra.total)}</span>
                        </div>
                        <p><i class="fas fa-warehouse"></i> Armazém: ${compra.armazem}</p>
                        <span class="compra-data">${window.utils.formatDate(compra.data)}</span>
                        <button class="btn btn-sm btn-primary" onclick="visualizarCompra('${compra.id}')">
                            <i class="fas fa-eye"></i> Detalhes
                        </button>
                    </div>
                `;
            });
            
            comprasRecentes.innerHTML = html;
        } else {
            comprasRecentes.innerHTML = '<p>Nenhuma compra recente.</p>';
        }
    }
}

// Funções globais para ações de compras
window.irParaCompras = function() {
    // Navegar para a página de compras
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('page-title');
    
    window.components.loadPageContent('compras', 'cliente');
};

window.visualizarCompra = function(id) {
    alert(`Visualizar compra ${id}`);
    // Em uma implementação real, abriria um modal com detalhes da compra
};

// Funções para o carrinho de compras
window.adicionarAoCarrinho = function(produtoId, produtoNome, produtoPreco) {
    alert(`Produto ${produtoNome} adicionado ao carrinho!`);
    // Em uma implementação real, adicionaria o produto ao carrinho no localStorage
};

window.finalizarCompra = function() {
    alert('Compra finalizada com sucesso!');
    // Em uma implementação real, processaria a compra e atualizaria o banco de dados
};
