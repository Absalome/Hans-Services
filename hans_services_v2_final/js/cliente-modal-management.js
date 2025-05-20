/**
 * Script para gestão de modais e formulários do cliente
 * Implementa a lógica de interação para realizar compras e visualizar histórico
 */

// Função para inicializar gestão de modais do cliente
function initClienteModalManagement() {
    console.log('Inicializando gestão de modais do cliente...');
    
    // Carregar modais
    loadClienteModals();
    
    // Configurar eventos dos botões
    setupClienteButtons();
    
    console.log('Gestão de modais do cliente inicializada com sucesso!');
}

// Carregar modais do cliente
function loadClienteModals() {
    console.log('Carregando modais do cliente...');
    
    // Verificar se o container de modais existe
    if (!document.getElementById('modals-container')) {
        const modalsContainer = document.createElement('div');
        modalsContainer.id = 'modals-container';
        document.body.appendChild(modalsContainer);
    }
    
    // Carregar modal de compra
    fetch('components/modals/compra.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('modals-container').innerHTML += html;
            setupCompraModalEvents();
        })
        .catch(error => {
            console.error('Erro ao carregar modal de compra:', error);
        });
    
    // Carregar modal de alteração de senha
    fetch('components/modals/senha.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('modals-container').innerHTML += html;
            setupSenhaModalEvents();
        })
        .catch(error => {
            console.error('Erro ao carregar modal de alteração de senha:', error);
        });
}

// Configurar eventos dos botões
function setupClienteButtons() {
    console.log('Configurando eventos dos botões do cliente...');
    
    // Botão de realizar compra
    document.addEventListener('click', function(event) {
        if (event.target && (event.target.id === 'btn-realizar-compra' || event.target.closest('#btn-realizar-compra'))) {
            openCompraModal();
        }
    });
    
    // Botão de alterar senha
    document.addEventListener('click', function(event) {
        if (event.target && (event.target.id === 'btn-alterar-senha' || event.target.closest('#btn-alterar-senha'))) {
            openSenhaModal();
        }
    });
}

// Abrir modal de compra
function openCompraModal() {
    console.log('Abrindo modal de compra...');
    
    const modalCompra = document.getElementById('modal-compra');
    if (!modalCompra) {
        console.error('Modal de compra não encontrado!');
        return;
    }
    
    // Resetar formulário
    document.getElementById('form-compra').reset();
    
    // Preencher combobox de armazéns
    fillArmazensCombobox('compra-armazem');
    
    // Limpar lista de produtos
    document.getElementById('compra-produtos-lista').innerHTML = '';
    
    // Atualizar total
    updateCompraTotal();
    
    // Abrir modal
    window.utils.openModal(modalCompra);
}

// Abrir modal de alteração de senha
function openSenhaModal() {
    console.log('Abrindo modal de alteração de senha...');
    
    const modalSenha = document.getElementById('modal-senha');
    if (!modalSenha) {
        console.error('Modal de alteração de senha não encontrado!');
        return;
    }
    
    // Resetar formulário
    document.getElementById('form-senha').reset();
    
    // Abrir modal
    window.utils.openModal(modalSenha);
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
        option.setAttribute('data-imagem', produto.imagem || '../img/produtos/produto_default.jpg');
        select.appendChild(option);
    });
}

