/**
 * Script para gestão de modais e formulários do funcionário
 * Implementa a lógica de interação para adicionar, editar e excluir clientes e realizar vendas
 */

// Função para inicializar gestão de modais do funcionário
function initFuncionarioModalManagement() {
    console.log('Inicializando gestão de modais do funcionário...');
    
    // Carregar modais
    loadFuncionarioModals();
    
    // Configurar eventos dos botões de adicionar
    setupFuncionarioAddButtons();
    
    console.log('Gestão de modais do funcionário inicializada com sucesso!');
}

// Carregar modais do funcionário
function loadFuncionarioModals() {
    console.log('Carregando modais do funcionário...');
    
    // Verificar se o container de modais existe
    if (!document.getElementById('modals-container')) {
        const modalsContainer = document.createElement('div');
        modalsContainer.id = 'modals-container';
        document.body.appendChild(modalsContainer);
    }
    
    // Carregar modal de cliente
    fetch('components/modals/cliente.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('modals-container').innerHTML += html;
            setupClienteModalEvents();
        })
        .catch(error => {
            console.error('Erro ao carregar modal de cliente:', error);
        });
    
    // Carregar modal de venda
    fetch('components/modals/venda.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('modals-container').innerHTML += html;
            setupVendaModalEvents();
        })
        .catch(error => {
            console.error('Erro ao carregar modal de venda:', error);
        });
}

// Configurar eventos dos botões de adicionar
function setupFuncionarioAddButtons() {
    console.log('Configurando eventos dos botões de adicionar do funcionário...');
    
    // Botão de adicionar cliente
    document.addEventListener('click', function(event) {
        if (event.target && (event.target.id === 'btn-adicionar-cliente' || event.target.closest('#btn-adicionar-cliente'))) {
            openClienteModal();
        }
    });
    
    // Botão de realizar venda
    document.addEventListener('click', function(event) {
        if (event.target && (event.target.id === 'btn-realizar-venda' || event.target.closest('#btn-realizar-venda'))) {
            openVendaModal();
        }
    });
}

// Abrir modal de cliente
function openClienteModal(clienteId = null) {
    console.log('Abrindo modal de cliente...');
    
    const modalCliente = document.getElementById('modal-cliente');
    if (!modalCliente) {
        console.error('Modal de cliente não encontrado!');
        return;
    }
    
    // Resetar formulário
    document.getElementById('form-cliente').reset();
    
    // Remover ID do formulário
    document.getElementById('form-cliente').removeAttribute('data-id');
    
    // Verificar se é edição
    if (clienteId) {
        // Obter dados do cliente
        const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
        if (!dadosExemplo || !dadosExemplo.clientes) return;
        
        const cliente = dadosExemplo.clientes.find(c => c.id === clienteId);
        if (!cliente) {
            console.error('Cliente não encontrado!');
            return;
        }
        
        // Preencher formulário
        document.getElementById('cliente-nome').value = cliente.nome;
        document.getElementById('cliente-email').value = cliente.email;
        document.getElementById('cliente-telefone').value = cliente.telefone || '';
        document.getElementById('cliente-endereco').value = cliente.endereco || '';
        
        // Campos de senha ficam vazios na edição
        document.getElementById('cliente-senha').removeAttribute('required');
        document.getElementById('cliente-confirmar-senha').removeAttribute('required');
        
        // Adicionar ID ao formulário
        document.getElementById('form-cliente').setAttribute('data-id', clienteId);
        
        // Atualizar título do modal
        document.getElementById('modal-cliente-title').textContent = 'Editar Cliente';
    } else {
        // Atualizar título do modal
        document.getElementById('modal-cliente-title').textContent = 'Adicionar Cliente';
        
        // Campos de senha são obrigatórios na adição
        document.getElementById('cliente-senha').setAttribute('required', 'required');
        document.getElementById('cliente-confirmar-senha').setAttribute('required', 'required');
    }
    
    // Abrir modal
    window.utils.openModal(modalCliente);
}

