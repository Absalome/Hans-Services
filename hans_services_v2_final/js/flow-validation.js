/**
 * Script para validação e teste de todos os fluxos e interações do sistema
 * Garante que todos os botões e modais funcionem corretamente sem backend
 */

// Função para inicializar validação de fluxos
function initFlowValidation() {
    console.log('Inicializando validação de fluxos...');
    
    // Verificar tipo de usuário
    const usuarioLogado = window.utils.getFromLocalStorage('usuarioLogado');
    const tipoUsuario = usuarioLogado ? usuarioLogado.type : null;
    
    // Inicializar dados de exemplo se não existirem
    initDadosExemplo();
    
    // Validar fluxos específicos por tipo de usuário
    if (tipoUsuario === 'admin') {
        validateAdminFlows();
    } else if (tipoUsuario === 'funcionario') {
        validateFuncionarioFlows();
    } else if (tipoUsuario === 'cliente') {
        validateClienteFlows();
    } else {
        validateLoginFlow();
    }
    
    console.log('Validação de fluxos inicializada com sucesso!');
}

// Inicializar dados de exemplo
function initDadosExemplo() {
    console.log('Inicializando dados de exemplo...');
    
    // Verificar se já existem dados
    const dadosExemplo = window.utils.getFromLocalStorage('dadosExemplo');
    if (dadosExemplo) return;
    
    // Criar dados de exemplo
    const novosDados = {
        armazens: [
            {
                id: 'armazem-1',
                nome: 'Armazém Central',
                localizacao: 'Maputo',
                responsavelId: 'func-1',
                responsavel: 'João Silva',
                descricao: 'Armazém principal da empresa',
                produtos: 5,
                vendas: 15000,
                createdAt: '2025-01-15T10:30:00.000Z',
                updatedAt: '2025-05-10T14:45:00.000Z'
            },
            {
                id: 'armazem-2',
                nome: 'Armazém Norte',
                localizacao: 'Nampula',
                responsavelId: 'func-2',
                responsavel: 'Ana Santos',
                descricao: 'Armazém da região norte',
                produtos: 3,
                vendas: 8500,
                createdAt: '2025-02-20T09:15:00.000Z',
                updatedAt: '2025-05-12T11:30:00.000Z'
            }
        ],
        funcionarios: [
            {
                id: 'func-1',
                nome: 'João Silva',
                email: 'joao.silva@func.com',
                telefone: '84123456',
                cargo: 'Vendedor',
                armazemId: 'armazem-1',
                armazem: 'Armazém Central',
                dataContratacao: '2024-10-15',
                status: 'Ativo',
                createdAt: '2024-10-15T08:00:00.000Z',
                updatedAt: '2025-04-20T10:15:00.000Z'
            },
            {
                id: 'func-2',
                nome: 'Ana Santos',
                email: 'ana.santos@func.com',
                telefone: '85789012',
                cargo: 'Vendedor',
                armazemId: 'armazem-2',
                armazem: 'Armazém Norte',
                dataContratacao: '2024-11-05',
                status: 'Ativo',
                createdAt: '2024-11-05T09:30:00.000Z',
                updatedAt: '2025-03-15T14:20:00.000Z'
            },
            {
                id: 'func-3',
                nome: 'Carlos Mendes',
                email: 'carlos.mendes@func.com',
                telefone: '86345678',
                cargo: 'Camionista',
                armazemId: 'armazem-1',
                armazem: 'Armazém Central',
                dataContratacao: '2025-01-10',
                status: 'Ativo',
                createdAt: '2025-01-10T10:00:00.000Z',
                updatedAt: '2025-04-25T11:45:00.000Z'
            }
        ],
        clientes: [
            {
                id: 'cliente-1',
                nome: 'Maria Oliveira',
                email: 'maria.oliveira@gmail.com',
                telefone: '84567890',
                endereco: 'Av. Julius Nyerere, 1234, Maputo',
                cadastradoPor: 'João Silva',
                status: 'Ativo',
                createdAt: '2025-02-05T14:30:00.000Z',
                updatedAt: '2025-05-10T09:45:00.000Z'
            },
            {
                id: 'cliente-2',
                nome: 'Pedro Costa',
                email: 'pedro.costa@gmail.com',
                telefone: '85123456',
                endereco: 'Rua da Paz, 567, Nampula',
                cadastradoPor: 'Ana Santos',
                status: 'Ativo',
                createdAt: '2025-03-12T11:20:00.000Z',
                updatedAt: '2025-05-08T16:30:00.000Z'
            }
        ],
        produtos: [
            {
                id: 'produto-1',
                nome: 'Arroz',
                descricao: 'Arroz de qualidade premium, pacote de 5kg',
                armazem: 'armazem-1',
                armazemNome: 'Armazém Central',
                quantidade: 100,
                preco: 250,
                categoria: '1',
                categoriaNome: 'Alimentos',
                imagem: '../img/produtos/produto_default.jpg',
                createdAt: '2025-01-20T10:15:00.000Z',
                updatedAt: '2025-05-05T14:30:00.000Z'
            },
            {
                id: 'produto-2',
                nome: 'Feijão',
                descricao: 'Feijão manteiga, pacote de 1kg',
                armazem: 'armazem-1',
                armazemNome: 'Armazém Central',
                quantidade: 80,
                preco: 120,
                categoria: '1',
                categoriaNome: 'Alimentos',
                imagem: '../img/produtos/produto_default.jpg',
                createdAt: '2025-01-25T09:45:00.000Z',
                updatedAt: '2025-05-06T11:20:00.000Z'
            },
            {
                id: 'produto-3',
                nome: 'Detergente',
                descricao: 'Detergente líquido, 1L',
                armazem: 'armazem-1',
                armazemNome: 'Armazém Central',
                quantidade: 50,
                preco: 180,
                categoria: '3',
                categoriaNome: 'Limpeza',
                imagem: '../img/produtos/produto_default.jpg',
                createdAt: '2025-02-10T13:30:00.000Z',
                updatedAt: '2025-05-07T10:15:00.000Z'
            },
            {
                id: 'produto-4',
                nome: 'Óleo',
                descricao: 'Óleo de cozinha, 1L',
                armazem: 'armazem-2',
                armazemNome: 'Armazém Norte',
                quantidade: 60,
                preco: 200,
                categoria: '1',
                categoriaNome: 'Alimentos',
                imagem: '../img/produtos/produto_default.jpg',
                createdAt: '2025-02-15T11:45:00.000Z',
                updatedAt: '2025-05-08T09:30:00.000Z'
            },
            {
                id: 'produto-5',
                nome: 'Sabão em Pó',
                descricao: 'Sabão em pó, pacote de 1kg',
                armazem: 'armazem-2',
                armazemNome: 'Armazém Norte',
                quantidade: 40,
                preco: 150,
                categoria: '3',
                categoriaNome: 'Limpeza',
                imagem: '../img/produtos/produto_default.jpg',
                createdAt: '2025-03-05T14:20:00.000Z',
                updatedAt: '2025-05-09T13:45:00.000Z'
            }
        ],
        vendas: [
            {
                id: 'venda-1',
                clienteId: 'cliente-1',
                clienteNome: 'Maria Oliveira',
                armazemId: 'armazem-1',
                armazemNome: 'Armazém Central',
                funcionarioNome: 'João Silva',
                itens: [
                    {
                        produtoId: 'produto-1',
                        produtoNome: 'Arroz',
                        quantidade: 2,
                        preco: 250,
                        subtotal: 500
                    },
                    {
                        produtoId: 'produto-2',
                        produtoNome: 'Feijão',
                        quantidade: 3,
                        preco: 120,
                        subtotal: 360
                    }
                ],
                total: 860,
                status: 'Concluída',
                createdAt: '2025-04-10T15:30:00.000Z'
            },
            {
                id: 'venda-2',
                clienteId: 'cliente-2',
                clienteNome: 'Pedro Costa',
                armazemId: 'armazem-2',
                armazemNome: 'Armazém Norte',
                funcionarioNome: 'Ana Santos',
                itens: [
                    {
                        produtoId: 'produto-4',
                        produtoNome: 'Óleo',
                        quantidade: 1,
                        preco: 200,
                        subtotal: 200
                    },
                    {
                        produtoId: 'produto-5',
                        produtoNome: 'Sabão em Pó',
                        quantidade: 2,
                        preco: 150,
                        subtotal: 300
                    }
                ],
                total: 500,
                status: 'Concluída',
                createdAt: '2025-04-15T10:45:00.000Z'
            }
        ]
    };
    
    // Salvar dados no localStorage
    window.utils.saveToLocalStorage('dadosExemplo', novosDados);
    
    // Inicializar usuários
    const usuarios = [
        {
            email: 'admin@admin.com',
            password: 'admin',
            type: 'admin',
            nome: 'Administrador'
        },
        {
            email: 'joao.silva@func.com',
            password: 'func123',
            type: 'funcionario',
            nome: 'João Silva',
            id: 'func-1'
        },
        {
            email: 'ana.santos@func.com',
            password: 'func123',
            type: 'funcionario',
            nome: 'Ana Santos',
            id: 'func-2'
        },
        {
            email: 'carlos.mendes@func.com',
            password: 'func123',
            type: 'funcionario',
            nome: 'Carlos Mendes',
            id: 'func-3'
        },
        {
            email: 'maria.oliveira@gmail.com',
            password: 'cliente123',
            type: 'cliente',
            nome: 'Maria Oliveira',
            id: 'cliente-1'
        },
        {
            email: 'pedro.costa@gmail.com',
            password: 'cliente123',
            type: 'cliente',
            nome: 'Pedro Costa',
            id: 'cliente-2'
        }
    ];
    
    window.utils.saveToLocalStorage('usuarios', usuarios);
    
    console.log('Dados de exemplo inicializados com sucesso!');
}

