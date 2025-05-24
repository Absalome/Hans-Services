/**
 * Script para gestão de entregas no painel do funcionário
 * Implementa funcionalidades avançadas para o funcionário
 */

// Função para inicializar a gestão de entregas
function initEntregasManagement() {
    // Carregar dados de entregas
    loadEntregasData();
    
    // Configurar eventos
    setupEntregasEvents();
    
    console.log('Gestão de entregas inicializada com sucesso');
}

// Carregar dados de entregas
function loadEntregasData() {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo) return;
    
    // Verificar se já existem entregas
    if (!dadosExemplo.entregas) {
        // Criar entregas de exemplo
        dadosExemplo.entregas = [
            {
                id: '1',
                vendaId: '1',
                cliente: 'Maria Oliveira',
                endereco: 'Av. Principal, 123, Maputo',
                data: '2025-05-20',
                status: 'pendente',
                observacoes: 'Entregar no período da manhã',
                historico: [
                    {
                        data: '2025-05-15',
                        status: 'pendente',
                        comentario: 'Entrega registrada',
                        responsavel: 'João Silva'
                    }
                ]
            },
            {
                id: '2',
                vendaId: '2',
                cliente: 'Pedro Costa',
                endereco: 'Rua Secundária, 456, Nampula',
                data: '2025-05-18',
                status: 'em-transito',
                observacoes: 'Ligar antes de entregar',
                historico: [
                    {
                        data: '2025-05-16',
                        status: 'pendente',
                        comentario: 'Entrega registrada',
                        responsavel: 'Ana Santos'
                    },
                    {
                        data: '2025-05-17',
                        status: 'em-transito',
                        comentario: 'Saiu para entrega',
                        responsavel: 'Carlos Mendes'
                    }
                ]
            }
        ];
        
        // Salvar dados no localStorage
        window.utils.saveToLocalStorage('dadosExemplo', dadosExemplo);
    }
    
    // Atualizar tabela de entregas
    updateEntregasTable();
    
    // Preencher select de vendas
    fillVendasSelect();
}

// Atualizar tabela de entregas
function updateEntregasTable() {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.entregas) return;
    
    // Obter filtro de status
    const filtroStatus = document.getElementById('filtro-status-entrega');
    const statusFiltrado = filtroStatus ? filtroStatus.value : '';
    
    // Filtrar entregas pelo status
    let entregasFiltradas = dadosExemplo.entregas;
    if (statusFiltrado) {
        entregasFiltradas = entregasFiltradas.filter(entrega => entrega.status === statusFiltrado);
    }
    
    // Obter tabela de entregas
    const tbody = document.getElementById('entregas-table-body');
    if (!tbody) return;
    
    // Limpar tabela
    tbody.innerHTML = '';
    
    // Verificar se há entregas
    if (entregasFiltradas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhuma entrega encontrada.</td></tr>';
        return;
    }
    
    // Adicionar entregas à tabela
    entregasFiltradas.forEach(entrega => {
        // Determinar classe de status
        let statusClass = '';
        switch (entrega.status) {
            case 'pendente':
                statusClass = 'text-warning';
                break;
            case 'em-transito':
                statusClass = 'text-primary';
                break;
            case 'entregue':
                statusClass = 'text-success';
                break;
            case 'cancelada':
                statusClass = 'text-danger';
                break;
        }
        
        // Formatar status para exibição
        let statusText = entrega.status.replace('-', ' ');
        statusText = statusText.charAt(0).toUpperCase() + statusText.slice(1);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entrega.id}</td>
            <td>${entrega.cliente}</td>
            <td>${entrega.endereco}</td>
            <td>${window.utils.formatDate(entrega.data)}</td>
            <td class="${statusClass}">${statusText}</td>
            <td class="table-actions">
                <button class="view" onclick="visualizarEntrega('${entrega.id}')"><i class="fas fa-eye"></i></button>
                <button class="edit" onclick="atualizarStatusEntrega('${entrega.id}')"><i class="fas fa-edit"></i></button>
                <button class="delete" onclick="excluirEntrega('${entrega.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Preencher select de vendas
function fillVendasSelect() {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.vendas) return;
    
    // Obter select de vendas
    const select = document.getElementById('entrega-venda');
    if (!select) return;
    
    // Limpar select
    select.innerHTML = '<option value="">Selecione uma venda</option>';
    
    // Filtrar vendas sem entrega
    const vendasSemEntrega = dadosExemplo.vendas.filter(venda => {
        return !dadosExemplo.entregas.some(entrega => entrega.vendaId === venda.id);
    });
    
    // Adicionar vendas ao select
    vendasSemEntrega.forEach(venda => {
        const option = document.createElement('option');
        option.value = venda.id;
        option.textContent = `Venda #${venda.id} - ${venda.cliente} (${window.utils.formatCurrency(venda.total)})`;
        option.setAttribute('data-cliente', venda.cliente);
        select.appendChild(option);
    });
    
    // Adicionar evento de mudança
    select.addEventListener('change', function() {
        const clienteInput = document.getElementById('entrega-cliente');
        if (clienteInput) {
            const selectedOption = this.options[this.selectedIndex];
            clienteInput.value = selectedOption.getAttribute('data-cliente') || '';
        }
    });
}