// Abrir modal de venda
function openVendaModal() {
    console.log('Abrindo modal de venda...');
    
    const modalVenda = document.getElementById('modal-venda');
    if (!modalVenda) {
        console.error('Modal de venda não encontrado!');
        return;
    }
    
    // Resetar formulário
    document.getElementById('form-venda').reset();
    
    // Preencher combobox de clientes
    fillClientesCombobox('venda-cliente');
    
    // Preencher combobox de armazéns
    fillArmazensCombobox('venda-armazem');
    
    // Limpar lista de produtos
    document.getElementById('venda-produtos-lista').innerHTML = '';
    
    // Atualizar total
    updateVendaTotal();
    
    // Abrir modal
    window.utils.openModal(modalVenda);
}

// Preencher combobox de clientes
function fillClientesCombobox(selectId) {
    console.log(`Preenchendo combobox de clientes (${selectId})...`);
    
    const select = document.getElementById(selectId);
    if (!select) {
        console.error(`Combobox de clientes (${selectId}) não encontrado!`);
        return;
    }
    
    // Limpar combobox
    select.innerHTML = '<option value="">Selecione um cliente</option>';
    
    // Obter dados de clientes
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.clientes) return;
    
    // Preencher combobox
    dadosExemplo.clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id;
        option.textContent = cliente.nome;
        select.appendChild(option);
    });
}

// Preencher combobox de armazéns
function fillArmazensCombobox(selectId) {
    console.log(`Preenchendo combobox de armazéns (${selectId})...`);
    
    const select = document.getElementById(selectId);
    if (!select) {
        console.error(`Combobox de armazéns (${selectId}) não encontrado!`);
        return;
    }
    
    // Limpar combobox
    select.innerHTML = '<option value="">Selecione um armazém</option>';
    
    // Obter dados de armazéns
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.armazens) return;
    
    // Preencher combobox
    dadosExemplo.armazens.forEach(armazem => {
        const option = document.createElement('option');
        option.value = armazem.id;
        option.textContent = armazem.nome;
        select.appendChild(option);
    });
}

// Preencher combobox de produtos
function fillProdutosCombobox(selectId, armazemId) {
    console.log(`Preenchendo combobox de produtos (${selectId}) para o armazém ${armazemId}...`);
    
    const select = document.getElementById(selectId);
    if (!select) {
        console.error(`Combobox de produtos (${selectId}) não encontrado!`);
        return;
    }
    
    // Limpar combobox
    select.innerHTML = '<option value="">Selecione um produto</option>';
    
    // Obter dados de produtos
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.produtos) return;
    
    // Filtrar produtos do armazém
    const produtosArmazem = dadosExemplo.produtos.filter(p => p.armazem === armazemId && p.quantidade > 0);
    
    // Preencher combobox
    produtosArmazem.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.id;
        option.textContent = `${produto.nome} - ${window.utils.formatCurrency(produto.preco)}`;
        option.setAttribute('data-preco', produto.preco);
        option.setAttribute('data-quantidade', produto.quantidade);
        select.appendChild(option);
    });
}

// Configurar eventos do modal de cliente
function setupClienteModalEvents() {
    console.log('Configurando eventos do modal de cliente...');
    
    const modalCliente = document.getElementById('modal-cliente');
    if (!modalCliente) {
        console.error('Modal de cliente não encontrado!');
        return;
    }
    
    // Botão de cancelar
    const btnCancelarCliente = document.getElementById('btn-cancelar-cliente');
    if (btnCancelarCliente) {
        btnCancelarCliente.addEventListener('click', function() {
            window.utils.closeModal(modalCliente);
        });
    }
    
    // Botão de salvar
    const btnSalvarCliente = document.getElementById('btn-salvar-cliente');
    if (btnSalvarCliente) {
        btnSalvarCliente.addEventListener('click', saveCliente);
    }
    
    // Botão de fechar
    const closeButtons = modalCliente.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.utils.closeModal(modalCliente);
        });
    });
    
    // Fechar ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === modalCliente) {
            window.utils.closeModal(modalCliente);
        }
    });
}

