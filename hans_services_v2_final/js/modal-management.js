/**
 * Script para gestão de modais e formulários do administrador
 * Implementa a lógica de interação para adicionar, editar e excluir produtos, armazéns e funcionários
 */

// Função para inicializar gestão de modais
function initModalManagement() {
    console.log('Inicializando gestão de modais...');
    
    // Carregar modais
    loadAdminModals();
    
    // Configurar eventos dos botões de adicionar
    setupAddButtons();
    
    console.log('Gestão de modais inicializada com sucesso!');
}

// Carregar modais do administrador
function loadAdminModals() {
    console.log('Carregando modais do administrador...');
    
    // Verificar se o container de modais existe
    if (!document.getElementById('modals-container')) {
        const modalsContainer = document.createElement('div');
        modalsContainer.id = 'modals-container';
        document.body.appendChild(modalsContainer);
    }
    
    // Carregar modal de produto
    fetch('components/modals/produto.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('modals-container').innerHTML += html;
            setupProductModalEvents();
        })
        .catch(error => {
            console.error('Erro ao carregar modal de produto:', error);
        });
    
    // Carregar modal de armazém
    fetch('components/modals/armazem.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('modals-container').innerHTML += html;
            setupArmazemModalEvents();
        })
        .catch(error => {
            console.error('Erro ao carregar modal de armazém:', error);
        });
    
    // Carregar modal de funcionário
    fetch('components/modals/funcionario.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('modals-container').innerHTML += html;
            setupFuncionarioModalEvents();
        })
        .catch(error => {
            console.error('Erro ao carregar modal de funcionário:', error);
        });
}

// Configurar eventos dos botões de adicionar
function setupAddButtons() {
    console.log('Configurando eventos dos botões de adicionar...');
    
    // Botão de adicionar produto
    document.addEventListener('click', function(event) {
        if (event.target && (event.target.id === 'btn-adicionar-produto' || event.target.closest('#btn-adicionar-produto'))) {
            openProductModal();
        }
    });
    
    // Botão de adicionar armazém
    document.addEventListener('click', function(event) {
        if (event.target && (event.target.id === 'btn-adicionar-armazem' || event.target.closest('#btn-adicionar-armazem'))) {
            openArmazemModal();
        }
    });
    
    // Botão de adicionar funcionário
    document.addEventListener('click', function(event) {
        if (event.target && (event.target.id === 'btn-adicionar-funcionario' || event.target.closest('#btn-adicionar-funcionario'))) {
            openFuncionarioModal();
        }
    });
}

// Abrir modal de produto
function openProductModal(produtoId = null) {
    console.log('Abrindo modal de produto...');
    
    const modalProduto = document.getElementById('modal-produto');
    if (!modalProduto) {
        console.error('Modal de produto não encontrado!');
        return;
    }
    
    // Resetar formulário
    document.getElementById('form-produto').reset();
    
    // Remover ID do formulário
    document.getElementById('form-produto').removeAttribute('data-id');
    
    // Resetar preview de imagem
    const imagemPreview = document.getElementById('produto-imagem-preview');
    imagemPreview.innerHTML = `
        <div class="image-preview-placeholder">
            <i class="fas fa-image"></i>
            <p>Selecione uma imagem</p>
        </div>
    `;
    
    // Preencher combobox de armazéns
    fillArmazensCombobox('produto-armazem');
    
    // Verificar se é edição
    if (produtoId) {
        // Obter dados do produto
        const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
        if (!dadosExemplo || !dadosExemplo.produtos) return;
        
        const produto = dadosExemplo.produtos.find(p => p.id === produtoId);
        if (!produto) {
            console.error('Produto não encontrado!');
            return;
        }
        
        // Preencher formulário
        document.getElementById('produto-nome').value = produto.nome;
        document.getElementById('produto-descricao').value = produto.descricao || '';
        document.getElementById('produto-armazem').value = produto.armazem;
        document.getElementById('produto-quantidade').value = produto.quantidade;
        document.getElementById('produto-preco').value = produto.preco;
        document.getElementById('produto-categoria').value = produto.categoria || '';
        
        // Preencher preview de imagem
        if (produto.imagem) {
            imagemPreview.innerHTML = `<img src="${produto.imagem}" alt="${produto.nome}">`;
        }
        
        // Adicionar ID ao formulário
        document.getElementById('form-produto').setAttribute('data-id', produtoId);
        
        // Atualizar título do modal
        document.getElementById('modal-produto-title').textContent = 'Editar Produto';
    } else {
        // Atualizar título do modal
        document.getElementById('modal-produto-title').textContent = 'Adicionar Produto';
    }
    
    // Abrir modal
    window.utils.openModal(modalProduto);
}

