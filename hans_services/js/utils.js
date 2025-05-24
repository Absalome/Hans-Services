/**
 * Utilitários para o sistema Hans Services
 * Funções compartilhadas entre todos os módulos
 */

// Função para carregar componentes HTML
async function loadComponent(containerId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Erro ao carregar componente: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(containerId).innerHTML = html;
        return true;
    } catch (error) {
        console.error('Erro ao carregar componente:', error);
        document.getElementById(containerId).innerHTML = `<p class="text-center">Erro ao carregar componente: ${error.message}</p>`;
        return false;
    }
}

// Função para navegar entre páginas
function navigateTo(pageName, menuItems, pages, pageTitle) {
    // Atualizar menu
    menuItems.forEach(item => {
        if (item.getAttribute('data-page') === pageName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Atualizar título da página
    if (pageTitle) {
        pageTitle.textContent = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    }
    
    // Mostrar página correspondente
    pages.forEach(page => {
        if (page.id === `${pageName}-page`) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
    
    // Salvar estado na URL (sem recarregar a página)
    window.history.pushState({ page: pageName }, pageName, `#${pageName}`);
}

// Função para abrir modal
function openModal(modal) {
    if (modal) {
        modal.style.display = 'block';
    }
}

// Função para fechar modal
function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
    }
}

// Função para formatar valor monetário
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-MZ', {
        style: 'currency',
        currency: 'MZN',
        minimumFractionDigits: 2
    }).format(value);
}

// Função para formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

// Função para validar email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Função para identificar tipo de usuário pelo email
function getUserTypeFromEmail(email) {
    if (!email) return null;
    
    if (email.endsWith('@admin.com')) {
        return 'admin';
    } else if (email.endsWith('@func.com')) {
        return 'funcionario';
    } else if (email.endsWith('@gmail.com')) {
        return 'cliente';
    }
    
    return null;
}

// Função para salvar dados no localStorage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        return false;
    }
}

// Função para obter dados do localStorage
function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Erro ao obter dados:', error);
        return null;
    }
}

// Função para gerar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Função para preview de imagem
function setupImagePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    if (!input || !preview) return;
    
    input.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = `
                <div class="image-preview-placeholder">
                    <i class="fas fa-image"></i>
                    <p>Selecione uma imagem</p>
                </div>
            `;
        }
    });
}

// Função para logout
function logout() {
    // Limpar dados de sessão
    localStorage.removeItem('currentUser');
    
    // Redirecionar para página de login
    window.location.href = '../login.html';
}

// Exportar funções
window.utils = {
    loadComponent,
    navigateTo,
    openModal,
    closeModal,
    formatCurrency,
    formatDate,
    validateEmail,
    getUserTypeFromEmail,
    saveToLocalStorage,
    getFromLocalStorage,
    generateId,
    setupImagePreview,
    logout
};
