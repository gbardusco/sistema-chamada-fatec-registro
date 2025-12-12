# 📋 Sistema de Chamada - Padrão CPS

Este é um sistema de gestão de presença docente (SPA - Single Page Application) desenvolvido para facilitar a rotina de professores e coordenadores. O projeto foi desenhado seguindo rigorosamente o **Manual de Identidade Visual do Centro Paula Souza** (CPS).

A aplicação utiliza arquitetura **MVC (Model-View-Controller)** para garantir organização, escalabilidade e facilidade de manutenção.

## 🚀 Funcionalidades

  * **Gestão de Presença:** Listas separadas por **Entrada** e **Saída**.
  * **Base de Dados Local:** Persistência de dados utilizando `LocalStorage` (funciona offline).
  * **Importação em Massa:** Suporte a arquivos Excel (`.xlsx`, `.xls`), CSV e JSON para cadastro de turmas inteiras.
  * **Histórico Inteligente:** Busca, filtros por período e edição de registros passados.
  * **Exportação Oficial:** Geração de arquivos `.txt` formatados para registros oficiais (padrão Siges/Siga).
  * **Cópia Rápida:** Botão para copiar a lista de presentes para a área de transferência (útil para WhatsApp/Teams).

## 🛠 Tecnologias Utilizadas

  * **HTML5 & CSS3:** Semântico e responsivo.
  * **JavaScript (ES6+):** Lógica pura, estruturada no padrão MVC.
  * **SheetJS (XLSX):** Biblioteca para leitura e processamento de planilhas.
  * **FontAwesome:** Ícones para interface de usuário.

## 📁 Estrutura do Projeto

O projeto foi refatorado para separar responsabilidades:

```text
/chamada/
│
├── index.html           # Estrutura e Interface Principal
├── README.md            # Documentação do Projeto
│
└── assets/
    ├── css/
    │   └── style.css    # Estilização (Identidade Visual CPS)
    │
    ├── js/
    │   ├── model.js     # Regras de Negócio e Dados (LocalStorage)
    │   ├── view.js      # Manipulação do DOM e Interface
    │   └── controller.js # Gerenciamento de Eventos e fluxo
    │
    └── img/
        ├── logo_cps.png       # Logo Institucional
        └── logo_gov_sp.png    # Logo do Governo do Estado
```

## 🎨 Identidade Visual

O design segue as diretrizes oficiais do Centro Paula Souza:

  * **Tipografia:** Fonte **Verdana** (Padrão de sistema oficial).
  * **Cromia Principal:** Vermelho Institucional `#B20000` (Convertido de CMYK 0/100/100/30).
  * **Layout:** Régua de logotipos com Brasão do Governo à direita e CPS à esquerda.

## 📦 Como Usar

### 1\. Instalação

Não é necessária instalação complexa. Apenas faça o download dos arquivos e abra o `index.html` em qualquer navegador moderno.

### 2\. Configuração Inicial (Base de Alunos)

1.  Vá até a aba **"Gestão de Alunos"**.
2.  Importe uma planilha (`.xlsx` ou `.csv`).
3.  **Formato Aceito:** O sistema é flexível e busca colunas com nomes similares a:
      * `RA` ou `Matricula`
      * `NOME` ou `Aluno`
      * `CURSO`
      * `PERIODO` ou `Turma`

Exemplo de CSV para teste:

```csv
RA,NOME,CURSO,PERIODO
101010,Maria Silva,DSM,1
101011,João Souza,DSM,1
101012,Ana Pereira,GE,3
```

### 3\. Realizando a Chamada

1.  Na aba **"Realizar Chamada"**, selecione a Data.
2.  Escolha o **Curso** e o **Período** (os alunos aparecerão automaticamente).
3.  Marque os presentes (ou use "Selecionar Todos").
4.  Clique em **Salvar Lista**.

### 4\. Histórico

  * Acesse a aba **"Histórico"** para ver as listas salvas.
  * Use os filtros para encontrar datas específicas.
  * Você pode baixar o `.txt` ou excluir registros errados.
  * **Dica:** Clique na etiqueta "Entrada" ou "Saída" para alterar o tipo da lista caso tenha salvo errado.

-----

**Desenvolvido para otimização da gestão acadêmica.**