// Configurar eventos
function setupEntregasEvents() {
    // Botão de nova entrega
    const btnNovaEntrega = document.getElementById('btn-nova-entrega');
    if (btnNovaEntrega) {
        btnNovaEntrega.addEventListener('click', () => {
            // Resetar formulário
            document.getElementById('form-entrega').reset();
            
            // Atualizar título do modal
            document.getElementById('modal-entrega-title').textContent = 'Nova Entrega';
            
            // Remover ID do formulário
            document.getElementById('form-entrega').removeAttribute('data-id');
            
            // Definir data mínima como hoje
            const hoje = new Date().toISOString().split('T')[0];
            document.getElementById('entrega-data').min = hoje;
            
            // Abrir modal
            const modalEntrega = document.getElementById('modal-entrega');
            window.utils.openModal(modalEntrega);
        });
    }
    
    // Filtro de status
    const filtroStatus = document.getElementById('filtro-status-entrega');
    if (filtroStatus) {
        filtroStatus.addEventListener('change', updateEntregasTable);
    }
    
    // Botões do modal de entrega
    const btnCancelarEntrega = document.getElementById('btn-cancelar-entrega');
    const btnSalvarEntrega = document.getElementById('btn-salvar-entrega');
    
    if (btnCancelarEntrega) {
        btnCancelarEntrega.addEventListener('click', () => {
            const modalEntrega = document.getElementById('modal-entrega');
            window.utils.closeModal(modalEntrega);
        });
    }
    
    if (btnSalvarEntrega) {
        btnSalvarEntrega.addEventListener('click', saveEntrega);
    }
    
    // Botões do modal de status
    const btnCancelarStatus = document.getElementById('btn-cancelar-status');
    const btnSalvarStatus = document.getElementById('btn-salvar-status');
    
    if (btnCancelarStatus) {
        btnCancelarStatus.addEventListener('click', () => {
            const modalStatusEntrega = document.getElementById('modal-status-entrega');
            window.utils.closeModal(modalStatusEntrega);
        });
    }
    
    if (btnSalvarStatus) {
        btnSalvarStatus.addEventListener('click', saveEntregaStatus);
    }
    
    // Fechar modais
    document.querySelectorAll('.modal .close').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
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

// Salvar entrega
function saveEntrega() {
    // Obter dados do formulário
    const vendaId = document.getElementById('entrega-venda').value;
    const cliente = document.getElementById('entrega-cliente').value;
    const endereco = document.getElementById('entrega-endereco').value;
    const data = document.getElementById('entrega-data').value;
    const observacoes = document.getElementById('entrega-observacoes').value;
    
    // Validar campos obrigatórios
    if (!vendaId || !cliente || !endereco || !data) {
        alert('Por favor, preencha os campos obrigatórios.');
        return;
    }
    
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo) return;
    
    // Verificar se é edição ou adição
    const formEntrega = document.getElementById('form-entrega');
    const entregaId = formEntrega.getAttribute('data-id');
    
    // Obter funcionário atual
    const funcionarioAtual = window.utils.getFromLocalStorage('funcionarioAtual');
    const responsavel = funcionarioAtual ? funcionarioAtual.nome : 'Funcionário';
    
    if (entregaId) {
        // Edição de entrega existente
        const index = dadosExemplo.entregas.findIndex(e => e.id === entregaId);
        
        if (index !== -1) {
            // Atualizar entrega
            dadosExemplo.entregas[index] = {
                ...dadosExemplo.entregas[index],
                vendaId,
                cliente,
                endereco,
                data,
                observacoes
            };
            
            // Adicionar ao histórico
            dadosExemplo.entregas[index].historico.push({
                data: new Date().toISOString(),
                status: dadosExemplo.entregas[index].status,
                comentario: 'Entrega atualizada',
                responsavel
            });
        }
    } else {
        // Adição de nova entrega
        const novaEntrega = {
            id: window.utils.generateId(),
            vendaId,
            cliente,
            endereco,
            data,
            status: 'pendente',
            observacoes,
            historico: [
                {
                    data: new Date().toISOString(),
                    status: 'pendente',
                    comentario: 'Entrega registrada',
                    responsavel
                }
            ]
        };
        
        // Adicionar entrega
        dadosExemplo.entregas = dadosExemplo.entregas || [];
        dadosExemplo.entregas.push(novaEntrega);
    }
    
    // Salvar dados no localStorage
    window.utils.saveToLocalStorage('dadosExemplo', dadosExemplo);
    
    // Fechar modal
    const modalEntrega = document.getElementById('modal-entrega');
    window.utils.closeModal(modalEntrega);
    
    // Atualizar tabela de entregas
    updateEntregasTable();
    
    // Atualizar select de vendas
    fillVendasSelect();
    
    // Mostrar mensagem de sucesso
    alert(entregaId ? 'Entrega atualizada com sucesso!' : 'Entrega registrada com sucesso!');
}