// Configurar eventos do modal de compra
function setupCompraModalEvents() {
    console.log('Configurando eventos do modal de compra...');
    
    const modalCompra = document.getElementById('modal-compra');
    if (!modalCompra) {
        console.error('Modal de compra não encontrado!');
        return;
    }
    
    // Evento de mudança de armazém
    const armazemSelect = document.getElementById('compra-armazem');
    if (armazemSelect) {
        armazemSelect.addEventListener('change', function() {
            const armazemId = this.value;
            if (armazemId) {
                fillProdutosCombobox('compra-produto', armazemId);
                document.getElementById('compra-produto-container').style.display = 'block';
            } else {
                document.getElementById('compra-produto-container').style.display = 'none';
            }
        });
    }
    
    // Evento de mudança de produto
    const produtoSelect = document.getElementById('compra-produto');
    if (produtoSelect) {
        produtoSelect.addEventListener('change', function() {
            const produtoId = this.value;
            if (produtoId) {
                const option = this.options[this.selectedIndex];
                const quantidade = parseInt(option.getAttribute('data-quantidade'));
                const imagem = option.getAttribute('data-imagem');
                
                // Atualizar quantidade máxima
                const quantidadeInput = document.getElementById('compra-quantidade');
                quantidadeInput.max = quantidade;
                quantidadeInput.value = 1;
                
                // Atualizar imagem do produto
                const imagemProduto = document.getElementById('compra-produto-imagem');
                imagemProduto.src = imagem;
                imagemProduto.style.display = 'block';
                
                document.getElementById('compra-quantidade-container').style.display = 'block';
                document.getElementById('compra-quantidade-disponivel').textContent = quantidade;
            } else {
                document.getElementById('compra-quantidade-container').style.display = 'none';
                document.getElementById('compra-produto-imagem').style.display = 'none';
            }
        });
    }
    
    // Botão de adicionar produto
    const btnAdicionarProduto = document.getElementById('btn-adicionar-produto-compra');
    if (btnAdicionarProduto) {
        btnAdicionarProduto.addEventListener('click', adicionarProdutoCompra);
    }
    
    // Botão de cancelar
    const btnCancelarCompra = document.getElementById('btn-cancelar-compra');
    if (btnCancelarCompra) {
        btnCancelarCompra.addEventListener('click', function() {
            window.utils.closeModal(modalCompra);
        });
    }
    
    // Botão de finalizar compra
    const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
    if (btnFinalizarCompra) {
        btnFinalizarCompra.addEventListener('click', finalizarCompra);
    }
    
    // Botão de fechar
    const closeButtons = modalCompra.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.utils.closeModal(modalCompra);
        });
    });
    
    // Fechar ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === modalCompra) {
            window.utils.closeModal(modalCompra);
        }
    });
}

// Configurar eventos do modal de alteração de senha
function setupSenhaModalEvents() {
    console.log('Configurando eventos do modal de alteração de senha...');
    
    const modalSenha = document.getElementById('modal-senha');
    if (!modalSenha) {
        console.error('Modal de alteração de senha não encontrado!');
        return;
    }
    
    // Botão de cancelar
    const btnCancelarSenha = document.getElementById('btn-cancelar-senha');
    if (btnCancelarSenha) {
        btnCancelarSenha.addEventListener('click', function() {
            window.utils.closeModal(modalSenha);
        });
    }
    
    // Botão de salvar
    const btnSalvarSenha = document.getElementById('btn-salvar-senha');
    if (btnSalvarSenha) {
        btnSalvarSenha.addEventListener('click', alterarSenha);
    }
    
    // Botão de fechar
    const closeButtons = modalSenha.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.utils.closeModal(modalSenha);
        });
    });
    
    // Fechar ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === modalSenha) {
            window.utils.closeModal(modalSenha);
        }
    });
}

// Adicionar produto à compra
function adicionarProdutoCompra() {
    console.log('Adicionando produto à compra...');
    
    // Obter dados do produto
    const produtoSelect = document.getElementById('compra-produto');
    const produtoId = produtoSelect.value;
    
    if (!produtoId) {
        alert('Por favor, selecione um produto.');
        return;
    }
    
    const produtoOption = produtoSelect.options[produtoSelect.selectedIndex];
    const produtoNome = produtoOption.textContent.split(' - ')[0];
    const produtoPreco = parseFloat(produtoOption.getAttribute('data-preco'));
    const produtoQuantidadeDisponivel = parseInt(produtoOption.getAttribute('data-quantidade'));
    const produtoImagem = produtoOption.getAttribute('data-imagem');
    
    // Obter quantidade
    const quantidadeInput = document.getElementById('compra-quantidade');
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
    const produtosLista = document.getElementById('compra-produtos-lista');
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
            <div class="produto-imagem">
                <img src="${produtoImagem}" alt="${produtoNome}">
            </div>
            <div class="produto-info">
                <span class="produto-nome">${produtoNome}</span>
                <span class="produto-preco">${window.utils.formatCurrency(produtoPreco)}</span>
                <span class="produto-quantidade">${quantidade}</span>
                <span class="produto-subtotal">${window.utils.formatCurrency(subtotal)}</span>
            </div>
            <button class="btn-remover-produto" onclick="removerProdutoCompra('${produtoId}')">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        produtosLista.appendChild(produtoItem);
    }
    
    // Resetar campos
    produtoSelect.value = '';
    quantidadeInput.value = '';
    document.getElementById('compra-quantidade-container').style.display = 'none';
    document.getElementById('compra-produto-imagem').style.display = 'none';
    
    // Atualizar total
    updateCompraTotal();
}