// Abrir modal de armazém
function openArmazemModal(armazemId = null) {
    console.log('Abrindo modal de armazém...');
    
    const modalArmazem = document.getElementById('modal-armazem');
    if (!modalArmazem) {
        console.error('Modal de armazém não encontrado!');
        return;
    }
    
    // Resetar formulário
    document.getElementById('form-armazem').reset();
    
    // Remover ID do formulário
    document.getElementById('form-armazem').removeAttribute('data-id');
    
    // Preencher combobox de funcionários
    fillFuncionariosCombobox('armazem-responsavel');
    
    // Verificar se é edição
    if (armazemId) {
        // Obter dados do armazém
        const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
        if (!dadosExemplo || !dadosExemplo.armazens) return;
        
        const armazem = dadosExemplo.armazens.find(a => a.id === armazemId);
        if (!armazem) {
            console.error('Armazém não encontrado!');
            return;
        }
        
        // Preencher formulário
        document.getElementById('armazem-nome').value = armazem.nome;
        document.getElementById('armazem-localizacao').value = armazem.localizacao;
        document.getElementById('armazem-responsavel').value = armazem.responsavelId || '';
        document.getElementById('armazem-descricao').value = armazem.descricao || '';
        
        // Adicionar ID ao formulário
        document.getElementById('form-armazem').setAttribute('data-id', armazemId);
        
        // Atualizar título do modal
        document.getElementById('modal-armazem-title').textContent = 'Editar Armazém';
    } else {
        // Atualizar título do modal
        document.getElementById('modal-armazem-title').textContent = 'Adicionar Armazém';
    }
    
    // Abrir modal
    window.utils.openModal(modalArmazem);
}

// Abrir modal de funcionário
function openFuncionarioModal(funcionarioId = null) {
    console.log('Abrindo modal de funcionário...');
    
    const modalFuncionario = document.getElementById('modal-funcionario');
    if (!modalFuncionario) {
        console.error('Modal de funcionário não encontrado!');
        return;
    }
    
    // Resetar formulário
    document.getElementById('form-funcionario').reset();
    
    // Remover ID do formulário
    document.getElementById('form-funcionario').removeAttribute('data-id');
    
    // Preencher combobox de armazéns
    fillArmazensCombobox('funcionario-armazem');
    
    // Definir data mínima como hoje
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('funcionario-data').value = hoje;
    
    // Verificar se é edição
    if (funcionarioId) {
        // Obter dados do funcionário
        const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
        if (!dadosExemplo || !dadosExemplo.funcionarios) return;
        
        const funcionario = dadosExemplo.funcionarios.find(f => f.id === funcionarioId);
        if (!funcionario) {
            console.error('Funcionário não encontrado!');
            return;
        }
        
        // Preencher formulário
        document.getElementById('funcionario-nome').value = funcionario.nome;
        document.getElementById('funcionario-email').value = funcionario.email;
        document.getElementById('funcionario-telefone').value = funcionario.telefone || '';
        document.getElementById('funcionario-cargo').value = funcionario.cargo;
        document.getElementById('funcionario-armazem').value = funcionario.armazemId || '';
        document.getElementById('funcionario-data').value = funcionario.dataContratacao;
        
        // Campos de senha ficam vazios na edição
        document.getElementById('funcionario-senha').removeAttribute('required');
        document.getElementById('funcionario-confirmar-senha').removeAttribute('required');
        
        // Adicionar ID ao formulário
        document.getElementById('form-funcionario').setAttribute('data-id', funcionarioId);
        
        // Atualizar título do modal
        document.getElementById('modal-funcionario-title').textContent = 'Editar Funcionário';
    } else {
        // Atualizar título do modal
        document.getElementById('modal-funcionario-title').textContent = 'Adicionar Funcionário';
        
        // Campos de senha são obrigatórios na adição
        document.getElementById('funcionario-senha').setAttribute('required', 'required');
        document.getElementById('funcionario-confirmar-senha').setAttribute('required', 'required');
    }
    
    // Abrir modal
    window.utils.openModal(modalFuncionario);
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

// Preencher combobox de funcionários
function fillFuncionariosCombobox(selectId) {
    console.log(`Preenchendo combobox de funcionários (${selectId})...`);
    
    const select = document.getElementById(selectId);
    if (!select) {
        console.error(`Combobox de funcionários (${selectId}) não encontrado!`);
        return;
    }
    
    // Limpar combobox
    select.innerHTML = '<option value="">Selecione um funcionário</option>';
    
    // Obter dados de funcionários
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.funcionarios) return;
    
    // Preencher combobox
    dadosExemplo.funcionarios.forEach(funcionario => {
        const option = document.createElement('option');
        option.value = funcionario.id;
        option.textContent = funcionario.nome;
        select.appendChild(option);
    });
}