// Salvar status da entrega
function saveEntregaStatus() {
    // Obter dados do formulário
    const entregaId = document.getElementById('entrega-id').value;
    const status = document.getElementById('entrega-status').value;
    const comentario = document.getElementById('entrega-comentario').value;
    
    // Validar campos obrigatórios
    if (!entregaId || !status) {
        alert('Por favor, preencha os campos obrigatórios.');
        return;
    }
    
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.entregas) return;
    
    // Encontrar entrega
    const index = dadosExemplo.entregas.findIndex(e => e.id === entregaId);
    
    if (index !== -1) {
        // Obter funcionário atual
        const funcionarioAtual = window.utils.getFromLocalStorage('funcionarioAtual');
        const responsavel = funcionarioAtual ? funcionarioAtual.nome : 'Funcionário';
        
        // Atualizar status
        dadosExemplo.entregas[index].status = status;
        
        // Adicionar ao histórico
        dadosExemplo.entregas[index].historico.push({
            data: new Date().toISOString(),
            status,
            comentario: comentario || `Status alterado para ${status}`,
            responsavel
        });
        
        // Salvar dados no localStorage
        window.utils.saveToLocalStorage('dadosExemplo', dadosExemplo);
        
        // Fechar modal
        const modalStatusEntrega = document.getElementById('modal-status-entrega');
        window.utils.closeModal(modalStatusEntrega);
        
        // Atualizar tabela de entregas
        updateEntregasTable();
        
        // Mostrar mensagem de sucesso
        alert('Status da entrega atualizado com sucesso!');
    } else {
        alert('Entrega não encontrada.');
    }
}

