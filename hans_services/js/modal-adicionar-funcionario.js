/**
 * Modal Adicionar Funcionário
 * Para usar: inclua este arquivo no dashboard e adicione um botão com id="btn-adicionar-funcionario"
 * O modal será inserido no body ao inicializar.
 */

function createModalAdicionarFuncionario() {
    // Evita duplicidade
    if (document.getElementById('modal-adicionar-funcionario')) return;

    const modalHTML = `
    <!-- Modal de Adicionar Funcionário -->
<div id="modal-adicionar-funcionario" class="modal" style="display:none;">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modal-funcionario-title">Adicionar Funcionário</h2>
            <span class="close" id="close-modal-funcionario">&times;</span>
        </div>
        <div class="modal-body">
            <form id="form-funcionario">
                <div class="form-group">
                    <label for="funcionario-nome">Nome*</label>
                    <input type="text" class="form-control" id="funcionario-nome" required>
                </div>
                <div class="form-group">
                    <label for="funcionario-email">Email*</label>
                    <input type="email" class="form-control" id="funcionario-email" placeholder="exemplo@func.com" required>
                </div>
                <div class="form-group">
                    <label for="funcionario-telefone">Telefone*</label>
                    <input type="tel" class="form-control" id="funcionario-telefone" required>
                </div>
                <div class="form-group">
                    <label for="funcionario-cargo">Cargo*</label>
                    <select class="form-control" id="funcionario-cargo" required>
                        <option value="">Selecione um cargo</option>
                        <option value="Camionista">Camionista</option>
                        <option value="Vendedor">Vendedor</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Limpeza">Limpeza</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="funcionario-armazem">Armazém*</label>
                    <select class="form-control" id="funcionario-armazem" required>
                        <option value="">Selecione um armazém</option>
                        <!-- Opções serão preenchidas via JS -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="funcionario-data">Data de Contratação*</label>
                    <div style="position: relative;">
                        <input type="date" class="form-control" id="funcionario-data" required style="padding-right: 35px;">
                        <span style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #888; pointer-events: none;">
                            <i class="fa fa-calendar"></i>
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label for="funcionario-senha">Senha Inicial*</label>
                    <input type="password" class="form-control" id="funcionario-senha" required>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-danger" id="btn-cancelar-funcionario" type="button">Cancelar</button>
            <button class="btn btn-primary" id="btn-salvar-funcionario" type="submit" form="form-funcionario">Salvar</button>
        </div>
    </div>
</div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Eventos de fechar modal
    document.getElementById('close-modal-funcionario').onclick = closeModalAdicionarFuncionario;
    document.getElementById('btn-cancelar-funcionario').onclick = closeModalAdicionarFuncionario;
    window.onclick = function(event) {
        const modal = document.getElementById('modal-adicionar-funcionario');
        if (event.target === modal) closeModalAdicionarFuncionario();
    };
}

function openModalAdicionarFuncionario() {
    createModalAdicionarFuncionario();
    document.getElementById('modal-adicionar-funcionario').style.display = 'block';
}

function closeModalAdicionarFuncionario() {
    const modal = document.getElementById('modal-adicionar-funcionario');
    if (modal) modal.style.display = 'none';
}

// Inicialização: vincula ao botão de adicionar funcionário
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('btn-adicionar-funcionario');
    if (btn) {
        btn.addEventListener('click', openModalAdicionarFuncionario);
    }
});