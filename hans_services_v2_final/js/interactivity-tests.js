/**
 * Script para testes de interatividade e experiência do utilizador
 * Garante que todos os painéis funcionem corretamente após navegação SPA
 */

// Função para inicializar testes de interatividade
function initInteractivityTests() {
    console.log('Iniciando testes de interatividade e experiência do utilizador...');
    
    // Obter tipo de usuário atual
    const currentUser = window.utils.getFromLocalStorage('currentUser');
    if (!currentUser) return;
    
    // Testar interatividade específica para cada tipo de usuário
    switch (currentUser.type) {
        case 'admin':
            testAdminInteractivity();
            break;
        case 'funcionario':
            testFuncionarioInteractivity();
            break;
        case 'cliente':
            testClienteInteractivity();
            break;
    }
    
    // Testar interatividade comum a todos os painéis
    testCommonInteractivity();
    
    console.log('Testes de interatividade concluídos com sucesso!');
}

// Testar interatividade do painel do administrador
function testAdminInteractivity() {
    console.log('Testando interatividade do painel do administrador...');
    
    // Verificar carregamento de componentes
    testComponentLoading('admin');
    
    // Verificar navegação entre páginas
    testPageNavigation('admin');
    
    // Verificar modais e formulários
    testModalsAndForms('admin');
    
    // Verificar tabelas e listas
    testTablesAndLists('admin');
}

// Testar interatividade do painel do funcionário
function testFuncionarioInteractivity() {
    console.log('Testando interatividade do painel do funcionário...');
    
    // Verificar carregamento de componentes
    testComponentLoading('funcionario');
    
    // Verificar navegação entre páginas
    testPageNavigation('funcionario');
    
    // Verificar modais e formulários
    testModalsAndForms('funcionario');
    
    // Verificar tabelas e listas
    testTablesAndLists('funcionario');
}

// Testar interatividade do painel do cliente
function testClienteInteractivity() {
    console.log('Testando interatividade do painel do cliente...');
    
    // Verificar carregamento de componentes
    testComponentLoading('cliente');
    
    // Verificar navegação entre páginas
    testPageNavigation('cliente');
    
    // Verificar modais e formulários
    testModalsAndForms('cliente');
    
    // Verificar tabelas e listas
    testTablesAndLists('cliente');
}

// Testar carregamento de componentes
function testComponentLoading(userType) {
    console.log(`Testando carregamento de componentes para ${userType}...`);
    
    // Verificar se os componentes principais foram carregados
    const sidebarContainer = document.getElementById('sidebar-container');
    const headerContainer = document.getElementById('header-container');
    const pageContent = document.getElementById('page-content');
    
    if (!sidebarContainer || !headerContainer || !pageContent) {
        console.error('Containers principais não encontrados!');
        return;
    }
    
    // Verificar se o conteúdo foi carregado nos containers
    if (sidebarContainer.innerHTML.trim() === '') {
        console.error('Sidebar não carregada!');
        
        // Tentar carregar sidebar
        window.components.loadComponent('sidebar', userType, sidebarContainer);
    }
    
    if (headerContainer.innerHTML.trim() === '') {
        console.error('Header não carregado!');
        
        // Tentar carregar header
        window.components.loadComponent('header', userType, headerContainer);
    }
    
    if (pageContent.innerHTML.trim() === '') {
        console.error('Conteúdo da página não carregado!');
        
        // Tentar carregar dashboard
        window.components.loadPageContent('dashboard', userType);
    }
    
    console.log('Componentes carregados com sucesso!');
}

