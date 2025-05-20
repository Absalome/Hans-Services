/**
 * Script específico para o painel do Administrador
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Carregar componentes iniciais
    const componentsLoaded = await window.components.loadInitialComponents('admin');
    
    if (!componentsLoaded) {
        console.error('Erro ao carregar componentes iniciais do administrador');
        return;
    }
    
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
    
    // Salvar dados no localStorage para uso em todas as páginas
    window.utils.saveToLocalStorage('dadosExemplo', dadosExemplo);
    
    // Configurar eventos específicos do administrador
    setupAdminEvents();
    
    // Atualizar estatísticas do dashboard
    updateDashboardStats();
    
    console.log('Painel do administrador inicializado com sucesso');
});

// Configurar eventos específicos do administrador
function setupAdminEvents() {
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
            window.components.loadPageContent(pageName, 'admin');
        }
    });
}

// Atualizar estatísticas do dashboard
function updateDashboardStats() {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo) return;
    
    // Atualizar cards de estatísticas
    const cards = document.querySelectorAll('.card-info h3');
    if (cards.length >= 4) {
        cards[0].textContent = dadosExemplo.armazens.length;
        cards[1].textContent = dadosExemplo.funcionarios.length;
        cards[2].textContent = dadosExemplo.clientes.length;
        
        // Calcular total de vendas
        const totalVendas = dadosExemplo.vendas.reduce((sum, venda) => sum + venda.total, 0);
        cards[3].textContent = window.utils.formatCurrency(totalVendas);
    }
    
    // Atualizar atividade recente
    const atividadeRecente = document.getElementById('atividade-recente');
    if (atividadeRecente) {
        if (dadosExemplo.vendas.length > 0) {
            let html = '';
            
            // Mostrar últimas 5 vendas
            dadosExemplo.vendas.slice(0, 5).forEach(venda => {
                html += `
                    <div class="atividade-item">
                        <p><strong>${venda.funcionario}</strong> realizou uma venda para <strong>${venda.cliente}</strong> no valor de ${window.utils.formatCurrency(venda.total)}</p>
                        <span class="atividade-data">${window.utils.formatDate(venda.data)}</span>
                    </div>
                `;
            });
            
            atividadeRecente.innerHTML = html;
        } else {
            atividadeRecente.innerHTML = '<p>Nenhuma atividade recente.</p>';
        }
    }
    
    // Atualizar armazéns
    const meusArmazens = document.getElementById('meus-armazens');
    if (meusArmazens) {
        if (dadosExemplo.armazens.length > 0) {
            let html = '<div class="armazens-grid">';
            
            dadosExemplo.armazens.forEach(armazem => {
                html += `
                    <div class="armazem-card">
                        <h3>${armazem.nome}</h3>
                        <p><i class="fas fa-map-marker-alt"></i> ${armazem.localizacao}</p>
                        <p><i class="fas fa-user"></i> ${armazem.responsavel}</p>
                        <p><i class="fas fa-box"></i> ${armazem.produtos} produtos</p>
                        <p><i class="fas fa-money-bill-wave"></i> ${window.utils.formatCurrency(armazem.vendas)} em vendas</p>
                        <div class="armazem-actions">
                            <button class="btn btn-sm btn-primary" onclick="visualizarArmazem('${armazem.id}')">
                                <i class="fas fa-eye"></i> Visualizar
                            </button>
                            <button class="btn btn-sm btn-warning" onclick="editarArmazem('${armazem.id}')">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            meusArmazens.innerHTML = html;
        } else {
            meusArmazens.innerHTML = '<p>Nenhum armazém cadastrado.</p>';
        }
    }
}

// Funções globais para ações de armazéns
window.visualizarArmazem = function(id) {
    alert(`Visualizar armazém ${id}`);
    // Em uma implementação real, abriria um modal com detalhes do armazém
};

window.editarArmazem = function(id) {
    alert(`Editar armazém ${id}`);
    // Em uma implementação real, abriria um modal para edição do armazém
};

// Funções globais para ações de funcionários
window.visualizarFuncionario = function(id) {
    alert(`Visualizar funcionário ${id}`);
    // Em uma implementação real, abriria um modal com detalhes do funcionário
};

window.editarFuncionario = function(id) {
    alert(`Editar funcionário ${id}`);
    // Em uma implementação real, abriria um modal para edição do funcionário
};

window.excluirFuncionario = function(id) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        alert(`Funcionário ${id} excluído com sucesso!`);
        // Em uma implementação real, removeria o funcionário do banco de dados
    }
};

// Funções globais para ações de clientes
window.visualizarCliente = function(id) {
    alert(`Visualizar cliente ${id}`);
    // Em uma implementação real, abriria um modal com detalhes do cliente
};

// Funções globais para ações de produtos
window.visualizarProduto = function(id) {
    alert(`Visualizar produto ${id}`);
    // Em uma implementação real, abriria um modal com detalhes do produto
};

window.editarProduto = function(id) {
    alert(`Editar produto ${id}`);
    // Em uma implementação real, abriria um modal para edição do produto
};

window.excluirProduto = function(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        alert(`Produto ${id} excluído com sucesso!`);
        // Em uma implementação real, removeria o produto do banco de dados
    }
};
