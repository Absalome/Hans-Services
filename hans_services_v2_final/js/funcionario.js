/**
 * Script específico para o painel do Funcionário
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Carregar componentes iniciais
    const componentsLoaded = await window.components.loadInitialComponents('funcionario');
    
    if (!componentsLoaded) {
        console.error('Erro ao carregar componentes iniciais do funcionário');
        return;
    }
    
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo) {
        console.error('Dados de exemplo não encontrados');
        return;
    }
    
    // Dados específicos do funcionário atual
    const funcionarioAtual = {
        id: '1',
        nome: 'João Silva',
        email: 'joao.silva@func.com',
        cargo: 'Vendedor',
        armazem: 'Armazém Central',
        armazemId: '1',
        dataContratacao: '2025-01-01'
    };
    
    // Salvar dados do funcionário no localStorage
    window.utils.saveToLocalStorage('funcionarioAtual', funcionarioAtual);
    
    // Configurar eventos específicos do funcionário
    setupFuncionarioEvents();
    
    // Atualizar estatísticas do dashboard
    updateFuncionarioDashboardStats();
    
    console.log('Painel do funcionário inicializado com sucesso');
});

// Configurar eventos específicos do funcionário
function setupFuncionarioEvents() {
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
            window.components.loadPageContent(pageName, 'funcionario');
        }
    });
}

// Atualizar estatísticas do dashboard do funcionário
function updateFuncionarioDashboardStats() {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    const funcionarioAtual = window.utils.getFromLocalStorage('funcionarioAtual');
    
    if (!dadosExemplo || !funcionarioAtual) return;
    
    // Filtrar vendas do funcionário atual
    const vendasFuncionario = dadosExemplo.vendas.filter(venda => 
        venda.funcionario === funcionarioAtual.nome
    );
    
    // Filtrar clientes cadastrados pelo funcionário atual
    const clientesFuncionario = dadosExemplo.clientes.filter(cliente => 
        cliente.funcionarioResponsavel === funcionarioAtual.nome
    );
    
    // Calcular estatísticas
    const totalClientes = clientesFuncionario.length;
    
    // Calcular vendas do dia, semana e mês
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    
    const vendasDia = vendasFuncionario.filter(venda => {
        const dataVenda = new Date(venda.data);
        return dataVenda.toDateString() === hoje.toDateString();
    });
    
    const vendasSemana = vendasFuncionario.filter(venda => {
        const dataVenda = new Date(venda.data);
        return dataVenda >= inicioSemana;
    });
    
    const vendasMes = vendasFuncionario.filter(venda => {
        const dataVenda = new Date(venda.data);
        return dataVenda >= inicioMes;
    });
    
    const totalVendasDia = vendasDia.reduce((sum, venda) => sum + venda.total, 0);
    const totalVendasSemana = vendasSemana.reduce((sum, venda) => sum + venda.total, 0);
    const totalVendasMes = vendasMes.reduce((sum, venda) => sum + venda.total, 0);
    
    // Atualizar cards de estatísticas
    const cards = document.querySelectorAll('.card-info h3');
    if (cards.length >= 4) {
        cards[0].textContent = totalClientes;
        cards[1].textContent = window.utils.formatCurrency(totalVendasDia);
        cards[2].textContent = window.utils.formatCurrency(totalVendasSemana);
        cards[3].textContent = window.utils.formatCurrency(totalVendasMes);
    }
    
    // Atualizar atividade recente
    const atividadeRecente = document.getElementById('atividade-recente-funcionario');
    if (atividadeRecente) {
        if (vendasFuncionario.length > 0) {
            let html = '';
            
            // Mostrar últimas 5 vendas
            vendasFuncionario.slice(0, 5).forEach(venda => {
                html += `
                    <div class="atividade-item">
                        <p>Venda para <strong>${venda.cliente}</strong> no valor de ${window.utils.formatCurrency(venda.total)}</p>
                        <span class="atividade-data">${window.utils.formatDate(venda.data)}</span>
                    </div>
                `;
            });
            
            atividadeRecente.innerHTML = html;
        } else {
            atividadeRecente.innerHTML = '<p>Nenhuma atividade recente.</p>';
        }
    }
    
    // Atualizar vendas recentes
    const vendasRecentes = document.getElementById('vendas-recentes');
    if (vendasRecentes) {
        if (vendasFuncionario.length > 0) {
            let html = '';
            
            vendasFuncionario.forEach(venda => {
                html += `
                    <div class="venda-item">
                        <div class="venda-header">
                            <h3>Venda #${venda.id}</h3>
                            <span class="venda-valor">${window.utils.formatCurrency(venda.total)}</span>
                        </div>
                        <p><i class="fas fa-user"></i> Cliente: ${venda.cliente}</p>
                        <p><i class="fas fa-warehouse"></i> Armazém: ${venda.armazem}</p>
                        <span class="venda-data">${window.utils.formatDate(venda.data)}</span>
                        <div class="venda-status ${venda.status.toLowerCase()}">
                            <span>${venda.status}</span>
                        </div>
                    </div>
                `;
            });
            
            vendasRecentes.innerHTML = html;
        } else {
            vendasRecentes.innerHTML = '<p>Nenhuma venda recente.</p>';
        }
    }
}

// Funções globais para ações de clientes
window.visualizarCliente = function(id) {
    alert(`Visualizar cliente ${id}`);
    // Em uma implementação real, abriria um modal com detalhes do cliente
};

window.editarCliente = function(id) {
    alert(`Editar cliente ${id}`);
    // Em uma implementação real, abriria um modal para edição do cliente
};

window.excluirCliente = function(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        alert(`Cliente ${id} excluído com sucesso!`);
        // Em uma implementação real, removeria o cliente do banco de dados
    }
};

// Funções globais para ações de vendas
window.visualizarVenda = function(id) {
    alert(`Visualizar venda ${id}`);
    // Em uma implementação real, abriria um modal com detalhes da venda
};

// Funções globais para ações de entregas
window.visualizarEntrega = function(id) {
    alert(`Visualizar entrega ${id}`);
    // Em uma implementação real, abriria um modal com detalhes da entrega
};

window.atualizarStatusEntrega = function(id, status) {
    alert(`Atualizar status da entrega ${id} para ${status}`);
    // Em uma implementação real, atualizaria o status da entrega no banco de dados
};