// Função global para visualizar entrega
window.visualizarEntrega = function(id) {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.entregas) return;
    
    // Encontrar entrega
    const entrega = dadosExemplo.entregas.find(e => e.id === id);
    if (!entrega) {
        alert('Entrega não encontrada.');
        return;
    }
    
    // Criar modal de visualização
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    // Formatar status para exibição
    let statusText = entrega.status.replace('-', ' ');
    statusText = statusText.charAt(0).toUpperCase() + statusText.slice(1);
    
    // Determinar classe de status
    let statusClass = '';
    switch (entrega.status) {
        case 'pendente':
            statusClass = 'text-warning';
            break;
        case 'em-transito':
            statusClass = 'text-primary';
            break;
        case 'entregue':
            statusClass = 'text-success';
            break;
        case 'cancelada':
            statusClass = 'text-danger';
            break;
    }
    
    // Criar histórico
    let historicoHTML = '';
    if (entrega.historico && entrega.historico.length > 0) {
        entrega.historico.forEach(hist => {
            historicoHTML += `
                <div class="historico-item">
                    <p><strong>${window.utils.formatDate(hist.data)}</strong> - ${hist.status.charAt(0).toUpperCase() + hist.status.slice(1).replace('-', ' ')}</p>
                    <p>${hist.comentario}</p>
                    <p class="text-muted">Responsável: ${hist.responsavel}</p>
                </div>
            `;
        });
    } else {
        historicoHTML = '<p>Nenhum histórico disponível.</p>';
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Detalhes da Entrega #${entrega.id}</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col">
                        <h3>Informações da Entrega</h3>
                        <p><strong>Cliente:</strong> ${entrega.cliente}</p>
                        <p><strong>Endereço:</strong> ${entrega.endereco}</p>
                        <p><strong>Data Prevista:</strong> ${window.utils.formatDate(entrega.data)}</p>
                        <p><strong>Status:</strong> <span class="${statusClass}">${statusText}</span></p>
                        <p><strong>Observações:</strong> ${entrega.observacoes || 'Nenhuma observação'}</p>
                    </div>
                    <div class="col">
                        <h3>Histórico</h3>
                        <div class="historico-container">
                            ${historicoHTML}
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="this.closest('.modal').style.display='none'">Fechar</button>
            </div>
        </div>
    `;
    
    // Adicionar modal ao corpo do documento
    document.body.appendChild(modal);
    
    // Configurar evento para fechar o modal
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        }
    });
};

// Função global para atualizar status da entrega
window.atualizarStatusEntrega = function(id) {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.entregas) return;
    
    // Encontrar entrega
    const entrega = dadosExemplo.entregas.find(e => e.id === id);
    if (!entrega) {
        alert('Entrega não encontrada.');
        return;
    }
    
    // Preencher formulário
    document.getElementById('entrega-id').value = entrega.id;
    document.getElementById('entrega-cliente-status').value = entrega.cliente;
    document.getElementById('entrega-status').value = entrega.status;
    document.getElementById('entrega-comentario').value = '';
    
    // Abrir modal
    const modalStatusEntrega = document.getElementById('modal-status-entrega');
    window.utils.openModal(modalStatusEntrega);
};

// Função global para excluir entrega
window.excluirEntrega = function(id) {
    if (confirm('Tem certeza que deseja excluir esta entrega?')) {
        // Obter dados do localStorage
        const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
        if (!dadosExemplo || !dadosExemplo.entregas) return;
        
        // Remover entrega
        dadosExemplo.entregas = dadosExemplo.entregas.filter(e => e.id !== id);
        
        // Salvar dados no localStorage
        window.utils.saveToLocalStorage('dadosExemplo', dadosExemplo);
        
        // Atualizar tabela de entregas
        updateEntregasTable();
        
        // Atualizar select de vendas
        fillVendasSelect();
        
        // Mostrar mensagem de sucesso
        alert('Entrega excluída com sucesso!');
    }
};

// Exportar funções
window.entregasManagement = {
    init: initEntregasManagement,
    updateEntregasTable,
    fillVendasSelect
};