// Configurar eventos do modal de produto
function setupProductModalEvents() {
    console.log('Configurando eventos do modal de produto...');
    
    const modalProduto = document.getElementById('modal-produto');
    if (!modalProduto) {
        console.error('Modal de produto não encontrado!');
        return;
    }
    
    // Configurar preview de imagem
    const imagemInput = document.getElementById('produto-imagem-input');
    const imagemPreview = document.getElementById('produto-imagem-preview');
    
    if (imagemInput && imagemPreview) {
        imagemInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    imagemPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    // Botão de cancelar
    const btnCancelarProduto = document.getElementById('btn-cancelar-produto');
    if (btnCancelarProduto) {
        btnCancelarProduto.addEventListener('click', function() {
            window.utils.closeModal(modalProduto);
        });
    }
    
    // Botão de salvar
    const btnSalvarProduto = document.getElementById('btn-salvar-produto');
    if (btnSalvarProduto) {
        btnSalvarProduto.addEventListener('click', saveProduto);
    }
    
    // Botão de fechar
    const closeButtons = modalProduto.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.utils.closeModal(modalProduto);
        });
    });
    
    // Fechar ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === modalProduto) {
            window.utils.closeModal(modalProduto);
        }
    });
}

// Configurar eventos do modal de armazém
function setupArmazemModalEvents() {
    console.log('Configurando eventos do modal de armazém...');
    
    const modalArmazem = document.getElementById('modal-armazem');
    if (!modalArmazem) {
        console.error('Modal de armazém não encontrado!');
        return;
    }
    
    // Botão de cancelar
    const btnCancelarArmazem = document.getElementById('btn-cancelar-armazem');
    if (btnCancelarArmazem) {
        btnCancelarArmazem.addEventListener('click', function() {
            window.utils.closeModal(modalArmazem);
        });
    }
    
    // Botão de salvar
    const btnSalvarArmazem = document.getElementById('btn-salvar-armazem');
    if (btnSalvarArmazem) {
        btnSalvarArmazem.addEventListener('click', saveArmazem);
    }
    
    // Botão de fechar
    const closeButtons = modalArmazem.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.utils.closeModal(modalArmazem);
        });
    });
    
    // Fechar ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === modalArmazem) {
            window.utils.closeModal(modalArmazem);
        }
    });
}

// Configurar eventos do modal de funcionário
function setupFuncionarioModalEvents() {
    console.log('Configurando eventos do modal de funcionário...');
    
    const modalFuncionario = document.getElementById('modal-funcionario');
    if (!modalFuncionario) {
        console.error('Modal de funcionário não encontrado!');
        return;
    }
    
    // Botão de cancelar
    const btnCancelarFuncionario = document.getElementById('btn-cancelar-funcionario');
    if (btnCancelarFuncionario) {
        btnCancelarFuncionario.addEventListener('click', function() {
            window.utils.closeModal(modalFuncionario);
        });
    }
    
    // Botão de salvar
    const btnSalvarFuncionario = document.getElementById('btn-salvar-funcionario');
    if (btnSalvarFuncionario) {
        btnSalvarFuncionario.addEventListener('click', saveFuncionario);
    }
    
    // Botão de fechar
    const closeButtons = modalFuncionario.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.utils.closeModal(modalFuncionario);
        });
    });
    
    // Fechar ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === modalFuncionario) {
            window.utils.closeModal(modalFuncionario);
        }
    });
}