// Configurar eventos do modal de venda
function setupVendaModalEvents() {
    console.log('Configurando eventos do modal de venda...');
    
    const modalVenda = document.getElementById('modal-venda');
    if (!modalVenda) {
        console.error('Modal de venda não encontrado!');
        return;
    }
    
    // Evento de mudança de armazém
    const armazemSelect = document.getElementById('venda-armazem');
    if (armazemSelect) {
        armazemSelect.addEventListener('change', function() {
            const armazemId = this.value;
            if (armazemId) {
                fillProdutosCombobox('venda-produto', armazemId);
                document.getElementById('venda-produto-container').style.display = 'block';
            } else {
                document.getElementById('venda-produto-container').style.display = 'none';
            }
        });
    }
    
    // Evento de mudança de produto
    const produtoSelect = document.getElementById('venda-produto');
    if (produtoSelect) {
        produtoSelect.addEventListener('change', function() {
            const produtoId = this.value;
            if (produtoId) {
                const option = this.options[this.selectedIndex];
                const quantidade = parseInt(option.getAttribute('data-quantidade'));
                
                // Atualizar quantidade máxima
                const quantidadeInput = document.getElementById('venda-quantidade');
                quantidadeInput.max = quantidade;
                quantidadeInput.value = 1;
                
                document.getElementById('venda-quantidade-container').style.display = 'block';
                document.getElementById('venda-quantidade-disponivel').textContent = quantidade;
            } else {
                document.getElementById('venda-quantidade-container').style.display = 'none';
            }
        });
    }
    
    // Botão de adicionar produto
    const btnAdicionarProduto = document.getElementById('btn-adicionar-produto-venda');
    if (btnAdicionarProduto) {
        btnAdicionarProduto.addEventListener('click', adicionarProdutoVenda);
    }
    
    // Botão de cancelar
    const btnCancelarVenda = document.getElementById('btn-cancelar-venda');
    if (btnCancelarVenda) {
        btnCancelarVenda.addEventListener('click', function() {
            window.utils.closeModal(modalVenda);
        });
    }
    
    // Botão de finalizar venda
    const btnFinalizarVenda = document.getElementById('btn-finalizar-venda');
    if (btnFinalizarVenda) {
        btnFinalizarVenda.addEventListener('click', finalizarVenda);
    }
    
    // Botão de fechar
    const closeButtons = modalVenda.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.utils.closeModal(modalVenda);
        });
    });
    
    // Fechar ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === modalVenda) {
            window.utils.closeModal(modalVenda);
        }
    });
}

