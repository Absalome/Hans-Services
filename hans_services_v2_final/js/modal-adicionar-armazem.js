/**
 * Modal Adicionar Armazém
 * Para usar: inclua este arquivo no dashboard e adicione um botão com id="btn-adicionar-armazem"
 * O modal será inserido no body ao inicializar.
 */

function createModalAdicionarArmazem() {
    // Evita duplicidade
    if (document.getElementById('modal-adicionar-armazem')) return;

    const modalHTML = `
    <div id="modal-adicionar-armazem" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Adicionar Armazém</h2>
                <span class="close" id="close-modal-armazem">&times;</span>
            </div>
            <div class="modal-body">
                <form id="form-adicionar-armazem">
                    <div class="form-group">
                        <label for="armazem-nome">Nome</label>
                        <input type="text" class="form-control" id="armazem-nome" required>
                    </div>
                    <div class="form-group">
                        <label for="armazem-localizacao">Localização</label>
                        <input type="text" class="form-control" id="armazem-localizacao" required>
                    </div>
                    <div class="form-group">
                        <label for="armazem-responsavel">Responsável</label>
                        <select class="form-control" id="armazem-responsavel" required>
                            <option value="">Selecione um responsável</option>
                            <!-- Opções podem ser populadas via JS -->
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="armazem-descricao">Descrição</label>
                        <textarea class="form-control" id="armazem-descricao" rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-danger" id="btn-cancelar-armazem" type="button">Cancelar</button>
                <button class="btn btn-primary" id="btn-salvar-armazem" type="submit" form="form-adicionar-armazem">Salvar</button>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Eventos de fechar modal
    document.getElementById('close-modal-armazem').onclick = closeModalAdicionarArmazem;
    document.getElementById('btn-cancelar-armazem').onclick = closeModalAdicionarArmazem;
    window.onclick = function(event) {
        const modal = document.getElementById('modal-adicionar-armazem');
        if (event.target === modal) closeModalAdicionarArmazem();
    };
}

function openModalAdicionarArmazem() {
    createModalAdicionarArmazem();
    document.getElementById('modal-adicionar-armazem').style.display = 'block';
}

function closeModalAdicionarArmazem() {
    const modal = document.getElementById('modal-adicionar-armazem');
    if (modal) modal.style.display = 'none';
}

// Inicialização: vincula ao botão de adicionar armazém
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('btn-adicionar-armazem');
    if (btn) {
        btn.addEventListener('click', openModalAdicionarArmazem);
    }
});