// Validar fluxos do administrador
function validateAdminFlows() {
    console.log('Validando fluxos do administrador...');
    
    // Verificar se os modais foram carregados
    setTimeout(() => {
        // Verificar se o modal de produto existe
        const modalProduto = document.getElementById('modal-produto');
        if (!modalProduto) {
            console.error('Modal de produto não encontrado! Tentando carregar modais...');
            if (window.modalManagement && window.modalManagement.loadAdminModals) {
                window.modalManagement.loadAdminModals();
            }
        }
        
        // Verificar se o modal de armazém existe
        const modalArmazem = document.getElementById('modal-armazem');
        if (!modalArmazem) {
            console.error('Modal de armazém não encontrado!');
        }
        
        // Verificar se o modal de funcionário existe
        const modalFuncionario = document.getElementById('modal-funcionario');
        if (!modalFuncionario) {
            console.error('Modal de funcionário não encontrado!');
        }
        
        // Configurar eventos dos botões de adicionar
        setupAdminAddButtons();
        
        // Atualizar listas
        updateAdminLists();
    }, 1500);
}

// Configurar eventos dos botões de adicionar do administrador
function setupAdminAddButtons() {
    console.log('Configurando eventos dos botões de adicionar do administrador...');
    
    // Botão de adicionar produto
    const btnAdicionarProduto = document.getElementById('btn-adicionar-produto');
    if (btnAdicionarProduto) {
        btnAdicionarProduto.addEventListener('click', function() {
            if (window.modalManagement && window.modalManagement.openProductModal) {
                window.modalManagement.openProductModal();
            } else {
                console.error('Função openProductModal não encontrada!');
            }
        });
    } else {
        console.log('Botão de adicionar produto não encontrado na página atual.');
    }
    
    // Botão de adicionar armazém
    const btnAdicionarArmazem = document.getElementById('btn-adicionar-armazem');
    if (btnAdicionarArmazem) {
        btnAdicionarArmazem.addEventListener('click', function() {
            if (window.modalManagement && window.modalManagement.openArmazemModal) {
                window.modalManagement.openArmazemModal();
            } else {
                console.error('Função openArmazemModal não encontrada!');
            }
        });
    } else {
        console.log('Botão de adicionar armazém não encontrado na página atual.');
    }
    
    // Botão de adicionar funcionário
    const btnAdicionarFuncionario = document.getElementById('btn-adicionar-funcionario');
    if (btnAdicionarFuncionario) {
        btnAdicionarFuncionario.addEventListener('click', function() {
            if (window.modalManagement && window.modalManagement.openFuncionarioModal) {
                window.modalManagement.openFuncionarioModal();
            } else {
                console.error('Função openFuncionarioModal não encontrada!');
            }
        });
    } else {
        console.log('Botão de adicionar funcionário não encontrado na página atual.');
    }
}