// Adicionar produto à venda
function adicionarProdutoVenda() {
    console.log('Adicionando produto à venda...');
    
    // Obter dados do produto
    const produtoSelect = document.getElementById('venda-produto');
    const produtoId = produtoSelect.value;
    
    if (!produtoId) {
        alert('Por favor, selecione um produto.');
        return;
    }
    
    const produtoOption = produtoSelect.options[produtoSelect.selectedIndex];
    const produtoNome = produtoOption.textContent.split(' - ')[0];
    const produtoPreco = parseFloat(produtoOption.getAttribute('data-preco'));
    const produtoQuantidadeDisponivel = parseInt(produtoOption.getAttribute('data-quantidade'));
    
    // Obter quantidade
    const quantidadeInput = document.getElementById('venda-quantidade');
    const quantidade = parseInt(quantidadeInput.value);
    
    if (isNaN(quantidade) || quantidade <= 0) {
        alert('Por favor, informe uma quantidade válida.');
        return;
    }
    
    if (quantidade > produtoQuantidadeDisponivel) {
        alert(`Quantidade indisponível. Máximo disponível: ${produtoQuantidadeDisponivel}`);
        return;
    }
    
    // Verificar se o produto já está na lista
    const produtosLista = document.getElementById('venda-produtos-lista');
    const produtoExistente = produtosLista.querySelector(`[data-id="${produtoId}"]`);
    
    if (produtoExistente) {
        // Atualizar quantidade
        const quantidadeAtual = parseInt(produtoExistente.getAttribute('data-quantidade'));
        const novaQuantidade = quantidadeAtual + quantidade;
        
        if (novaQuantidade > produtoQuantidadeDisponivel) {
            alert(`Quantidade indisponível. Máximo disponível: ${produtoQuantidadeDisponivel}`);
            return;
        }
        
        produtoExistente.setAttribute('data-quantidade', novaQuantidade);
        
        // Atualizar subtotal
        const subtotal = novaQuantidade * produtoPreco;
        produtoExistente.setAttribute('data-subtotal', subtotal);
        
        // Atualizar texto
        const quantidadeSpan = produtoExistente.querySelector('.produto-quantidade');
        quantidadeSpan.textContent = novaQuantidade;
        
        const subtotalSpan = produtoExistente.querySelector('.produto-subtotal');
        subtotalSpan.textContent = window.utils.formatCurrency(subtotal);
    } else {
        // Adicionar novo produto
        const subtotal = quantidade * produtoPreco;
        
        const produtoItem = document.createElement('div');
        produtoItem.className = 'produto-item';
        produtoItem.setAttribute('data-id', produtoId);
        produtoItem.setAttribute('data-preco', produtoPreco);
        produtoItem.setAttribute('data-quantidade', quantidade);
        produtoItem.setAttribute('data-subtotal', subtotal);
        
        produtoItem.innerHTML = `
            <div class="produto-info">
                <span class="produto-nome">${produtoNome}</span>
                <span class="produto-preco">${window.utils.formatCurrency(produtoPreco)}</span>
                <span class="produto-quantidade">${quantidade}</span>
                <span class="produto-subtotal">${window.utils.formatCurrency(subtotal)}</span>
            </div>
            <button class="btn-remover-produto" onclick="removerProdutoVenda('${produtoId}')">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        produtosLista.appendChild(produtoItem);
    }
    
    // Resetar campos
    produtoSelect.value = '';
    quantidadeInput.value = '';
    document.getElementById('venda-quantidade-container').style.display = 'none';
    
    // Atualizar total
    updateVendaTotal();
}

// Remover produto da venda
window.removerProdutoVenda = function(produtoId) {
    console.log(`Removendo produto ${produtoId} da venda...`);
    
    const produtosLista = document.getElementById('venda-produtos-lista');
    const produtoItem = produtosLista.querySelector(`[data-id="${produtoId}"]`);
    
    if (produtoItem) {
        produtosLista.removeChild(produtoItem);
        
        // Atualizar total
        updateVendaTotal();
    }
};

// Atualizar total da venda
function updateVendaTotal() {
    console.log('Atualizando total da venda...');
    
    const produtosLista = document.getElementById('venda-produtos-lista');
    const produtosItems = produtosLista.querySelectorAll('.produto-item');
    
    let total = 0;
    
    produtosItems.forEach(item => {
        const subtotal = parseFloat(item.getAttribute('data-subtotal'));
        total += subtotal;
    });
    
    const totalSpan = document.getElementById('venda-total');
    totalSpan.textContent = window.utils.formatCurrency(total);
    
    // Habilitar/desabilitar botão de finalizar venda
    const btnFinalizarVenda = document.getElementById('btn-finalizar-venda');
    const clienteSelect = document.getElementById('venda-cliente');
    
    if (produtosItems.length > 0 && clienteSelect.value) {
        btnFinalizarVenda.removeAttribute('disabled');
    } else {
        btnFinalizarVenda.setAttribute('disabled', 'disabled');
    }
}

// Salvar cliente
function saveCliente() {
    console.log('Salvando cliente...');
    
    // Obter dados do formulário
    const nome = document.getElementById('cliente-nome').value;
    const email = document.getElementById('cliente-email').value;
    const telefone = document.getElementById('cliente-telefone').value;
    const endereco = document.getElementById('cliente-endereco').value;
    const senha = document.getElementById('cliente-senha').value;
    const confirmarSenha = document.getElementById('cliente-confirmar-senha').value;
    
    // Validar campos obrigatórios
    if (!nome || !email || !telefone) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Validar formato de email
    if (!email.endsWith('@gmail.com')) {
        alert('O email deve terminar com @gmail.com');
        return;
    }
    
    // Verificar se é edição ou adição
    const formCliente = document.getElementById('form-cliente');
    const clienteId = formCliente.getAttribute('data-id');
    
    // Validar senha apenas para adição
    if (!clienteId) {
        if (!senha || !confirmarSenha) {
            alert('Por favor, preencha os campos de senha.');
            return;
        }
        
        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }
    }
    
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo') || {};
    
    // Inicializar arrays se não existirem
    if (!dadosExemplo.clientes) dadosExemplo.clientes = [];
    
    // Obter dados do funcionário logado
    const usuarioLogado = window.utils.getFromLocalStorage('usuarioLogado');
    const funcionarioNome = usuarioLogado ? usuarioLogado.nome : 'Funcionário';
    
    if (clienteId) {
        // Edição de cliente existente
        const index = dadosExemplo.clientes.findIndex(c => c.id === clienteId);
        
        if (index !== -1) {
            // Atualizar cliente
            dadosExemplo.clientes[index] = {
                ...dadosExemplo.clientes[index],
                nome,
                email,
                telefone,
                endereco,
                updatedAt: new Date().toISOString()
            };
            
            // Atualizar senha se fornecida
            if (senha && confirmarSenha && senha === confirmarSenha) {
                // Atualizar usuário
                const usuarios = window.utils.getFromLocalStorage('usuarios') || [];
                const userIndex = usuarios.findIndex(u => u.email === email);
                
                if (userIndex !== -1) {
                    usuarios[userIndex].password = senha;
                    window.utils.saveToLocalStorage('usuarios', usuarios);
                }
            }
            
            // Mostrar mensagem de sucesso
            alert('Cliente atualizado com sucesso!');
        } else {
            console.error('Cliente não encontrado para edição!');
            alert('Erro ao atualizar cliente. Cliente não encontrado!');
            return;
        }
    } else {
        // Verificar se email já existe
        const emailExists = dadosExemplo.clientes.some(c => c.email === email);
        if (emailExists) {
            alert('Este email já está em uso. Por favor, escolha outro email.');
            return;
        }
        
        // Adição de novo cliente
        const novoCliente = {
            id: window.utils.generateId(),
            nome,
            email,
            telefone,
            endereco,
            cadastradoPor: funcionarioNome,
            status: 'Ativo',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Adicionar cliente
        dadosExemplo.clientes.push(novoCliente);
        
        // Adicionar usuário
        const usuarios = window.utils.getFromLocalStorage('usuarios') || [];
        usuarios.push({
            email,
            password: senha,
            type: 'cliente',
            nome
        });
        
        window.utils.saveToLocalStorage('usuarios', usuarios);
        
        // Mostrar mensagem de sucesso
        alert('Cliente adicionado com sucesso!');
    }
    
    // Salvar dados no localStorage
    window.utils.saveToLocalStorage('dadosExemplo', dadosExemplo);
    
    // Fechar modal
    const modalCliente = document.getElementById('modal-cliente');
    window.utils.closeModal(modalCliente);
    
    // Atualizar lista de clientes
    updateClienteList();
}

// Finalizar venda
function finalizarVenda() {
    console.log('Finalizando venda...');
    
    // Obter cliente
    const clienteSelect = document.getElementById('venda-cliente');
    const clienteId = clienteSelect.value;
    
    if (!clienteId) {
        alert('Por favor, selecione um cliente.');
        return;
    }
    
    // Obter armazém
    const armazemSelect = document.getElementById('venda-armazem');
    const armazemId = armazemSelect.value;
    
    if (!armazemId) {
        alert('Por favor, selecione um armazém.');
        return;
    }
    
    // Obter produtos
    const produtosLista = document.getElementById('venda-produtos-lista');
    const produtosItems = produtosLista.querySelectorAll('.produto-item');
    
    if (produtosItems.length === 0) {
        alert('Por favor, adicione pelo menos um produto à venda.');
        return;
    }
    
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo') || {};
    
    // Inicializar arrays se não existirem
    if (!dadosExemplo.vendas) dadosExemplo.vendas = [];
    if (!dadosExemplo.produtos) dadosExemplo.produtos = [];
    if (!dadosExemplo.armazens) dadosExemplo.armazens = [];
    if (!dadosExemplo.clientes) dadosExemplo.clientes = [];
    
    // Obter dados do cliente
    const cliente = dadosExemplo.clientes.find(c => c.id === clienteId);
    const clienteNome = cliente ? cliente.nome : 'Cliente não encontrado';
    
    // Obter dados do armazém
    const armazem = dadosExemplo.armazens.find(a => a.id === armazemId);
    const armazemNome = armazem ? armazem.nome : 'Armazém não encontrado';
    
    // Obter dados do funcionário logado
    const usuarioLogado = window.utils.getFromLocalStorage('usuarioLogado');
    const funcionarioNome = usuarioLogado ? usuarioLogado.nome : 'Funcionário';
    
    // Calcular total
    let total = 0;
    const itensVenda = [];
    
    produtosItems.forEach(item => {
        const produtoId = item.getAttribute('data-id');
        const quantidade = parseInt(item.getAttribute('data-quantidade'));
        const preco = parseFloat(item.getAttribute('data-preco'));
        const subtotal = parseFloat(item.getAttribute('data-subtotal'));
        
        // Obter dados do produto
        const produto = dadosExemplo.produtos.find(p => p.id === produtoId);
        const produtoNome = produto ? produto.nome : 'Produto não encontrado';
        
        // Adicionar item à venda
        itensVenda.push({
            produtoId,
            produtoNome,
            quantidade,
            preco,
            subtotal
        });
        
        // Atualizar estoque
        const produtoIndex = dadosExemplo.produtos.findIndex(p => p.id === produtoId);
        if (produtoIndex !== -1) {
            dadosExemplo.produtos[produtoIndex].quantidade -= quantidade;
        }
        
        // Atualizar total
        total += subtotal;
    });
    
    // Atualizar vendas do armazém
    const armazemIndex = dadosExemplo.armazens.findIndex(a => a.id === armazemId);
    if (armazemIndex !== -1) {
        dadosExemplo.armazens[armazemIndex].vendas = (dadosExemplo.armazens[armazemIndex].vendas || 0) + total;
    }
    
    // Criar venda
    const novaVenda = {
        id: window.utils.generateId(),
        clienteId,
        clienteNome,
        armazemId,
        armazemNome,
        funcionarioNome,
        itens: itensVenda,
        total,
        status: 'Concluída',
        createdAt: new Date().toISOString()
    };
    
    // Adicionar venda
    dadosExemplo.vendas.push(novaVenda);
    
    // Salvar dados no localStorage
    window.utils.saveToLocalStorage('dadosExemplo', dadosExemplo);
    
    // Fechar modal
    const modalVenda = document.getElementById('modal-venda');
    window.utils.closeModal(modalVenda);
    
    // Mostrar mensagem de sucesso
    alert('Venda realizada com sucesso!');
    
    // Atualizar lista de vendas
    updateVendaList();
}

// Atualizar lista de clientes
function updateClienteList() {
    console.log('Atualizando lista de clientes...');
    
    // Verificar se estamos na página de clientes
    const clientesTableBody = document.getElementById('clientes-table-body');
    if (!clientesTableBody) {
        console.log('Não estamos na página de clientes. Ignorando atualização da lista.');
        return;
    }
    
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.clientes) return;
    
    // Limpar tabela
    clientesTableBody.innerHTML = '';
    
    // Adicionar clientes à tabela
    dadosExemplo.clientes.forEach(cliente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.nome}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.cadastradoPor || 'Não informado'}</td>
            <td>${window.utils.formatDate(cliente.createdAt)}</td>
            <td>${cliente.status}</td>
            <td class="table-actions">
                <button class="view" onclick="visualizarCliente('${cliente.id}')"><i class="fas fa-eye"></i></button>
                <button class="edit" onclick="editarCliente('${cliente.id}')"><i class="fas fa-edit"></i></button>
                <button class="delete" onclick="excluirCliente('${cliente.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        clientesTableBody.appendChild(row);
    });
}

// Atualizar lista de vendas
function updateVendaList() {
    console.log('Atualizando lista de vendas...');
    
    // Verificar se estamos na página de vendas
    const vendasTableBody = document.getElementById('vendas-table-body');
    if (!vendasTableBody) {
        console.log('Não estamos na página de vendas. Ignorando atualização da lista.');
        return;
    }
    
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.vendas) return;
    
    // Limpar tabela
    vendasTableBody.innerHTML = '';
    
    // Adicionar vendas à tabela
    dadosExemplo.vendas.forEach(venda => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${venda.id.substring(0, 8)}</td>
            <td>${venda.clienteNome}</td>
            <td>${venda.armazemNome}</td>
            <td>${venda.itens.length} itens</td>
            <td>${window.utils.formatCurrency(venda.total)}</td>
            <td>${window.utils.formatDate(venda.createdAt)}</td>
            <td>${venda.status}</td>
            <td class="table-actions">
                <button class="view" onclick="visualizarVenda('${venda.id}')"><i class="fas fa-eye"></i></button>
            </td>
        `;
        vendasTableBody.appendChild(row);
    });
}