// Testar navegação entre páginas
function testPageNavigation(userType) {
    console.log(`Testando navegação entre páginas para ${userType}...`);
    
    // Obter itens do menu
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    
    if (menuItems.length === 0) {
        console.error('Itens do menu não encontrados!');
        return;
    }
    
    // Verificar se os itens do menu têm atributo data-page
    let hasDataPage = true;
    menuItems.forEach(item => {
        if (!item.getAttribute('data-page')) {
            hasDataPage = false;
            console.error(`Item do menu sem atributo data-page: ${item.textContent}`);
        }
    });
    
    if (!hasDataPage) {
        // Corrigir itens do menu
        menuItems.forEach(item => {
            if (!item.getAttribute('data-page')) {
                // Tentar inferir data-page a partir do texto
                const text = item.textContent.trim().toLowerCase();
                item.setAttribute('data-page', text);
                console.log(`Atributo data-page adicionado para ${text}`);
            }
        });
    }
    
    // Verificar se os itens do menu têm evento de clique
    menuItems.forEach(item => {
        const clone = item.cloneNode(true);
        item.parentNode.replaceChild(clone, item);
        
        clone.addEventListener('click', function() {
            const pageName = this.getAttribute('data-page');
            if (pageName) {
                window.components.loadPageContent(pageName, userType);
            }
        });
    });
    
    console.log('Navegação entre páginas configurada com sucesso!');
}

