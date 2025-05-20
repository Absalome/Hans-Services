/**
 * Script para validação de interatividade e responsividade
 * Garante que todos os componentes funcionem corretamente em diferentes dispositivos
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar validação
    initValidation();
});

// Função para inicializar validação
function initValidation() {
    // Verificar tipo de dispositivo
    checkDeviceType();
    
    // Verificar funcionalidades críticas
    validateCriticalFeatures();
    
    // Adicionar eventos de redimensionamento
    setupResizeEvents();
    
    console.log('Validação de interatividade e responsividade inicializada');
}

// Verificar tipo de dispositivo
function checkDeviceType() {
    const width = window.innerWidth;
    let deviceType = 'desktop';
    
    if (width < 576) {
        deviceType = 'mobile';
    } else if (width < 992) {
        deviceType = 'tablet';
    }
    
    // Adicionar classe ao body para estilos específicos
    document.body.classList.add(`device-${deviceType}`);
    
    // Ajustar interface para dispositivos móveis
    if (deviceType === 'mobile' || deviceType === 'tablet') {
        enableMobileFeatures();
    }
    
    console.log(`Dispositivo detectado: ${deviceType}`);
    return deviceType;
}

// Habilitar recursos específicos para dispositivos móveis
function enableMobileFeatures() {
    // Verificar se a barra lateral existe
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        // Adicionar botão de menu para dispositivos móveis se não existir
        if (!document.querySelector('.menu-toggle')) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            
            const header = document.querySelector('.header');
            if (header) {
                header.insertBefore(menuToggle, header.firstChild);
                
                // Adicionar evento de clique
                menuToggle.addEventListener('click', function() {
                    sidebar.classList.toggle('active');
                });
            }
        }
        
        // Fechar sidebar ao clicar em um item do menu em dispositivos móveis
        const menuItems = sidebar.querySelectorAll('.sidebar-menu li');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                if (window.innerWidth < 992) {
                    sidebar.classList.remove('active');
                }
            });
        });
    }
}

// Validar funcionalidades críticas
function validateCriticalFeatures() {
    // Verificar se o localStorage está disponível
    if (!window.localStorage) {
        console.error('LocalStorage não está disponível. O sistema pode não funcionar corretamente.');
        showError('Seu navegador não suporta armazenamento local. Algumas funcionalidades podem não funcionar corretamente.');
    }
    
    // Verificar se as funções utilitárias estão disponíveis
    if (!window.utils) {
        console.error('Funções utilitárias não estão disponíveis.');
        showError('Erro ao carregar funções utilitárias. Por favor, recarregue a página.');
    }
    
    // Verificar se o usuário está autenticado
    const currentUser = window.utils && window.utils.getFromLocalStorage('currentUser');
    if (!currentUser) {
        console.warn('Usuário não autenticado. Redirecionando para a página de login.');
        window.location.href = '../login.html';
    }
    
    // Verificar se os dados de exemplo estão disponíveis
    const dadosExemplo = window.utils && window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo) {
        console.warn('Dados de exemplo não encontrados. Criando dados padrão.');
        createDefaultData();
    }
}

// Criar dados padrão
function createDefaultData() {
    // Dados de exemplo para o sistema
    const dadosExemplo = {
        armazens: [
            { id: '1', nome: 'Armazém Central', localizacao: 'Maputo', responsavel: 'João Silva', produtos: 15, vendas: 25000 },
            { id: '2', nome: 'Armazém Norte', localizacao: 'Nampula', responsavel: 'Ana Santos', produtos: 8, vendas: 15000 }
        ],
        funcionarios: [
            { id: '1', nome: 'João Silva', email: 'joao.silva@func.com', cargo: 'Vendedor', armazem: 'Armazém Central', dataContratacao: '2025-01-01', status: 'Ativo' },
            { id: '2', nome: 'Ana Santos', email: 'ana.santos@func.com', cargo: 'Gerente', armazem: 'Armazém Norte', dataContratacao: '2025-01-15', status: 'Ativo' },
            { id: '3', nome: 'Carlos Mendes', email: 'carlos.mendes@func.com', cargo: 'Estoquista', armazem: 'Armazém Central', dataContratacao: '2025-02-01', status: 'Ativo' }
        ],
        clientes: [
            { id: '1', nome: 'Maria Oliveira', email: 'maria.oliveira@gmail.com', telefone: '84123456', funcionarioResponsavel: 'João Silva', dataCadastro: '2025-02-10' },
            { id: '2', nome: 'Pedro Costa', email: 'pedro.costa@gmail.com', telefone: '85654321', funcionarioResponsavel: 'Ana Santos', dataCadastro: '2025-02-15' }
        ],
        produtos: [
            { id: '1', nome: 'Produto A', descricao: 'Descrição do Produto A', armazem: '1', armazemNome: 'Armazém Central', quantidade: 10, preco: 75.00, imagem: '../img/produtos/produto_default.jpg' },
            { id: '2', nome: 'Produto B', descricao: 'Descrição do Produto B', armazem: '1', armazemNome: 'Armazém Central', quantidade: 5, preco: 200.00, imagem: '../img/produtos/produto_default.jpg' },
            { id: '3', nome: 'Produto C', descricao: 'Descrição do Produto C', armazem: '2', armazemNome: 'Armazém Norte', quantidade: 8, preco: 150.00, imagem: '../img/produtos/produto_default.jpg' }
        ],
        vendas: [
            { id: '1', cliente: 'Maria Oliveira', funcionario: 'João Silva', armazem: 'Armazém Central', data: '2025-05-15', total: 350.00, status: 'Concluída' },
            { id: '2', cliente: 'Pedro Costa', funcionario: 'Ana Santos', armazem: 'Armazém Norte', data: '2025-05-16', total: 150.00, status: 'Concluída' }
        ]
    };
    
    // Salvar dados no localStorage
    window.utils.saveToLocalStorage('dadosExemplo', dadosExemplo);
    
    console.log('Dados padrão criados com sucesso.');
}

// Configurar eventos de redimensionamento
function setupResizeEvents() {
    // Adicionar evento de redimensionamento da janela
    window.addEventListener('resize', function() {
        // Verificar tipo de dispositivo
        checkDeviceType();
        
        // Ajustar layout conforme necessário
        adjustLayout();
    });
}

// Ajustar layout conforme tamanho da tela
function adjustLayout() {
    const width = window.innerWidth;
    
    // Ajustar tabelas para dispositivos móveis
    if (width < 768) {
        document.querySelectorAll('.table-container').forEach(table => {
            table.classList.add('table-responsive');
        });
    } else {
        document.querySelectorAll('.table-container').forEach(table => {
            table.classList.remove('table-responsive');
        });
    }
    
    // Ajustar cards para dispositivos móveis
    if (width < 576) {
        document.querySelectorAll('.cards-container').forEach(container => {
            container.style.gridTemplateColumns = '1fr';
        });
    } else {
        document.querySelectorAll('.cards-container').forEach(container => {
            container.style.gridTemplateColumns = '';
        });
    }
}

// Mostrar mensagem de erro
function showError(message) {
    // Verificar se já existe um elemento de erro
    let errorElement = document.getElementById('system-error');
    
    if (!errorElement) {
        // Criar elemento de erro
        errorElement = document.createElement('div');
        errorElement.id = 'system-error';
        errorElement.className = 'system-error';
        errorElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #f44336;
            color: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            max-width: 300px;
        `;
        
        // Adicionar botão de fechar
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '&times;';
        closeButton.style.cssText = `
            float: right;
            font-weight: bold;
            cursor: pointer;
            margin-left: 10px;
        `;
        closeButton.addEventListener('click', function() {
            document.body.removeChild(errorElement);
        });
        
        errorElement.appendChild(closeButton);
        
        // Adicionar ao corpo do documento
        document.body.appendChild(errorElement);
    }
    
    // Adicionar mensagem
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.style.margin = '5px 0';
    
    // Limpar mensagens anteriores
    const closeButton = errorElement.querySelector('span');
    errorElement.innerHTML = '';
    errorElement.appendChild(closeButton);
    errorElement.appendChild(messageElement);
    
    // Remover após 5 segundos
    setTimeout(function() {
        if (document.body.contains(errorElement)) {
            document.body.removeChild(errorElement);
        }
    }, 5000);
}

// Exportar funções
window.validation = {
    init: initValidation,
    checkDeviceType,
    validateCriticalFeatures,
    adjustLayout
};
