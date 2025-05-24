# Documentação do Sistema Hans Services

## Visão Geral
O Hans Services é um sistema completo de gerenciamento de armazéns desenvolvido com HTML, CSS e JavaScript. O sistema possui três tipos de utilizadores (administrador, funcionário e cliente) com funcionalidades específicas para cada perfil.

## Estrutura do Sistema
O sistema foi desenvolvido com uma arquitetura modular e SPA (Single Page Application), permitindo navegação fluida entre as diferentes seções sem recarregar a página. A estrutura de diretórios é organizada da seguinte forma:

```
hans_services_v2/
├── admin/                  # Painel do administrador
│   ├── components/         # Componentes modulares do administrador
│   │   ├── armazens.html
│   │   ├── clientes.html
│   │   ├── configuracoes.html
│   │   ├── dashboard.html
│   │   ├── funcionarios.html
│   │   ├── header.html
│   │   ├── relatorios.html
│   │   ├── sidebar.html
│   │   └── stock.html
│   └── index.html          # Página principal do administrador
├── cliente/                # Painel do cliente
│   ├── components/         # Componentes modulares do cliente
│   │   ├── compras.html
│   │   ├── dashboard.html
│   │   ├── header.html
│   │   ├── historico.html
│   │   ├── perfil.html
│   │   └── sidebar.html
│   └── index.html          # Página principal do cliente
├── funcionario/            # Painel do funcionário
│   ├── components/         # Componentes modulares do funcionário
│   │   ├── clientes.html
│   │   ├── dashboard.html
│   │   ├── entregas.html
│   │   ├── estoque.html
│   │   ├── header.html
│   │   ├── perfil.html
│   │   ├── sidebar.html
│   │   └── vendas.html
│   └── index.html          # Página principal do funcionário
├── css/                    # Estilos CSS
│   ├── novas_telas.css
│   ├── responsive.css
│   └── style.css
├── img/                    # Imagens do sistema
│   ├── logo.png
│   ├── produtos/
│   │   └── produto_default.jpg
│   └── user.png
├── js/                     # Scripts JavaScript
│   ├── admin.js
│   ├── cliente.js
│   ├── components.js
│   ├── entregas-management.js
│   ├── funcionario.js
│   ├── login.js
│   ├── product-management.js
│   ├── product-sync.js
│   ├── utils.js
│   └── validation.js
└── login.html              # Página de login
```

## Funcionalidades Principais

### Sistema de Login
- Autenticação baseada em email para determinar o tipo de utilizador:
  - Administrador: email@admin.com
  - Funcionário: email@func.com
  - Cliente: email@gmail.com
- Validação de credenciais e redirecionamento para o painel correspondente
- Recuperação de senha

### Painel do Administrador
1. **Dashboard**
   - Estatísticas gerais (armazéns, funcionários, clientes, vendas)
   - Atividade recente
   - Visão geral dos armazéns

2. **Gestão de Armazéns**
   - Adicionar, editar e visualizar armazéns
   - Visualizar produtos por armazém

3. **Gestão de Stock**
   - Adicionar produtos com upload de imagem
   - Definir preços em MZN
   - Visualizar, editar e excluir produtos
   - Associar produtos a armazéns

4. **Gestão de Funcionários**
   - Adicionar, editar e excluir funcionários
   - Atribuir cargos e armazéns aos funcionários

5. **Visualização de Clientes**
   - Ver clientes cadastrados pelos funcionários
   - Visualizar detalhes dos clientes

6. **Relatórios**
   - Vendas diárias, semanais e mensais por armazém
   - Desempenho de funcionários

### Painel do Funcionário
1. **Dashboard**
   - Estatísticas de vendas e clientes
   - Atividade recente

2. **Cadastro de Clientes**
   - Adicionar, editar e excluir clientes

3. **Realização de Vendas**
   - Selecionar cliente e produtos
   - Calcular total automaticamente
   - Finalizar venda

4. **Gestão de Entregas**
   - Registrar entregas para vendas
   - Atualizar status de entregas
   - Visualizar histórico de entregas

5. **Visualização de Estoque**
   - Ver produtos disponíveis
   - Notificar sobre estoque baixo

### Painel do Cliente
1. **Dashboard**
   - Estatísticas de compras
   - Produtos recomendados
   - Compras recentes

2. **Realização de Compras**
   - Selecionar armazém e produtos
   - Visualizar preços em MZN
   - Adicionar produtos ao carrinho
   - Finalizar compra

3. **Histórico de Compras**
   - Visualizar compras anteriores
   - Filtrar por período

4. **Gestão de Perfil**
   - Atualizar informações pessoais
   - Alterar senha

## Tecnologias Utilizadas
- HTML5
- CSS3
- JavaScript (ES6+)
- LocalStorage para persistência de dados
- FontAwesome para ícones

## Responsividade
O sistema é totalmente responsivo, adaptando-se a diferentes tamanhos de tela:
- Desktop (> 992px)
- Tablet (576px - 992px)
- Mobile (< 576px)

## Instruções de Uso

### Credenciais de Acesso
- **Administrador**: admin@admin.com / admin
- **Funcionário**: joao.silva@func.com / func123
- **Cliente**: maria.oliveira@gmail.com / cliente123

### Fluxo de Trabalho Recomendado
1. Acesse como administrador para adicionar armazéns e produtos
2. Acesse como funcionário para cadastrar clientes e realizar vendas
3. Acesse como cliente para realizar compras

## Personalização e Edição
O sistema foi desenvolvido de forma modular para facilitar a edição e personalização:

- Cada componente está em um arquivo HTML separado
- Os estilos estão organizados em arquivos CSS específicos
- A lógica JavaScript está separada por funcionalidade

Para editar um componente específico, basta localizar o arquivo correspondente na estrutura de diretórios e fazer as alterações necessárias.

## Considerações Finais
Este sistema foi desenvolvido como um protótipo funcional e pode ser expandido com novas funcionalidades conforme necessário. A arquitetura modular facilita a manutenção e a adição de novos recursos.