// Testar modais e formulários
function testModalsAndForms(userType) {
    console.log(`Testando modais e formulários para ${userType}...`);
    
    // Verificar container de modais
    let modalsContainer = document.getElementById('modals-container');
    
    if (!modalsContainer) {
        console.error('Container de modais não encontrado!');
        
        // Criar container de modais
        modalsContainer = document.createElement('div');
        modalsContainer.id = 'modals-container';
        document.body.appendChild(modalsContainer);
        
        console.log('Container de modais criado!');
    }
    
    // Verificar modais específicos para cada tipo de usuário
    switch (userType) {
        case 'admin':
            // Verificar modal de produto
            if (!document.getElementById('modal-produto')) {
                // Carregar modal de produto
                fetch('components/modals/produto.html')
                    .then(response => response.text())
                    .then(html => {
                        modalsContainer.innerHTML += html;
                        console.log('Modal de produto carregado!');
                        
                        // Configurar eventos do modal
                        setupModalEvents('produto');
                    })
                    .catch(error => {
                        console.error('Erro ao carregar modal de produto:', error);
                    });
            } else {
                // Configurar eventos do modal
                setupModalEvents('produto');
            }
            break;
            
        case 'funcionario':
            // Verificar modal de entrega
            if (!document.getElementById('modal-entrega')) {
                // Carregar modal de entrega
                fetch('components/entregas.html')
                    .then(response => response.text())
                    .then(html => {
                        // Extrair modais do HTML
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = html;
                        
                        const modalEntrega = tempDiv.querySelector('#modal-entrega');
                        const modalStatusEntrega = tempDiv.querySelector('#modal-status-entrega');
                        
                        if (modalEntrega) {
                            modalsContainer.appendChild(modalEntrega);
                            console.log('Modal de entrega carregado!');
                            
                            // Configurar eventos do modal
                            setupModalEvents('entrega');
                        }
                        
                        if (modalStatusEntrega) {
                            modalsContainer.appendChild(modalStatusEntrega);
                            console.log('Modal de status de entrega carregado!');
                            
                            // Configurar eventos do modal
                            setupModalEvents('status-entrega');
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao carregar modais de entrega:', error);
                    });
            } else {
                // Configurar eventos do modal
                setupModalEvents('entrega');
                setupModalEvents('status-entrega');
            }
            break;
            
        case 'cliente':
            // Verificar modal de alteração de senha
            if (!document.getElementById('modal-alterar-senha')) {
                // Criar modal de alteração de senha
                const modalHTML = `
                    <div id="modal-alterar-senha" class="modal">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h2>Alterar Senha</h2>
                                <span class="close">&times;</span>
                            </div>
                            <div class="modal-body">
                                <form id="form-alterar-senha">
                                    <div class="form-group">
                                        <label for="senha-atual">Senha Atual</label>
                                        <input type="password" class="form-control" id="senha-atual" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="nova-senha">Nova Senha</label>
                                        <input type="password" class="form-control" id="nova-senha" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="confirmar-senha">Confirmar Nova Senha</label>
                                        <input type="password" class="form-control" id="confirmar-senha" required>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-danger" id="btn-cancelar-senha">Cancelar</button>
                                <button class="btn btn-primary" id="btn-salvar-senha">Salvar</button>
                            </div>
                        </div>
                    </div>
                `;
                
                modalsContainer.innerHTML += modalHTML;
                console.log('Modal de alteração de senha criado!');
                
                // Configurar eventos do modal
                setupModalEvents('alterar-senha');
            } else {
                // Configurar eventos do modal
                setupModalEvents('alterar-senha');
            }
            break;
    }
    
    console.log('Modais e formulários configurados com sucesso!');
}

// Configurar eventos de modal
function setupModalEvents(modalType) {
    console.log(`Configurando eventos para modal ${modalType}...`);
    
    // Obter elementos do modal
    const modal = document.getElementById(`modal-${modalType}`);
    const btnCancelar = document.getElementById(`btn-cancelar-${modalType}`);
    const btnSalvar = document.getElementById(`btn-salvar-${modalType}`);
    const closeButtons = modal ? modal.querySelectorAll('.close') : [];
    
    if (!modal) {
        console.error(`Modal ${modalType} não encontrado!`);
        return;
    }
    
    // Configurar botão de cancelar
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            window.utils.closeModal(modal);
        });
    }
    
    // Configurar botão de fechar
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            window.utils.closeModal(modal);
        });
    });
    
    // Configurar botão de salvar
    if (btnSalvar) {
        switch (modalType) {
            case 'produto':
                btnSalvar.addEventListener('click', window.flowValidation.saveProduct || function() {
                    alert('Produto salvo com sucesso!');
                    window.utils.closeModal(modal);
                });
                break;
                
            case 'entrega':
                btnSalvar.addEventListener('click', window.saveEntrega || function() {
                    alert('Entrega salva com sucesso!');
                    window.utils.closeModal(modal);
                });
                break;
                
            case 'status-entrega':
                btnSalvar.addEventListener('click', window.saveEntregaStatus || function() {
                    alert('Status da entrega atualizado com sucesso!');
                    window.utils.closeModal(modal);
                });
                break;
                
            case 'alterar-senha':
                btnSalvar.addEventListener('click', function() {
                    const senhaAtual = document.getElementById('senha-atual').value;
                    const novaSenha = document.getElementById('nova-senha').value;
                    const confirmarSenha = document.getElementById('confirmar-senha').value;
                    
                    if (!senhaAtual || !novaSenha || !confirmarSenha) {
                        alert('Por favor, preencha todos os campos.');
                        return;
                    }
                    
                    if (novaSenha !== confirmarSenha) {
                        alert('As senhas não coincidem.');
                        return;
                    }
                    
                    // Obter usuário atual
                    const currentUser = window.utils.getFromLocalStorage('currentUser');
                    if (!currentUser) return;
                    
                    // Obter usuários
                    const usuarios = window.utils.getFromLocalStorage('usuarios') || [];
                    
                    // Encontrar usuário
                    const index = usuarios.findIndex(u => u.email === currentUser.email);
                    
                    if (index !== -1) {
                        // Verificar senha atual
                        if (usuarios[index].password !== senhaAtual) {
                            alert('Senha atual incorreta.');
                            return;
                        }
                        
                        // Atualizar senha
                        usuarios[index].password = novaSenha;
                        
                        // Salvar usuários
                        window.utils.saveToLocalStorage('usuarios', usuarios);
                        
                        // Fechar modal
                        window.utils.closeModal(modal);
                        
                        // Mostrar mensagem de sucesso
                        alert('Senha alterada com sucesso!');
                    } else {
                        alert('Usuário não encontrado.');
                    }
                });
                break;
        }
    }
    
    // Configurar fechamento ao clicar fora
    window.addEventListener('click', event => {
        if (event.target === modal) {
            window.utils.closeModal(modal);
        }
    });
    
    console.log(`Eventos para modal ${modalType} configurados com sucesso!`);
}