// Função global para editar cliente
window.editarCliente = function(id) {
    openClienteModal(id);
};

// Função global para excluir cliente
window.excluirCliente = function(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        // Obter dados do localStorage
        const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
        if (!dadosExemplo || !dadosExemplo.clientes) return;
        
        // Encontrar cliente
        const cliente = dadosExemplo.clientes.find(c => c.id === id);
        if (!cliente) return;
        
        // Verificar se há vendas associadas a este cliente
        if (dadosExemplo.vendas && dadosExemplo.vendas.some(v => v.clienteId === id)) {
            alert('Não é possível excluir este cliente pois há vendas associadas a ele.');
            return;
        }
        
        // Remover cliente
        dadosExemplo.clientes = dadosExemplo.clientes.filter(c => c.id !== id);
        
        // Remover usuário
        const usuarios = window.utils.getFromLocalStorage('usuarios') || [];
        const userIndex = usuarios.findIndex(u => u.email === cliente.email);
        
        if (userIndex !== -1) {
            usuarios.splice(userIndex, 1);
            window.utils.saveToLocalStorage('usuarios', usuarios);
        }
        
        // Salvar dados no localStorage
        window.utils.saveToLocalStorage('dadosExemplo', dadosExemplo);
        
        // Atualizar lista de clientes
        updateClienteList();
        
        // Mostrar mensagem de sucesso
        alert('Cliente excluído com sucesso!');
    }
};

