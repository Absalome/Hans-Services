# Análise dos Novos Requisitos - Sistema Hans Services (Revisão)

## Requisitos Atualizados

### 1. Navegação SPA (Single Page Application)
- Os botões na lateral esquerda devem carregar conteúdo na área direita sem recarregar a página
- Implementar comportamento similar ao dashboard do cliente em todas as telas
- Garantir transição suave entre diferentes seções

### 2. Upload de Imagens para Produtos
- Administrador deve poder fazer upload de imagens ao adicionar produtos
- As imagens devem ser exibidas no painel do cliente durante a compra
- Implementar preview de imagem no formulário de cadastro/edição

### 3. Alteração de Moeda
- Substituir R$ por MZN em todo o sistema
- Atualizar todos os valores e formatações monetárias

### 4. Login Baseado em Email
- Remover seleção de tipo de usuário
- Identificar perfil pelo formato do email:
  - Administrador: email@admin.com
  - Funcionário: email@func.com
  - Cliente: email@gmail.com
- Implementar validação de formato de email

### 5. Modularização do HTML do Administrador
- Separar o HTML do administrador em componentes/módulos
- Facilitar edição e manutenção futura
- Estruturar de forma lógica e organizada

### 6. Gestão de Produtos por Armazém
- Adicionar botão para adicionar produtos ao selecionar um armazém
- Os produtos adicionados devem ser exibidos aos clientes no momento da compra
- Implementar sincronização entre cadastro de produtos e exibição para clientes

### 7. Expansão das Funcionalidades do Funcionário
- Adicionar mais funcionalidades relevantes para o funcionário
- Possíveis adições:
  - Gestão de estoque básica (visualização e alertas)
  - Relatórios de vendas pessoais
  - Dashboard com metas e desempenho
  - Comunicação com clientes
  - Agendamento de entregas

## Fluxos de Interação Atualizados

### Fluxo de Login
1. Usuário acessa a página de login
2. Insere email e senha
3. Sistema identifica o tipo de usuário pelo formato do email
4. Redireciona para o painel correspondente

### Fluxo de Cadastro de Produtos (Administrador)
1. Administrador acessa seção de armazéns
2. Seleciona um armazém
3. Clica em "Adicionar Produto"
4. Preenche dados do produto, incluindo upload de imagem
5. Sistema salva produto e o associa ao armazém selecionado

### Fluxo de Compra (Cliente)
1. Cliente faz login
2. Seleciona armazém
3. Visualiza produtos com imagens
4. Adiciona produtos ao carrinho
5. Visualiza resumo da compra com preços em MZN
6. Confirma compra

## Arquitetura Técnica Atualizada

### Estrutura de Arquivos
```
hans_services/
├── admin/
│   ├── components/
│   │   ├── header.html
│   │   ├── sidebar.html
│   │   ├── dashboard.html
│   │   ├── armazens.html
│   │   ├── funcionarios.html
│   │   ├── clientes.html
│   │   ├── stock.html
│   │   ├── relatorios.html
│   │   └── configuracoes.html
│   └── index.html
├── funcionario/
│   ├── components/
│   │   ├── header.html
│   │   ├── sidebar.html
│   │   ├── dashboard.html
│   │   ├── clientes.html
│   │   ├── vendas.html
│   │   └── perfil.html
│   └── index.html
├── cliente/
│   ├── components/
│   │   ├── header.html
│   │   ├── sidebar.html
│   │   ├── dashboard.html
│   │   ├── compras.html
│   │   ├── historico.html
│   │   └── perfil.html
│   └── index.html
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── components.css
├── js/
│   ├── admin.js
│   ├── funcionario.js
│   ├── cliente.js
│   ├── login.js
│   ├── components.js
│   └── utils.js
├── img/
│   ├── logo.png
│   ├── user.png
│   └── produtos/
├── login.html
└── index.html
```

### Tecnologias a Utilizar
- HTML5, CSS3, JavaScript (ES6+)
- Fetch API para carregamento dinâmico de componentes
- FileReader API para upload e preview de imagens
- LocalStorage para persistência de dados no cliente
- Módulos JavaScript para organização do código

### Abordagem de Implementação
1. Criar estrutura modularizada para cada tipo de usuário
2. Implementar sistema de carregamento dinâmico de componentes
3. Desenvolver lógica de login baseada em formato de email
4. Implementar upload e gerenciamento de imagens
5. Atualizar moeda para MZN em todo o sistema
6. Expandir funcionalidades do funcionário
7. Garantir sincronização de dados entre diferentes painéis
8. Validar responsividade e experiência do usuário
