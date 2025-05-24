/**
 * Script para inicialização e integração de todos os módulos do sistema
 * Garante que todos os eventos sejam registrados após carregamento dinâmico
 */

// Função para inicializar todos os módulos
function initAllModules() {
    console.log('Inicializando todos os módulos do sistema...');
    
    // Obter tipo de usuário atual
    const currentUser = window.utils.getFromLocalStorage('currentUser');
    if (!currentUser) {
        console.error('Usuário não autenticado. Redirecionando para login...');
        window.location.href = '../login.html';
        return;
    }
    
    // Inicializar módulos específicos para cada tipo de usuário
    switch (currentUser.type) {
        case 'admin':
            initAdminModules();
            break;
        case 'funcionario':
            initFuncionarioModules();
            break;
        case 'cliente':
            initClienteModules();
            break;
        default:
            console.error('Tipo de usuário desconhecido:', currentUser.type);
    }
    
    // Inicializar módulos comuns
    initCommonModules();
    
    console.log('Todos os módulos inicializados com sucesso!');
}

// Inicializar módulos do administrador
function initAdminModules() {
    console.log('Inicializando módulos do administrador...');
    
    // Carregar componentes iniciais
    window.components.loadInitialComponents('admin').then(() => {
        // Inicializar gestão de produtos
        if (window.productManagement && typeof window.productManagement.init === 'function') {
            window.productManagement.init();
        }
        
        // Inicializar sincronização de produtos
        if (window.productSync && typeof window.productSync.init === 'function') {
            window.productSync.init();
        }
        
        // Configurar eventos específicos do administrador
        setupAdminEvents();
    });
}

// Inicializar módulos do funcionário
function initFuncionarioModules() {
    console.log('Inicializando módulos do funcionário...');
    
    // Carregar componentes iniciais
    window.components.loadInitialComponents('funcionario').then(() => {
        // Inicializar sincronização de produtos
        if (window.productSync && typeof window.productSync.init === 'function') {
            window.productSync.init();
        }
        
        // Inicializar gestão de entregas
        if (window.entregasManagement && typeof window.entregasManagement.init === 'function') {
            window.entregasManagement.init();
        }
        
        // Configurar eventos específicos do funcionário
        setupFuncionarioEvents();
    });
}

// Inicializar módulos do cliente
function initClienteModules() {
    console.log('Inicializando módulos do cliente...');
    
    // Carregar componentes iniciais
    window.components.loadInitialComponents('cliente').then(() => {
        // Inicializar sincronização de produtos
        if (window.productSync && typeof window.productSync.init === 'function') {
            window.productSync.init();
        }
        
        // Configurar eventos específicos do cliente
        setupClienteEvents();
    });
}

// Inicializar módulos comuns a todos os usuários
function initCommonModules() {
    console.log('Inicializando módulos comuns...');
    
    // Inicializar validação
    if (window.validation && typeof window.validation.init === 'function') {
        window.validation.init();
    }
    
    // Configurar eventos de navegação
    setupNavigationEvents();
}

// Configurar eventos específicos do administrador
function setupAdminEvents() {
    console.log('Configurando eventos do administrador...');
    
    document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'btn-adicionar-armazem') {
        openModalAdicionarArmazem(); // Chama o modal novo
    }
});
    
    // Botão de adicionar funcionário
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'btn-adicionar-funcionario') {
            openModalAdicionarFuncionario();
        }
    });
    
    // Botão de adicionar produto
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'btn-adicionar-produto') {
            const modalProduto = document.getElementById('modal-produto');
            if (modalProduto) {
                // Resetar formulário
                document.getElementById('form-produto').reset();
                
                // Configurar preview de imagem
                window.utils.setupImagePreview('produto-imagem-input', 'produto-imagem-preview');
                
                // Abrir modal
                window.utils.openModal(modalProduto);
            } else {
                alert('Modal de produto não encontrado. Carregando componente...');
                
                // Carregar modal de produto
                fetch('components/modals/produto.html')
                    .then(response => response.text())
                    .then(html => {
                        // Criar container para modais se não existir
                        if (!document.getElementById('modals-container')) {
                            const modalsContainer = document.createElement('div');
                            modalsContainer.id = 'modals-container';
                            document.body.appendChild(modalsContainer);
                        }
                        
                        // Adicionar modal ao container
                        document.getElementById('modals-container').innerHTML = html;
                        
                        // Configurar eventos do modal
                        const btnCancelarProduto = document.getElementById('btn-cancelar-produto');
                        const btnSalvarProduto = document.getElementById('btn-salvar-produto');
                        const closeButtons = document.querySelectorAll('.modal .close');
                        
                        if (btnCancelarProduto) {
                            btnCancelarProduto.addEventListener('click', () => {
                                window.utils.closeModal(document.getElementById('modal-produto'));
                            });
                        }
                        
                        if (btnSalvarProduto) {
                            btnSalvarProduto.addEventListener('click', window.saveProduct || function() {
                                alert('Produto salvo com sucesso!');
                                window.utils.closeModal(document.getElementById('modal-produto'));
                            });
                        }
                        
                        closeButtons.forEach(button => {
                            button.addEventListener('click', () => {
                                const modal = button.closest('.modal');
                                window.utils.closeModal(modal);
                            });
                        });
                        
                        // Configurar preview de imagem
                        window.utils.setupImagePreview('produto-imagem-input', 'produto-imagem-preview');
                        
                        // Abrir modal
                        window.utils.openModal(document.getElementById('modal-produto'));
                    })
                    .catch(error => {
                        console.error('Erro ao carregar modal de produto:', error);
                        alert('Erro ao carregar modal de produto. Por favor, tente novamente.');
                    });
            }
        }
    });
}