// Função global para visualizar cliente
window.visualizarCliente = function(id) {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.clientes) return;
    
    // Encontrar cliente
    const cliente = dadosExemplo.clientes.find(c => c.id === id);
    if (!cliente) {
        alert('Cliente não encontrado.');
        return;
    }
    
    // Filtrar vendas deste cliente
    const vendasCliente = dadosExemplo.vendas ? 
        dadosExemplo.vendas.filter(v => v.clienteId === id) : 
        [];
    
    // Calcular total de compras
    let totalCompras = 0;
    vendasCliente.forEach(venda => {
        totalCompras += venda.total;
    });
    
    // Criar lista de vendas
    let vendasHTML = '';
    if (vendasCliente.length > 0) {
        vendasHTML = '<h4>Histórico de Compras</h4><ul>';
        vendasCliente.forEach(venda => {
            vendasHTML += `<li>Venda #${venda.id.substring(0, 8)} - ${window.utils.formatDate(venda.createdAt)} - ${window.utils.formatCurrency(venda.total)}</li>`;
        });
        vendasHTML += '</ul>';
    } else {
        vendasHTML = '<p>Nenhuma compra realizada por este cliente.</p>';
    }
    
    // Criar modal de visualização
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Detalhes do Cliente</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="cliente-detalhes">
                    <h3>${cliente.nome}</h3>
                    <p><strong>Email:</strong> ${cliente.email}</p>
                    <p><strong>Telefone:</strong> ${cliente.telefone || 'Não informado'}</p>
                    <p><strong>Endereço:</strong> ${cliente.endereco || 'Não informado'}</p>
                    <p><strong>Cadastrado por:</strong> ${cliente.cadastradoPor || 'Não informado'}</p>
                    <p><strong>Status:</strong> ${cliente.status}</p>
                    <p><strong>Data de Cadastro:</strong> ${window.utils.formatDate(cliente.createdAt)}</p>
                    <p><strong>Última Atualização:</strong> ${window.utils.formatDate(cliente.updatedAt)}</p>
                    <p><strong>Total de Compras:</strong> ${window.utils.formatCurrency(totalCompras)}</p>
                    
                    <div class="vendas-cliente">
                        ${vendasHTML}
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