// Atualizar listas do administrador
function updateAdminLists() {
    console.log('Atualizando listas do administrador...');
    
    // Atualizar lista de produtos
    if (window.modalManagement && window.modalManagement.updateProductList) {
        window.modalManagement.updateProductList();
    }
    
    // Atualizar lista de armazéns
    if (window.modalManagement && window.modalManagement.updateArmazemList) {
        window.modalManagement.updateArmazemList();
    }
    
    // Atualizar lista de funcionários
    if (window.modalManagement && window.modalManagement.updateFuncionarioList) {
        window.modalManagement.updateFuncionarioList();
    }
}

// Validar fluxos do funcionário
function validateFuncionarioFlows() {
    console.log('Validando fluxos do funcionário...');
    
    // Verificar se os modais foram carregados
    setTimeout(() => {
        // Verificar se o modal de cliente existe
        const modalCliente = document.getElementById('modal-cliente');
        if (!modalCliente) {
            console.error('Modal de cliente não encontrado! Tentando carregar modais...');
            if (window.funcionarioModalManagement && window.funcionarioModalManagement.loadFuncionarioModals) {
                window.funcionarioModalManagement.loadFuncionarioModals();
            }
        }
        
        // Verificar se o modal de venda existe
        const modalVenda = document.getElementById('modal-venda');
        if (!modalVenda) {
            console.error('Modal de venda não encontrado!');
        }
        
        // Configurar eventos dos botões de adicionar
        setupFuncionarioAddButtons();
        
        // Atualizar listas
        updateFuncionarioLists();
    }, 1500);
}