// Salvar produto
function saveProduto() {
    console.log('Salvando produto...');
    
    // Obter dados do formulário
    const nome = document.getElementById('produto-nome').value;
    const descricao = document.getElementById('produto-descricao').value;
    const armazemId = document.getElementById('produto-armazem').value;
    const quantidade = parseInt(document.getElementById('produto-quantidade').value);
    const preco = parseFloat(document.getElementById('produto-preco').value);
    const categoriaId = document.getElementById('produto-categoria').value;
    
    // Validar campos obrigatórios
    if (!nome || !armazemId || isNaN(quantidade) || isNaN(preco)) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo') || {};
    
    // Inicializar arrays se não existirem
    if (!dadosExemplo.produtos) dadosExemplo.produtos = [];
    if (!dadosExemplo.armazens) dadosExemplo.armazens = [];
    
    // Obter nome do armazém
    const armazem = dadosExemplo.armazens.find(a => a.id === armazemId);
    const armazemNome = armazem ? armazem.nome : 'Armazém não encontrado';
    
    // Obter nome da categoria
    let categoriaNome = '';
    if (categoriaId === '1') categoriaNome = 'Alimentos';
    else if (categoriaId === '2') categoriaNome = 'Bebidas';
    else if (categoriaId === '3') categoriaNome = 'Limpeza';
    else if (categoriaId === '4') categoriaNome = 'Eletrônicos';
    else if (categoriaId === '5') categoriaNome = 'Vestuário';
    else categoriaNome = 'Sem categoria';
    
    // Processar imagem
    const imagemPreview = document.getElementById('produto-imagem-preview');
    const imagemSrc = imagemPreview.querySelector('img') ? 
        imagemPreview.querySelector('img').src : 
        '../img/produtos/produto_default.jpg';
    
    // Verificar se é edição ou adição
    const formProduto = document.getElementById('form-produto');
    const produtoId = formProduto.getAttribute('data-id');
    
    if (produtoId) {
        // Edição de produto existente
        const index = dadosExemplo.produtos.findIndex(p => p.id === produtoId);
        
        if (index !== -1) {
            // Atualizar produto
            dadosExemplo.produtos[index] = {
                ...dadosExemplo.produtos[index],
                nome,
                descricao,
                armazem: armazemId,
                armazemNome,
                quantidade,
                preco,
                categoria: categoriaId,
                categoriaNome,
                imagem: imagemSrc,
                updatedAt: new Date().toISOString()
            };
            
            // Mostrar mensagem de sucesso
            alert('Produto atualizado com sucesso!');
        } else {
            console.error('Produto não encontrado para edição!');
            alert('Erro ao atualizar produto. Produto não encontrado!');
            return;
        }
    } else {
        // Adição de novo produto
        const novoProduto = {
            id: window.utils.generateId(),
            nome,
            descricao,
            armazem: armazemId,
            armazemNome,
            quantidade,
            preco,
            categoria: categoriaId,
            categoriaNome,
            imagem: imagemSrc,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Adicionar produto
        dadosExemplo.produtos.push(novoProduto);
        
        // Mostrar mensagem de sucesso
        alert('Produto adicionado com sucesso!');
    }
    
    // Salvar dados no localStorage
    window.utils.saveToLocalStorage('dadosExemplo', dadosExemplo);
    
    // Fechar modal
    const modalProduto = document.getElementById('modal-produto');
    window.utils.closeModal(modalProduto);
    
    // Atualizar lista de produtos
    updateProductList();
}

// Salvar armazém
function saveArmazem() {
    console.log('Salvando armazém...');
    
    // Obter dados do formulário
    const nome = document.getElementById('armazem-nome').value;
    const localizacao = document.getElementById('armazem-localizacao').value;
    const responsavelId = document.getElementById('armazem-responsavel').value;
    const descricao = document.getElementById('armazem-descricao').value;
    
    // Validar campos obrigatórios
    if (!nome || !localizacao) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo') || {};
    
    // Inicializar arrays se não existirem
    if (!dadosExemplo.armazens) dadosExemplo.armazens = [];
    if (!dadosExemplo.funcionarios) dadosExemplo.funcionarios = [];
    
    // Obter nome do responsável
    const responsavel = dadosExemplo.funcionarios.find(f => f.id === responsavelId);
    const responsavelNome = responsavel ? responsavel.nome : '';
    
    // Verificar se é edição ou adição
    const formArmazem = document.getElementById('form-armazem');
    const armazemId = formArmazem.getAttribute('data-id');
    
    if (armazemId) {
        // Edição de armazém existente
        const index = dadosExemplo.armazens.findIndex(a => a.id === armazemId);
        
        if (index !== -1) {
            // Atualizar armazém
            dadosExemplo.armazens[index] = {
                ...dadosExemplo.armazens[index],
                nome,
                localizacao,
                responsavelId,
                responsavel: responsavelNome,
                descricao,
                updatedAt: new Date().toISOString()
            };
            
            // Mostrar mensagem de sucesso
            alert('Armazém atualizado com sucesso!');
        } else {
            console.error('Armazém não encontrado para edição!');
            alert('Erro ao atualizar armazém. Armazém não encontrado!');
            return;
        }
    } else {
        // Adição de novo armazém
        const novoArmazem = {
            id: window.utils.generateId(),
            nome,
            localizacao,
            responsavelId,
            responsavel: responsavelNome,
            descricao,
            produtos: 0,
            vendas: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Adicionar armazém
        dadosExemplo.armazens.push(novoArmazem);
        
        // Mostrar mensagem de sucesso
        alert('Armazém adicionado com sucesso!');
    }
    
    // Salvar dados no localStorage
    window.utils.saveToLocalStorage('dadosExemplo', dadosExemplo);
    
    // Fechar modal
    const modalArmazem = document.getElementById('modal-armazem');
    window.utils.closeModal(modalArmazem);
    
    // Atualizar lista de armazéns
    updateArmazemList();
}

// Salvar funcionário
function saveFuncionario() {
    console.log('Salvando funcionário...');
    
    // Obter dados do formulário
    const nome = document.getElementById('funcionario-nome').value;
    const email = document.getElementById('funcionario-email').value;
    const telefone = document.getElementById('funcionario-telefone').value;
    const cargo = document.getElementById('funcionario-cargo').value;
    const armazemId = document.getElementById('funcionario-armazem').value;
    const dataContratacao = document.getElementById('funcionario-data').value;
    const senha = document.getElementById('funcionario-senha').value;
    const confirmarSenha = document.getElementById('funcionario-confirmar-senha').value;
    
    // Validar campos obrigatórios
    if (!nome || !email || !telefone || !cargo || !armazemId || !dataContratacao) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Validar formato de email
    if (!email.endsWith('@func.com')) {
        alert('O email deve terminar com @func.com');
        return;
    }
    
    // Verificar se é edição ou adição
    const formFuncionario = document.getElementById('form-funcionario');
    const funcionarioId = formFuncionario.getAttribute('data-id');
    
    // Validar senha apenas para adição
    if (!funcionarioId) {
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
    if (!dadosExemplo.funcionarios) dadosExemplo.funcionarios = [];
    if (!dadosExemplo.armazens) dadosExemplo.armazens = [];
    
    // Obter nome do armazém
    const armazem = dadosExemplo.armazens.find(a => a.id === armazemId);
    const armazemNome = armazem ? armazem.nome : 'Armazém não encontrado';
    
    if (funcionarioId) {
        // Edição de funcionário existente
        const index = dadosExemplo.funcionarios.findIndex(f => f.id === funcionarioId);
        
        if (index !== -1) {
            // Atualizar funcionário
            dadosExemplo.funcionarios[index] = {
                ...dadosExemplo.funcionarios[index],
                nome,
                email,
                telefone,
                cargo,
                armazemId,
                armazem: armazemNome,
                dataContratacao,
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
            alert('Funcionário atualizado com sucesso!');
        } else {
            console.error('Funcionário não encontrado para edição!');
            alert('Erro ao atualizar funcionário. Funcionário não encontrado!');
            return;
        }
    } else {
        // Verificar se email já existe
        const emailExists = dadosExemplo.funcionarios.some(f => f.email === email);
        if (emailExists) {
            alert('Este email já está em uso. Por favor, escolha outro email.');
            return;
        }
        
        // Adição de novo funcionário
        const novoFuncionario = {
            id: window.utils.generateId(),
            nome,
            email,
            telefone,
            cargo,
            armazemId,
            armazem: armazemNome,
            dataContratacao,
            status: 'Ativo',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Adicionar funcionário
        dadosExemplo.funcionarios.push(novoFuncionario);
        
        // Adicionar usuário
        const usuarios = window.utils.getFromLocalStorage('usuarios') || [];
        usuarios.push({
            email,
            password: senha,
            type: 'funcionario',
            nome
        });
        
        window.utils.saveToLocalStorage('usuarios', usuarios);
        
        // Mostrar mensagem de sucesso
        alert('Funcionário adicionado com sucesso!');
    }
    
    // Salvar dados no localStorage
    window.utils.saveToLocalStorage('dadosExemplo', dadosExemplo);
    
    // Fechar modal
    const modalFuncionario = document.getElementById('modal-funcionario');
    window.utils.closeModal(modalFuncionario);
    
    // Atualizar lista de funcionários
    updateFuncionarioList();
}

// Atualizar lista de produtos
function updateProductList() {
    console.log('Atualizando lista de produtos...');
    
    // Verificar se estamos na página de produtos
    const produtosTableBody = document.getElementById('produtos-table-body');
    if (!produtosTableBody) {
        console.log('Não estamos na página de produtos. Ignorando atualização da lista.');
        return;
    }
    
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.produtos) return;
    
    // Limpar tabela
    produtosTableBody.innerHTML = '';
    
    // Adicionar produtos à tabela
    dadosExemplo.produtos.forEach(produto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${produto.imagem}" alt="${produto.nome}" class="produto-thumbnail"></td>
            <td>${produto.nome}</td>
            <td>${produto.armazemNome}</td>
            <td>${produto.quantidade}</td>
            <td>${window.utils.formatCurrency(produto.preco)}</td>
            <td>${produto.categoriaNome || 'Sem categoria'}</td>
            <td class="table-actions">
                <button class="view" onclick="visualizarProduto('${produto.id}')"><i class="fas fa-eye"></i></button>
                <button class="edit" onclick="editarProduto('${produto.id}')"><i class="fas fa-edit"></i></button>
                <button class="delete" onclick="excluirProduto('${produto.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        produtosTableBody.appendChild(row);
    });
}

// Atualizar lista de armazéns
function updateArmazemList() {
    console.log('Atualizando lista de armazéns...');
    
    // Verificar se estamos na página de armazéns
    const armazensTableBody = document.getElementById('armazens-table-body');
    if (!armazensTableBody) {
        console.log('Não estamos na página de armazéns. Ignorando atualização da lista.');
        return;
    }
    
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.armazens) return;
    
    // Limpar tabela
    armazensTableBody.innerHTML = '';
    
    // Adicionar armazéns à tabela
    dadosExemplo.armazens.forEach(armazem => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${armazem.nome}</td>
            <td>${armazem.localizacao}</td>
            <td>${armazem.responsavel || 'Não atribuído'}</td>
            <td>${armazem.produtos || 0}</td>
            <td>${window.utils.formatCurrency(armazem.vendas || 0)}</td>
            <td class="table-actions">
                <button class="view" onclick="visualizarArmazem('${armazem.id}')"><i class="fas fa-eye"></i></button>
                <button class="edit" onclick="editarArmazem('${armazem.id}')"><i class="fas fa-edit"></i></button>
                <button class="delete" onclick="excluirArmazem('${armazem.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        armazensTableBody.appendChild(row);
    });
}

// Atualizar lista de funcionários
function updateFuncionarioList() {
    console.log('Atualizando lista de funcionários...');
    
    // Verificar se estamos na página de funcionários
    const funcionariosTableBody = document.getElementById('funcionarios-table-body');
    if (!funcionariosTableBody) {
        console.log('Não estamos na página de funcionários. Ignorando atualização da lista.');
        return;
    }
    
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.funcionarios) return;
    
    // Limpar tabela
    funcionariosTableBody.innerHTML = '';
    
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
        funcionariosTableBody.appendChild(row);
    });
}

