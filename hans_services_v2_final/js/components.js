/**
 * Componentes compartilhados para o sistema Hans Services
 * Funções para carregamento e gestão de componentes
 */

// Carregar componentes iniciais
async function loadInitialComponents(userType) {
    try {
        // Carregar barra lateral
        await window.utils.loadComponent('sidebar-container', `components/sidebar.html`);
        
        // Carregar cabeçalho
        await window.utils.loadComponent('header-container', `components/header.html`);
        
        // Carregar página inicial (dashboard)
        await window.utils.loadComponent('page-content', `components/dashboard.html`);
        
        // Configurar eventos após carregamento dos componentes
        setupComponentEvents(userType);
        
        return true;
    } catch (error) {
        console.error('Erro ao carregar componentes iniciais:', error);
        return false;
    }
}

// Configurar eventos dos componentes
function setupComponentEvents(userType) {
    // Obter elementos do DOM
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('page-title');
    const logoutBtn = document.getElementById('logout');
    const logoutDropdown = document.getElementById('logout-dropdown');
    
    // Configurar navegação do menu
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageName = item.getAttribute('data-page');
            loadPageContent(pageName, userType);
        });
    });
    
    // Configurar logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', window.utils.logout);
    }
    
    if (logoutDropdown) {
        logoutDropdown.addEventListener('click', window.utils.logout);
    }
    
    // Restaurar estado da navegação a partir da URL
    restoreNavigationState(menuItems, pages, pageTitle, userType);
}

// Carregar conteúdo da página
async function loadPageContent(pageName, userType) {
    try {
        // Carregar componente da página
        await window.utils.loadComponent('page-content', `components/${pageName}.html`);
        
        // Atualizar navegação
        const menuItems = document.querySelectorAll('.sidebar-menu li');
        const pages = document.querySelectorAll('.page');
        const pageTitle = document.getElementById('page-title');
        
        window.utils.navigateTo(pageName, menuItems, pages, pageTitle);
        
        // Configurar eventos específicos da página
        setupPageEvents(pageName, userType);
        
        return true;
    } catch (error) {
        console.error(`Erro ao carregar página ${pageName}:`, error);
        return false;
    }
}

// Configurar eventos específicos de cada página
function setupPageEvents(pageName, userType) {
    // Eventos comuns a todas as páginas
    setupModalEvents();
    
    // Eventos específicos por página
    switch (pageName) {
        case 'dashboard':
            // Configurar eventos do dashboard
            break;
        case 'armazens':
            // Configurar eventos de armazéns
            break;
        case 'funcionarios':
            // Configurar eventos de funcionários
            break;
        case 'clientes':
            // Configurar eventos de clientes
            break;
        case 'stock':
            // Configurar eventos de stock
            setupStockEvents(userType);
            break;
        case 'vendas':
            // Configurar eventos de vendas
            break;
        case 'compras':
            // Configurar eventos de compras
            setupComprasEvents();
            break;
        case 'perfil':
            // Configurar eventos de perfil
            setupPerfilEvents(userType);
            break;
        default:
            // Nenhum evento específico
            break;
    }
}

// Configurar eventos de modais
function setupModalEvents() {
    // Fechar modais ao clicar no X
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', event => {
            const modal = event.target.closest('.modal');
            window.utils.closeModal(modal);
        });
    });
    
    // Fechar modais ao clicar fora
    window.addEventListener('click', event => {
        if (event.target.classList.contains('modal')) {
            window.utils.closeModal(event.target);
        }
    });
}

// Configurar eventos específicos de stock
function setupStockEvents(userType) {
    // Verificar se é administrador
    if (userType === 'admin') {
        // Botão de adicionar produto
        const btnAdicionarProduto = document.getElementById('btn-adicionar-produto');
        if (btnAdicionarProduto) {
            btnAdicionarProduto.addEventListener('click', () => {
                const modalProduto = document.getElementById('modal-produto');
                if (modalProduto) {
                    // Resetar formulário
                    document.getElementById('form-produto').reset();
                    
                    // Configurar preview de imagem
                    window.utils.setupImagePreview('produto-imagem-input', 'produto-imagem-preview');
                    
                    // Abrir modal
                    window.utils.openModal(modalProduto);
                }
            });
        }
    }
}

// Configurar eventos específicos de compras
function setupComprasEvents() {
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

// Configurar eventos específicos de perfil
function setupPerfilEvents(userType) {
    // Formulário de alteração de senha
    const formAlterarSenha = document.getElementById(`form-alterar-senha-${userType}`);
    if (formAlterarSenha) {
        formAlterarSenha.addEventListener('submit', event => {
            event.preventDefault();
            
            const senhaAtual = document.getElementById(`senha-atual-${userType}`).value;
            const novaSenha = document.getElementById(`nova-senha-${userType}`).value;
            const confirmarSenha = document.getElementById(`confirmar-senha-${userType}`).value;
            
            if (!senhaAtual || !novaSenha || !confirmarSenha) {
                alert('Por favor, preencha todos os campos.');
                return;
            }
            
            if (novaSenha !== confirmarSenha) {
                alert('A nova senha e a confirmação não coincidem.');
                return;
            }
            
            // Simulação de alteração de senha
            alert('Senha alterada com sucesso!');
            formAlterarSenha.reset();
        });
    }
}

// Restaurar estado da navegação a partir da URL
function restoreNavigationState(menuItems, pages, pageTitle, userType) {
    // Obter página da URL
    const hash = window.location.hash.substring(1);
    const pageName = hash || 'dashboard';
    
    // Verificar se a página existe
    const pageExists = Array.from(menuItems).some(item => item.getAttribute('data-page') === pageName);
    
    if (pageExists) {
        // Carregar página
        loadPageContent(pageName, userType);
    } else {
        // Carregar dashboard por padrão
        loadPageContent('dashboard', userType);
    }
}

// Exportar funções
window.components = {
    loadInitialComponents,
    loadPageContent,
    setupComponentEvents
};