// Configurar eventos dos botões de adicionar do funcionário
function setupFuncionarioAddButtons() {
    console.log('Configurando eventos dos botões de adicionar do funcionário...');
    
    // Botão de adicionar cliente
    const btnAdicionarCliente = document.getElementById('btn-adicionar-cliente');
    if (btnAdicionarCliente) {
        btnAdicionarCliente.addEventListener('click', function() {
            if (window.funcionarioModalManagement && window.funcionarioModalManagement.openClienteModal) {
                window.funcionarioModalManagement.openClienteModal();
            } else {
                console.error('Função openClienteModal não encontrada!');
            }
        });
    } else {
        console.log('Botão de adicionar cliente não encontrado na página atual.');
    }
    
    // Botão de realizar venda
    const btnRealizarVenda = document.getElementById('btn-realizar-venda');
    if (btnRealizarVenda) {
        btnRealizarVenda.addEventListener('click', function() {
            if (window.funcionarioModalManagement && window.funcionarioModalManagement.openVendaModal) {
                window.funcionarioModalManagement.openVendaModal();
            } else {
                console.error('Função openVendaModal não encontrada!');
            }
        });
    } else {
        console.log('Botão de realizar venda não encontrado na página atual.');
    }
}

// Atualizar listas do funcionário
function updateFuncionarioLists() {
    console.log('Atualizando listas do funcionário...');
    
    // Atualizar lista de clientes
    if (window.funcionarioModalManagement && window.funcionarioModalManagement.updateClienteList) {
        window.funcionarioModalManagement.updateClienteList();
    }
    
    // Atualizar lista de vendas
    if (window.funcionarioModalManagement && window.funcionarioModalManagement.updateVendaList) {
        window.funcionarioModalManagement.updateVendaList();
    }
}