// Função global para editar produto
window.editarProduto = function(id) {
    openProductModal(id);
};

// Função global para editar armazém
window.editarArmazem = function(id) {
    openArmazemModal(id);
};

// Função global para editar funcionário
window.editarFuncionario = function(id) {
    openFuncionarioModal(id);
};

// Função global para excluir produto
window.excluirProduto = function(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        // Obter dados do localStorage
        const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
        if (!dadosExemplo || !dadosExemplo.produtos) return;
        
        // Remover produto
        dadosExemplo.produtos = dadosExemplo.produtos.filter(p => p.id !== id);
        
        // Salvar dados no localStorage
        window.utils.saveToLocalStorage('dadosExemplo', dadosExemplo);
        
        // Atualizar lista de produtos
        updateProductList();
        
        // Mostrar mensagem de sucesso
        alert('Produto excluído com sucesso!');
    }
};

// Função global para excluir armazém
window.excluirArmazem = function(id) {
    if (confirm('Tem certeza que deseja excluir este armazém?')) {
        // Obter dados do localStorage
        const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
        if (!dadosExemplo || !dadosExemplo.armazens) return;
        
        // Verificar se há produtos associados a este armazém
        if (dadosExemplo.produtos && dadosExemplo.produtos.some(p => p.armazem === id)) {
            alert('Não é possível excluir este armazém pois há produtos associados a ele.');
            return;
        }
        
        // Verificar se há funcionários associados a este armazém
        if (dadosExemplo.funcionarios && dadosExemplo.funcionarios.some(f => f.armazemId === id)) {
            alert('Não é possível excluir este armazém pois há funcionários associados a ele.');
            return;
        }
        
        // Remover armazém
        dadosExemplo.armazens = dadosExemplo.armazens.filter(a => a.id !== id);
        
        // Salvar dados no localStorage
        window.utils.saveToLocalStorage('dadosExemplo', dadosExemplo);
        
        // Atualizar lista de armazéns
        updateArmazemList();
        
        // Mostrar mensagem de sucesso
        alert('Armazém excluído com sucesso!');
    }
};