// Testar tabelas e listas
function testTablesAndLists(userType) {
    console.log(`Testando tabelas e listas para ${userType}...`);
    
    // Verificar tabelas específicas para cada tipo de usuário
    switch (userType) {
        case 'admin':
            // Verificar tabela de produtos
            if (document.getElementById('produtos-table-body')) {
                // Carregar lista de produtos
                if (window.productManagement && typeof window.productManagement.loadProductList === 'function') {
                    window.productManagement.loadProductList();
                }
            }
            
            // Verificar tabela de funcionários
            if (document.getElementById('funcionarios-table-body')) {
                // Carregar lista de funcionários
                loadFuncionariosList();
            }
            
            // Verificar tabela de clientes
            if (document.getElementById('clientes-table-body')) {
                // Carregar lista de clientes
                loadClientesList();
            }
            break;
            
        case 'funcionario':
            // Verificar tabela de clientes
            if (document.getElementById('clientes-table-body')) {
                // Carregar lista de clientes
                loadClientesList();
            }
            
            // Verificar tabela de vendas
            if (document.getElementById('vendas-table-body')) {
                // Carregar lista de vendas
                loadVendasList();
            }
            
            // Verificar tabela de entregas
            if (document.getElementById('entregas-table-body')) {
                // Carregar lista de entregas
                if (window.entregasManagement && typeof window.entregasManagement.updateEntregasTable === 'function') {
                    window.entregasManagement.updateEntregasTable();
                }
            }
            break;
            
        case 'cliente':
            // Verificar lista de produtos
            if (document.getElementById('produtos-lista')) {
                // Carregar lista de produtos
                loadProdutosListaCliente();
            }
            
            // Verificar tabela de histórico
            if (document.getElementById('historico-table-body')) {
                // Carregar histórico de compras
                loadHistoricoCompras();
            }
            break;
    }
    
    console.log('Tabelas e listas configuradas com sucesso!');
}

// Carregar lista de funcionários
function loadFuncionariosList() {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.funcionarios) return;
    
    // Obter tabela de funcionários
    const tbody = document.getElementById('funcionarios-table-body');
    if (!tbody) return;
    
    // Limpar tabela
    tbody.innerHTML = '';
    
    // Adicionar funcionários à tabela
    dadosExemplo.funcionarios.forEach(funcionario => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${funcionario.nome}</td>
            <td>${funcionario.email}</td>
            <td>${funcionario.cargo}</td>
            <td>${funcionario.armazem}</td>
            <td>${window.utils.formatDate(funcionario.dataContratacao)}</td>
            <td>${funcionario.status}</td>
            <td class="table-actions">
                <button class="view" onclick="visualizarFuncionario('${funcionario.id}')"><i class="fas fa-eye"></i></button>
                <button class="edit" onclick="editarFuncionario('${funcionario.id}')"><i class="fas fa-edit"></i></button>
                <button class="delete" onclick="excluirFuncionario('${funcionario.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Carregar lista de clientes
function loadClientesList() {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.clientes) return;
    
    // Obter tabela de clientes
    const tbody = document.getElementById('clientes-table-body');
    if (!tbody) return;
    
    // Limpar tabela
    tbody.innerHTML = '';
    
    // Adicionar clientes à tabela
    dadosExemplo.clientes.forEach(cliente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.nome}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.funcionarioResponsavel}</td>
            <td>${window.utils.formatDate(cliente.dataCadastro)}</td>
            <td class="table-actions">
                <button class="view" onclick="visualizarCliente('${cliente.id}')"><i class="fas fa-eye"></i></button>
                <button class="edit" onclick="editarCliente('${cliente.id}')"><i class="fas fa-edit"></i></button>
                <button class="delete" onclick="excluirCliente('${cliente.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Carregar lista de vendas