// Remover produto da compra
window.removerProdutoCompra = function(produtoId) {
    console.log(`Removendo produto ${produtoId} da compra...`);
    
    const produtosLista = document.getElementById('compra-produtos-lista');
    const produtoItem = produtosLista.querySelector(`[data-id="${produtoId}"]`);
    
    if (produtoItem) {
        produtosLista.removeChild(produtoItem);
        
        // Atualizar total
        updateCompraTotal();
    }
};

// Atualizar total da compra
function updateCompraTotal() {
    console.log('Atualizando total da compra...');
    
    const produtosLista = document.getElementById('compra-produtos-lista');
    const produtosItems = produtosLista.querySelectorAll('.produto-item');
    
    let total = 0;
    
    produtosItems.forEach(item => {
        const subtotal = parseFloat(item.getAttribute('data-subtotal'));
        total += subtotal;
    });
    
    const totalSpan = document.getElementById('compra-total');
    totalSpan.textContent = window.utils.formatCurrency(total);
    
    // Habilitar/desabilitar botão de finalizar compra
    const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
    const armazemSelect = document.getElementById('compra-armazem');
    
    if (produtosItems.length > 0 && armazemSelect.value) {
        btnFinalizarCompra.removeAttribute('disabled');
    } else {
        btnFinalizarCompra.setAttribute('disabled', 'disabled');
    }
}

// Finalizar compra
function finalizarCompra() {
    console.log('Finalizando compra...');
    
    // Obter armazém
    const armazemSelect = document.getElementById('compra-armazem');
    const armazemId = armazemSelect.value;
    
    if (!armazemId) {
        alert('Por favor, selecione um armazém.');
        return;
    }
    
    // Obter produtos
    const produtosLista = document.getElementById('compra-produtos-lista');
    const produtosItems = produtosLista.querySelectorAll('.produto-item');
    
    if (produtosItems.length === 0) {
        alert('Por favor, adicione pelo menos um produto à compra.');
        return;
    }
    
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo') || {};
    
    // Inicializar arrays se não existirem
    if (!dadosExemplo.vendas) dadosExemplo.vendas = [];
    if (!dadosExemplo.produtos) dadosExemplo.produtos = [];
    if (!dadosExemplo.armazens) dadosExemplo.armazens = [];
    
    // Obter dados do cliente logado
    const usuarioLogado = window.utils.getFromLocalStorage('usuarioLogado');
    const clienteNome = usuarioLogado ? usuarioLogado.nome : 'Cliente';
    const clienteId = usuarioLogado ? usuarioLogado.id : 'cliente-id';
    
    // Obter dados do armazém
    const armazem = dadosExemplo.armazens.find(a => a.id === armazemId);
    const armazemNome = armazem ? armazem.nome : 'Armazém não encontrado';
    
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
        funcionarioNome: 'Compra Online',
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
    const modalCompra = document.getElementById('modal-compra');
    window.utils.closeModal(modalCompra);
    
    // Mostrar mensagem de sucesso
    alert('Compra realizada com sucesso!');
    
    // Atualizar histórico de compras
    updateHistoricoCompras();
}