// Função global para excluir funcionário
window.excluirFuncionario = function(id) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        // Obter dados do localStorage
        const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
        if (!dadosExemplo || !dadosExemplo.funcionarios) return;
        
        // Encontrar funcionário
        const funcionario = dadosExemplo.funcionarios.find(f => f.id === id);
        if (!funcionario) return;
        
        // Verificar se é responsável por algum armazém
        if (dadosExemplo.armazens && dadosExemplo.armazens.some(a => a.responsavelId === id)) {
            alert('Não é possível excluir este funcionário pois é responsável por um ou mais armazéns.');
            return;
        }
        
        // Remover funcionário
        dadosExemplo.funcionarios = dadosExemplo.funcionarios.filter(f => f.id !== id);
        
        // Remover usuário
        const usuarios = window.utils.getFromLocalStorage('usuarios') || [];
        const userIndex = usuarios.findIndex(u => u.email === funcionario.email);
        
        if (userIndex !== -1) {
            usuarios.splice(userIndex, 1);
            window.utils.saveToLocalStorage('usuarios', usuarios);
        }
        
        // Salvar dados no localStorage
        window.utils.saveToLocalStorage('dadosExemplo', dadosExemplo);
        
        // Atualizar lista de funcionários
        updateFuncionarioList();
        
        // Mostrar mensagem de sucesso
        alert('Funcionário excluído com sucesso!');
    }
};