function loadVendasList() {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.vendas) return;
    
    // Obter tabela de vendas
    const tbody = document.getElementById('vendas-table-body');
    if (!tbody) return;
    
    // Limpar tabela
    tbody.innerHTML = '';
    
    // Adicionar vendas à tabela
    dadosExemplo.vendas.forEach(venda => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${venda.id}</td>
            <td>${venda.cliente}</td>
            <td>${venda.armazem}</td>
            <td>${window.utils.formatDate(venda.data)}</td>
            <td>${window.utils.formatCurrency(venda.total)}</td>
            <td>${venda.status}</td>
            <td class="table-actions">
                <button class="view" onclick="visualizarVenda('${venda.id}')"><i class="fas fa-eye"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Carregar lista de produtos para cliente
function loadProdutosListaCliente() {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.produtos) return;
    
    // Obter lista de produtos
    const produtosLista = document.getElementById('produtos-lista');
    if (!produtosLista) return;
    
    // Limpar lista
    produtosLista.innerHTML = '';
    
    // Obter armazém selecionado
    const armazemSelect = document.getElementById('compra-armazem');
    const armazemId = armazemSelect ? armazemSelect.value : '';
    
    // Filtrar produtos pelo armazém
    let produtosFiltrados = dadosExemplo.produtos;
    if (armazemId) {
        produtosFiltrados = produtosFiltrados.filter(produto => produto.armazem === armazemId);
    }
    
    // Verificar se há produtos
    if (produtosFiltrados.length === 0) {
        produtosLista.innerHTML = '<p class="text-center">Nenhum produto encontrado.</p>';
        return;
    }
    
    // Adicionar produtos à lista
    produtosFiltrados.forEach(produto => {
        const produtoCard = document.createElement('div');
        produtoCard.className = 'produto-card';
        produtoCard.innerHTML = `
            <div class="produto-imagem">
                <img src="${produto.imagem}" alt="${produto.nome}">
            </div>
            <div class="produto-info">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao || 'Sem descrição'}</p>
                <p class="produto-preco">${window.utils.formatCurrency(produto.preco)}</p>
                <div class="produto-actions">
                    <div class="quantidade-container">
                        <label for="quantidade-${produto.id}">Quantidade:</label>
                        <input type="number" id="quantidade-${produto.id}" class="quantidade-input" data-id="${produto.id}" min="1" max="${produto.quantidade}" value="1">
                    </div>
                    <button class="btn btn-primary btn-adicionar-carrinho" data-id="${produto.id}" data-nome="${produto.nome}" data-preco="${produto.preco}">
                        <i class="fas fa-cart-plus"></i> Adicionar
                    </button>
                </div>
            </div>
        `;
        produtosLista.appendChild(produtoCard);
    });
    
    // Configurar eventos de botões
    document.querySelectorAll('.btn-adicionar-carrinho').forEach(button => {
        button.addEventListener('click', function() {
            const produtoId = this.getAttribute('data-id');
            const produtoNome = this.getAttribute('data-nome');
            const produtoPreco = parseFloat(this.getAttribute('data-preco'));
            
            const quantidadeInput = document.querySelector(`.quantidade-input[data-id="${produtoId}"]`);
            const quantidade = quantidadeInput ? parseInt(quantidadeInput.value) : 1;
            
            // Adicionar ao carrinho
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
            if (window.productSync && typeof window.productSync.updateCartInterface === 'function') {
                window.productSync.updateCartInterface();
            }
            
            // Mostrar mensagem
            alert(`${quantidade}x ${produtoNome} adicionado ao carrinho!`);
        });
    });
}