// Alterar senha
function alterarSenha() {
    console.log('Alterando senha...');
    
    // Obter dados do formulário
    const senhaAtual = document.getElementById('senha-atual').value;
    const novaSenha = document.getElementById('nova-senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;
    
    // Validar campos
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    if (novaSenha !== confirmarSenha) {
        alert('A nova senha e a confirmação não coincidem.');
        return;
    }
    
    // Obter usuário logado
    const usuarioLogado = window.utils.getFromLocalStorage('usuarioLogado');
    if (!usuarioLogado) {
        alert('Usuário não encontrado. Por favor, faça login novamente.');
        return;
    }
    
    // Obter usuários
    const usuarios = window.utils.getFromLocalStorage('usuarios') || [];
    const userIndex = usuarios.findIndex(u => u.email === usuarioLogado.email);
    
    if (userIndex === -1) {
        alert('Usuário não encontrado. Por favor, faça login novamente.');
        return;
    }
    
    // Verificar senha atual
    if (usuarios[userIndex].password !== senhaAtual) {
        alert('Senha atual incorreta.');
        return;
    }
    
    // Atualizar senha
    usuarios[userIndex].password = novaSenha;
    
    // Salvar dados no localStorage
    window.utils.saveToLocalStorage('usuarios', usuarios);
    
    // Fechar modal
    const modalSenha = document.getElementById('modal-senha');
    window.utils.closeModal(modalSenha);
    
    // Mostrar mensagem de sucesso
    alert('Senha alterada com sucesso!');
}

// Atualizar histórico de compras
function updateHistoricoCompras() {
    console.log('Atualizando histórico de compras...');
    
    // Verificar se estamos na página de histórico
    const historicoContainer = document.getElementById('historico-compras-container');
    if (!historicoContainer) {
        console.log('Não estamos na página de histórico. Ignorando atualização.');
        return;
    }
    
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.vendas) return;
    
    // Obter usuário logado
    const usuarioLogado = window.utils.getFromLocalStorage('usuarioLogado');
    if (!usuarioLogado) return;
    
    // Filtrar vendas do cliente
    const vendasCliente = dadosExemplo.vendas.filter(v => v.clienteId === usuarioLogado.id);
    
    // Limpar container
    historicoContainer.innerHTML = '';
    
    if (vendasCliente.length === 0) {
        historicoContainer.innerHTML = '<p class="no-data">Nenhuma compra realizada.</p>';
        return;
    }
    
    // Ordenar vendas por data (mais recentes primeiro)
    vendasCliente.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Adicionar vendas ao container
    vendasCliente.forEach(venda => {
        const vendaCard = document.createElement('div');
        vendaCard.className = 'venda-card';
        
        // Criar lista de itens
        let itensHTML = '<ul class="itens-venda">';
        venda.itens.forEach(item => {
            itensHTML += `<li>${item.quantidade}x ${item.produtoNome} - ${window.utils.formatCurrency(item.subtotal)}</li>`;
        });
        itensHTML += '</ul>';
        
        vendaCard.innerHTML = `
            <div class="venda-header">
                <h3>Compra #${venda.id.substring(0, 8)}</h3>
                <span class="venda-data">${window.utils.formatDate(venda.createdAt)}</span>
            </div>
            <div class="venda-body">
                <p><strong>Armazém:</strong> ${venda.armazemNome}</p>
                <p><strong>Status:</strong> ${venda.status}</p>
                <p><strong>Total:</strong> ${window.utils.formatCurrency(venda.total)}</p>
                <div class="venda-itens">
                    <p><strong>Itens:</strong></p>
                    ${itensHTML}
                </div>
            </div>
        `;
        
        historicoContainer.appendChild(vendaCard);
    });
}

// Exportar funções
window.clienteModalManagement = {
    init: initClienteModalManagement,
    loadClienteModals,
    setupClienteButtons,
    openCompraModal,
    openSenhaModal,
    fillArmazensCombobox,
    fillProdutosCombobox,
    setupCompraModalEvents,
    setupSenhaModalEvents,
    adicionarProdutoCompra,
    updateCompraTotal,
    finalizarCompra,
    alterarSenha,
    updateHistoricoCompras
};

// Inicializar gestão de modais quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar carregamento dos componentes
    setTimeout(initClienteModalManagement, 1000);
});