// Função global para visualizar produto
window.visualizarProduto = function(id) {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.produtos) return;
    
    // Encontrar produto
    const produto = dadosExemplo.produtos.find(p => p.id === id);
    if (!produto) {
        alert('Produto não encontrado.');
        return;
    }
    
    // Criar modal de visualização
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Detalhes do Produto</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="produto-detalhes">
                    <div class="produto-imagem-grande">
                        <img src="${produto.imagem}" alt="${produto.nome}">
                    </div>
                    <div class="produto-info-detalhes">
                        <h3>${produto.nome}</h3>
                        <p><strong>Descrição:</strong> ${produto.descricao || 'Sem descrição'}</p>
                        <p><strong>Armazém:</strong> ${produto.armazemNome}</p>
                        <p><strong>Quantidade em Estoque:</strong> ${produto.quantidade}</p>
                        <p><strong>Preço Unitário:</strong> ${window.utils.formatCurrency(produto.preco)}</p>
                        <p><strong>Categoria:</strong> ${produto.categoriaNome || 'Sem categoria'}</p>
                        <p><strong>Data de Cadastro:</strong> ${window.utils.formatDate(produto.createdAt)}</p>
                        <p><strong>Última Atualização:</strong> ${window.utils.formatDate(produto.updatedAt)}</p>
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