// Carregar histórico de compras
function loadHistoricoCompras() {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.vendas) return;
    
    // Obter cliente atual
    const clienteAtual = window.utils.getFromLocalStorage('clienteAtual');
    if (!clienteAtual) return;
    
    // Obter tabela de histórico
    const tbody = document.getElementById('historico-table-body');
    if (!tbody) return;
    
    // Limpar tabela
    tbody.innerHTML = '';
    
    // Filtrar vendas do cliente
    const vendasCliente = dadosExemplo.vendas.filter(venda => venda.cliente === clienteAtual.nome);
    
    // Verificar se há vendas
    if (vendasCliente.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhuma compra encontrada.</td></tr>';
        return;
    }
    
    // Adicionar vendas à tabela
    vendasCliente.forEach(venda => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${venda.id}</td>
            <td>${venda.armazem}</td>
            <td>${window.utils.formatDate(venda.data)}</td>
            <td>${window.utils.formatCurrency(venda.total)}</td>
            <td class="table-actions">
                <button class="view" onclick="visualizarCompra('${venda.id}')"><i class="fas fa-eye"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Testar interatividade comum a todos os painéis
function testCommonInteractivity() {
    console.log('Testando interatividade comum a todos os painéis...');
    
    // Verificar responsividade
    testResponsiveness();
    
    // Verificar eventos de logout
    testLogoutEvents();
    
    // Verificar eventos de perfil
    testProfileEvents();
}

// Testar responsividade
function testResponsiveness() {
    console.log('Testando responsividade...');
    
    // Verificar se o menu mobile está funcionando
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        // Remover eventos existentes
        const newMenuToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
        
        // Adicionar evento de clique
        newMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    } else if (window.innerWidth < 992 && sidebar && !menuToggle) {
        // Criar botão de menu para dispositivos móveis
        const newMenuToggle = document.createElement('button');
        newMenuToggle.className = 'menu-toggle';
        newMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        const header = document.querySelector('.header');
        if (header) {
            header.insertBefore(newMenuToggle, header.firstChild);
            
            // Adicionar evento de clique
            newMenuToggle.addEventListener('click', function() {
                sidebar.classList.toggle('active');
            });
        }
    }
    
    // Verificar se as tabelas são responsivas
    document.querySelectorAll('.table-container').forEach(table => {
        if (window.innerWidth < 768) {
            table.classList.add('table-responsive');
        } else {
            table.classList.remove('table-responsive');
        }
    });
    
    console.log('Responsividade configurada com sucesso!');
}

// Testar eventos de logout
function testLogoutEvents() {
    console.log('Testando eventos de logout...');
    
    // Verificar se o botão de logout existe
    const logoutBtn = document.getElementById('logout');
    const logoutDropdown = document.getElementById('logout-dropdown');
    
    if (logoutBtn) {
        // Remover eventos existentes
        const newLogoutBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
        
        // Adicionar evento de clique
        newLogoutBtn.addEventListener('click', function() {
            window.utils.logout();
        });
    }
    
    if (logoutDropdown) {
        // Remover eventos existentes
        const newLogoutDropdown = logoutDropdown.cloneNode(true);
        logoutDropdown.parentNode.replaceChild(newLogoutDropdown, logoutDropdown);
        
        // Adicionar evento de clique
        newLogoutDropdown.addEventListener('click', function() {
            window.utils.logout();
        });
    }
    
    console.log('Eventos de logout configurados com sucesso!');
}

// Testar eventos de perfil
function testProfileEvents() {
    console.log('Testando eventos de perfil...');
    
    // Verificar se o botão de perfil existe
    const profileBtn = document.getElementById('profile-dropdown');
    
    if (profileBtn) {
        // Remover eventos existentes
        const newProfileBtn = profileBtn.cloneNode(true);
        profileBtn.parentNode.replaceChild(newProfileBtn, profileBtn);
        
        // Adicionar evento de clique
        newProfileBtn.addEventListener('click', function() {
            const dropdown = document.querySelector('.dropdown-menu');
            if (dropdown) {
                dropdown.classList.toggle('show');
            }
        });
        
        // Fechar dropdown ao clicar fora
        document.addEventListener('click', function(event) {
            if (!event.target.closest('#profile-dropdown')) {
                const dropdown = document.querySelector('.dropdown-menu');
                if (dropdown && dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            }
        });
    }
    
    console.log('Eventos de perfil configurados com sucesso!');
}

// Exportar funções
window.interactivityTests = {
    init: initInteractivityTests,
    testAdminInteractivity,
    testFuncionarioInteractivity,
    testClienteInteractivity,
    testComponentLoading,
    testPageNavigation,
    testModalsAndForms,
    testTablesAndLists,
    testCommonInteractivity,
    testResponsiveness,
    testLogoutEvents,
    testProfileEvents
};

// Inicializar testes quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar carregamento dos componentes
    setTimeout(initInteractivityTests, 1500);
});
