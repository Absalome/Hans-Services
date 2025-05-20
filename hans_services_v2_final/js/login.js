/**
 * Script para a página de login do sistema Hans Services
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const forgotPassword = document.getElementById('forgot-password');
    const modalRecuperarSenha = document.getElementById('modal-recuperar-senha');
    const btnCancelarRecuperacao = document.getElementById('btn-cancelar-recuperacao');
    const btnEnviarRecuperacao = document.getElementById('btn-enviar-recuperacao');
    const closeModal = document.querySelector('#modal-recuperar-senha .close');
    const recuperarEmailInput = document.getElementById('recuperar-email');
    const recuperarEmailError = document.getElementById('recuperar-email-error');
    
    // Dados de exemplo para autenticação
    const usuarios = [
        { email: 'admin@admin.com', password: 'admin', type: 'admin' },
        { email: 'joao.silva@func.com', password: 'func123', type: 'funcionario' },
        { email: 'ana.santos@func.com', password: 'func123', type: 'funcionario' },
        { email: 'carlos.mendes@func.com', password: 'func123', type: 'funcionario' },
        { email: 'maria.oliveira@gmail.com', password: 'cliente123', type: 'cliente' },
        { email: 'pedro.costa@gmail.com', password: 'cliente123', type: 'cliente' }
    ];
    
    // Salvar usuários no localStorage para uso em todo o sistema
    window.utils.saveToLocalStorage('usuarios', usuarios);
    
    // Submeter formulário de login
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Resetar mensagens de erro
        emailError.style.display = 'none';
        passwordError.style.display = 'none';
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Validar formato do email
        if (!window.utils.validateEmail(email)) {
            emailError.textContent = 'Email inválido. Verifique o formato.';
            emailError.style.display = 'block';
            emailInput.focus();
            return;
        }
        
        // Identificar tipo de usuário pelo email
        const userType = window.utils.getUserTypeFromEmail(email);
        if (!userType) {
            emailError.textContent = 'Formato de email não reconhecido. Use @admin.com, @func.com ou @gmail.com';
            emailError.style.display = 'block';
            emailInput.focus();
            return;
        }
        
        // Verificar credenciais
        const usuario = usuarios.find(u => u.email === email && u.password === password);
        
        if (!usuario) {
            // Verificar se o email existe
            const emailExists = usuarios.some(u => u.email === email);
            
            if (emailExists) {
                // Email existe, senha incorreta
                passwordError.style.display = 'block';
                passwordInput.focus();
            } else {
                // Email não existe
                emailError.textContent = 'Email não cadastrado.';
                emailError.style.display = 'block';
                emailInput.focus();
            }
            return;
        }
        
        // Login bem-sucedido
        
        // Salvar usuário atual no localStorage
        window.utils.saveToLocalStorage('currentUser', {
            email: usuario.email,
            type: usuario.type
        });
        
        // Redirecionar para a página correspondente
        switch (usuario.type) {
            case 'admin':
                window.location.href = 'admin/index.html';
                break;
            case 'funcionario':
                window.location.href = 'funcionario/index.html';
                break;
            case 'cliente':
                window.location.href = 'cliente/index.html';
                break;
            default:
                console.error('Tipo de usuário desconhecido');
        }
    });
    
    // Abrir modal de recuperação de senha
    forgotPassword.addEventListener('click', function(event) {
        event.preventDefault();
        modalRecuperarSenha.style.display = 'block';
    });
    
    // Fechar modal de recuperação de senha
    function fecharModalRecuperacao() {
        modalRecuperarSenha.style.display = 'none';
        document.getElementById('form-recuperar-senha').reset();
        recuperarEmailError.style.display = 'none';
    }
    
    closeModal.addEventListener('click', fecharModalRecuperacao);
    btnCancelarRecuperacao.addEventListener('click', fecharModalRecuperacao);
    
    // Enviar solicitação de recuperação de senha
    btnEnviarRecuperacao.addEventListener('click', function() {
        const email = recuperarEmailInput.value.trim();
        
        // Resetar mensagem de erro
        recuperarEmailError.style.display = 'none';
        
        // Validar formato do email
        if (!window.utils.validateEmail(email)) {
            recuperarEmailError.textContent = 'Email inválido. Verifique o formato.';
            recuperarEmailError.style.display = 'block';
            recuperarEmailInput.focus();
            return;
        }
        
        // Verificar se o email existe
        const emailExists = usuarios.some(u => u.email === email);
        
        if (!emailExists) {
            recuperarEmailError.textContent = 'Email não cadastrado.';
            recuperarEmailError.style.display = 'block';
            recuperarEmailInput.focus();
            return;
        }
        
        // Simular envio de email de recuperação
        alert(`Um email com instruções para recuperação de senha foi enviado para ${email}`);
        fecharModalRecuperacao();
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === modalRecuperarSenha) {
            fecharModalRecuperacao();
        }
    });
    
    // Verificar se já existe um usuário logado
    const currentUser = window.utils.getFromLocalStorage('currentUser');
    if (currentUser) {
        // Redirecionar para a página correspondente
        switch (currentUser.type) {
            case 'admin':
                window.location.href = 'admin/index.html';
                break;
            case 'funcionario':
                window.location.href = 'funcionario/index.html';
                break;
            case 'cliente':
                window.location.href = 'cliente/index.html';
                break;
            default:
                console.error('Tipo de usuário desconhecido');
        }
    }
});