// Função global para visualizar venda
window.visualizarVenda = function(id) {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.vendas) return;
    
    // Encontrar venda
    const venda = dadosExemplo.vendas.find(v => v.id === id);
    if (!venda) {
        alert('Venda não encontrada.');
        return;
    }
    
    // Criar lista de itens
    let itensHTML = '<h4>Itens da Venda</h4><table class="table-itens-venda">';
    itensHTML += '<thead><tr><th>Produto</th><th>Quantidade</th><th>Preço</th><th>Subtotal</th></tr></thead><tbody>';
    
    venda.itens.forEach(item => {
        itensHTML += `
            <tr>
                <td>${item.produtoNome}</td>
                <td>${item.quantidade}</td>
                <td>${window.utils.formatCurrency(item.preco)}</td>
                <td>${window.utils.formatCurrency(item.subtotal)}</td>
            </tr>
        `;
    });
    
    itensHTML += '</tbody></table>';
    
    // Criar modal de visualização
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Detalhes da Venda</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="venda-detalhes">
                    <h3>Venda #${venda.id.substring(0, 8)}</h3>
                    <p><strong>Cliente:</strong> ${venda.clienteNome}</p>
                    <p><strong>Armazém:</strong> ${venda.armazemNome}</p>
                    <p><strong>Funcionário:</strong> ${venda.funcionarioNome}</p>
                    <p><strong>Data:</strong> ${window.utils.formatDate(venda.createdAt)}</p>
                    <p><strong>Status:</strong> ${venda.status}</p>
                    <p><strong>Total:</strong> ${window.utils.formatCurrency(venda.total)}</p>
                    
                    <div class="itens-venda">
                        ${itensHTML}
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

// Exportar funções
window.funcionarioModalManagement = {
    init: initFuncionarioModalManagement,
    loadFuncionarioModals,
    setupFuncionarioAddButtons,
    openClienteModal,
    openVendaModal,
    fillClientesCombobox,
    fillArmazensCombobox,
    fillProdutosCombobox,
    setupClienteModalEvents,
    setupVendaModalEvents,
    adicionarProdutoVenda,
    updateVendaTotal,
    saveCliente,
    finalizarVenda,
    updateClienteList,
    updateVendaList
};

// Inicializar gestão de modais quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar carregamento dos componentes
    setTimeout(initFuncionarioModalManagement, 1000);
});