// Validar fluxos do cliente
function validateClienteFlows() {
    console.log('Validando fluxos do cliente...');
    
    // Verificar se os modais foram carregados
    setTimeout(() => {
        // Verificar se o modal de compra existe
        const modalCompra = document.getElementById('modal-compra');
        if (!modalCompra) {
            console.error('Modal de compra não encontrado! Tentando carregar modais...');
            if (window.clienteModalManagement && window.clienteModalManagement.loadClienteModals) {
                window.clienteModalManagement.loadClienteModals();
            }
        }
        
        // Verificar se o modal de alteração de senha existe
        const modalSenha = document.getElementById('modal-senha');
        if (!modalSenha) {
            console.error('Modal de alteração de senha não encontrado!');
        }
        
        // Configurar eventos dos botões
        setupClienteButtons();
        
        // Atualizar histórico de compras
        updateClienteLists();
    }, 1500);
}

// Configurar eventos dos botões do cliente
function setupClienteButtons() {
    console.log('Configurando eventos dos botões do cliente...');
    
    // Botão de realizar compra
    const btnRealizarCompra = document.getElementById('btn-realizar-compra');
    if (btnRealizarCompra) {
        btnRealizarCompra.addEventListener('click', function() {
            if (window.clienteModalManagement && window.clienteModalManagement.openCompraModal) {
                window.clienteModalManagement.openCompraModal();
            } else {
                console.error('Função openCompraModal não encontrada!');
            }
        });
    } else {
        console.log('Botão de realizar compra não encontrado na página atual.');
    }
    
    // Botão de alterar senha
    const btnAlterarSenha = document.getElementById('btn-alterar-senha');
    if (btnAlterarSenha) {
        btnAlterarSenha.addEventListener('click', function() {
            if (window.clienteModalManagement && window.clienteModalManagement.openSenhaModal) {
                window.clienteModalManagement.openSenhaModal();
            } else {
                console.error('Função openSenhaModal não encontrada!');
            }
        });
    } else {
        console.log('Botão de alterar senha não encontrado na página atual.');
    }
}

// Atualizar listas do cliente
function updateClienteLists() {
    console.log('Atualizando listas do cliente...');
    
    // Atualizar histórico de compras
    if (window.clienteModalManagement && window.clienteModalManagement.updateHistoricoCompras) {
        window.clienteModalManagement.updateHistoricoCompras();
    }
}

// Validar fluxo de login
function validateLoginFlow() {
    console.log('Validando fluxo de login...');
    
    // Verificar se estamos na página de login
    const loginForm = document.getElementById('login-form');
    if (!loginForm) {
        console.log('Não estamos na página de login.');
        return;
    }
    
    // Configurar evento de submit do formulário
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Validar campos
        if (!email || !password) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        // Validar formato de email
        if (!validateEmailFormat(email)) {
            alert('Por favor, informe um email válido.');
            return;
        }
        
        // Obter usuários
        const usuarios = window.utils.getFromLocalStorage('usuarios') || [];
        
        // Buscar usuário
        const usuario = usuarios.find(u => u.email === email);
        
        if (!usuario) {
            alert('Usuário não encontrado.');
            return;
        }
        
        if (usuario.password !== password) {
            alert('Senha incorreta.');
            return;
        }
        
        // Login bem-sucedido
        window.utils.saveToLocalStorage('usuarioLogado', usuario);
        
        // Redirecionar para a página correta
        if (usuario.type === 'admin') {
            window.location.href = 'admin/';
        } else if (usuario.type === 'funcionario') {
            window.location.href = 'funcionario/';
        } else if (usuario.type === 'cliente') {
            window.location.href = 'cliente/';
        }
    });
}

// Validar formato de email
function validateEmailFormat(email) {
    // Verificar se é um email válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false;
    }
    
    // Verificar domínio específico
    if (email.endsWith('@admin.com') || email.endsWith('@func.com') || email.endsWith('@gmail.com')) {
        return true;
    }
    
    return false;
}

// Exportar funções
window.flowValidation = {
    init: initFlowValidation,
    initDadosExemplo,
    validateAdminFlows,
    validateFuncionarioFlows,
    validateClienteFlows,
    validateLoginFlow
};

// Inicializar validação de fluxos quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar carregamento dos componentes
    setTimeout(initFlowValidation, 2000);
});