// Função global para visualizar armazém
window.visualizarArmazem = function(id) {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.armazens) return;
    
    // Encontrar armazém
    const armazem = dadosExemplo.armazens.find(a => a.id === id);
    if (!armazem) {
        alert('Armazém não encontrado.');
        return;
    }
    
    // Filtrar produtos deste armazém
    const produtosArmazem = dadosExemplo.produtos ? 
        dadosExemplo.produtos.filter(p => p.armazem === id) : 
        [];
    
    // Criar lista de produtos
    let produtosHTML = '';
    if (produtosArmazem.length > 0) {
        produtosHTML = '<h4>Produtos neste Armazém</h4><ul>';
        produtosArmazem.forEach(produto => {
            produtosHTML += `<li>${produto.nome} - ${produto.quantidade} unidades - ${window.utils.formatCurrency(produto.preco)}</li>`;
        });
        produtosHTML += '</ul>';
    } else {
        produtosHTML = '<p>Nenhum produto cadastrado neste armazém.</p>';
    }
    
    // Criar modal de visualização
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Detalhes do Armazém</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="armazem-detalhes">
                    <h3>${armazem.nome}</h3>
                    <p><strong>Localização:</strong> ${armazem.localizacao}</p>
                    <p><strong>Responsável:</strong> ${armazem.responsavel || 'Não atribuído'}</p>
                    <p><strong>Descrição:</strong> ${armazem.descricao || 'Sem descrição'}</p>
                    <p><strong>Total de Produtos:</strong> ${armazem.produtos || 0}</p>
                    <p><strong>Total de Vendas:</strong> ${window.utils.formatCurrency(armazem.vendas || 0)}</p>
                    <p><strong>Data de Cadastro:</strong> ${window.utils.formatDate(armazem.createdAt)}</p>
                    <p><strong>Última Atualização:</strong> ${window.utils.formatDate(armazem.updatedAt)}</p>
                    
                    <div class="produtos-armazem">
                        ${produtosHTML}
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

// Função global para visualizar funcionário
window.visualizarFuncionario = function(id) {
    // Obter dados do localStorage
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (!dadosExemplo || !dadosExemplo.funcionarios) return;
    
    // Encontrar funcionário
    const funcionario = dadosExemplo.funcionarios.find(f => f.id === id);
    if (!funcionario) {
        alert('Funcionário não encontrado.');
        return;
    }
    
    // Criar modal de visualização
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Detalhes do Funcionário</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="funcionario-detalhes">
                    <h3>${funcionario.nome}</h3>
                    <p><strong>Email:</strong> ${funcionario.email}</p>
                    <p><strong>Telefone:</strong> ${funcionario.telefone || 'Não informado'}</p>
                    <p><strong>Cargo:</strong> ${funcionario.cargo}</p>
                    <p><strong>Armazém:</strong> ${funcionario.armazem}</p>
                    <p><strong>Data de Contratação:</strong> ${window.utils.formatDate(funcionario.dataContratacao)}</p>
                    <p><strong>Status:</strong> ${funcionario.status}</p>
                    <p><strong>Data de Cadastro:</strong> ${window.utils.formatDate(funcionario.createdAt)}</p>
                    <p><strong>Última Atualização:</strong> ${window.utils.formatDate(funcionario.updatedAt)}</p>
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
window.modalManagement = {
    init: initModalManagement,
    loadAdminModals,
    setupAddButtons,
    openProductModal,
    openArmazemModal,
    openFuncionarioModal,
    fillArmazensCombobox,
    fillFuncionariosCombobox,
    setupProductModalEvents,
    setupArmazemModalEvents,
    setupFuncionarioModalEvents,
    saveProduto,
    saveArmazem,
    saveFuncionario,
    updateProductList,
    updateArmazemList,
    updateFuncionarioList
};

// Inicializar gestão de modais quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar carregamento dos componentes
    setTimeout(initModalManagement, 1000);
});