// Configurar eventos específicos do funcionário
function setupFuncionarioEvents() {
    console.log('Configurando eventos do funcionário...');
    
    // Botão de adicionar cliente
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'btn-adicionar-cliente') {
            alert('Funcionalidade de adicionar cliente será implementada aqui.');
            // Implementar lógica de adicionar cliente
        }
    });
    
    // Botão de adicionar venda
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'btn-adicionar-venda') {
            alert('Funcionalidade de adicionar venda será implementada aqui.');
            // Implementar lógica de adicionar venda
        }
    });
    
    // Botão de adicionar entrega
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'btn-nova-entrega') {
            const modalEntrega = document.getElementById('modal-entrega');
            if (modalEntrega) {
                // Resetar formulário
                document.getElementById('form-entrega').reset();
                
                // Definir data mínima como hoje
                const hoje = new Date().toISOString().split('T')[0];
                document.getElementById('entrega-data').min = hoje;
                
                // Abrir modal
                window.utils.openModal(modalEntrega);
            } else {
                alert('Modal de entrega não encontrado.');
            }
        }
    });
}

// Configurar eventos específicos do cliente
function setupClienteEvents() {
    console.log('Configurando eventos do cliente...');
    
    // Botão de finalizar compra
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'btn-finalizar-compra') {
            alert('Funcionalidade de finalizar compra será implementada aqui.');
            // Implementar lógica de finalizar compra
        }
    });
    
    // Botão de limpar carrinho
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'btn-limpar-carrinho') {
            // Limpar carrinho
            window.utils.saveToLocalStorage('carrinho', []);
            
            // Atualizar interface do carrinho
            if (window.productSync && typeof window.productSync.updateCartInterface === 'function') {
                window.productSync.updateCartInterface();
            } else {
                const carrinhoCompra = document.getElementById('carrinho-compra');
                const compraTotal = document.getElementById('compra-total');
                
                if (carrinhoCompra) {
                    carrinhoCompra.innerHTML = '<p class="text-center">Seu carrinho está vazio.</p>';
                }
                
                if (compraTotal) {
                    compraTotal.textContent = '0 MZN';
                }
            }
            
            alert('Carrinho limpo com sucesso!');
        }
    });
}

// Configurar eventos de navegação
function setupNavigationEvents() {
    console.log('Configurando eventos de navegação...');
    
    // Adicionar evento para o botão de menu em dispositivos móveis
    document.addEventListener('click', function(event) {
        if (event.target && (event.target.classList.contains('menu-toggle') || event.target.closest('.menu-toggle'))) {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.toggle('active');
            }
        }
    });
    
    // Adicionar evento para itens do menu
    document.addEventListener('click', function(event) {
        const menuItem = event.target.closest('.sidebar-menu li');
        if (menuItem) {
            const pageName = menuItem.getAttribute('data-page');
            if (pageName) {
                // Obter tipo de usuário atual
                const currentUser = window.utils.getFromLocalStorage('currentUser');
                if (currentUser) {
                    window.components.loadPageContent(pageName, currentUser.type);
                }
            }
        }
    });
    
    // Adicionar evento para logout
    document.addEventListener('click', function(event) {
        if (event.target && (event.target.id === 'logout' || event.target.id === 'logout-dropdown' || event.target.closest('#logout-dropdown'))) {
            window.utils.logout();
        }
    });
}

// Inicializar todos os módulos quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', initAllModules);

// Exportar funções
window.systemInit = {
    initAllModules,
    initAdminModules,
    initFuncionarioModules,
    initClienteModules,
    initCommonModules,
    setupAdminEvents,
    setupFuncionarioEvents,
    setupClienteEvents,
    setupNavigationEvents
};
