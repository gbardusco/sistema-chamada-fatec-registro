# 📋 Sistema de Chamada - Padrão CPS (Fatec Registro)

Este é um sistema de gestão de presença docente (SPA - Single Page Application) desenvolvido para facilitar a rotina de professores e coordenadores da Fatec Registro. O projeto segue rigorosamente o **Manual de Identidade Visual do Centro Paula Souza** (CPS).

A aplicação utiliza arquitetura **MVC (Model-View-Controller)** para garantir organização, escalabilidade e facilidade de manutenção.

## 🚀 Funcionalidades

### 📅 Gestão de Presença
* **Listas de Entrada e Saída:** Controle separado por tipo de registro.
* **Salvamento Inteligente (Upsert):** O sistema detecta se já existe uma lista para o mesmo dia/turma e atualiza o registro existente em vez de criar duplicatas.
* **Seleção Ágil:** Botões para "Selecionar Todos" e "Inverter Seleção", além de permitir marcar clicando em qualquer lugar da linha do aluno.

### 🖨️ Impressão e Documentação
* **Gerador de PDF Oficial:** Cria listas de presença formatadas para impressão (orientação paisagem), contendo:
    * Cabeçalho padrão com logos do CPS e Governo de SP.
    * Dados da turma, data e contagem de alunos.
    * Linhas dimensionadas para assinatura manual dos alunos.
* **Exportação SIGA:** Gera arquivos `.txt` formatados para importação ou conferência no sistema acadêmico.

### 💾 Base de Dados (Local)
* **Persistência Offline:** Dados salvos no `LocalStorage` do navegador.
* **Importação em Massa:** Suporte a arquivos Excel (`.xlsx`, `.xls`), CSV e JSON.
* **Cadastro Manual:** Formulário para adicionar alunos individualmente com validação de RA duplicado.

### 🕰️ Histórico e Auditoria
* **Histórico Detalhado:** Busca e filtros por período.
* **Logs de Alteração:** O sistema registra a data e hora de criação e de cada edição realizada em uma lista.
* **Edição Póstuma:** Permite corrigir presenças em listas já salvas através de uma interface modal dedicada.

## 🛠 Tecnologias Utilizadas

* **HTML5 & CSS3:** Design responsivo (Mobile First) e semântico.
* **JavaScript (ES6+):** Lógica pura, estruturada no padrão MVC.
* **SheetJS (XLSX):** Leitura e processamento de planilhas.
* **jsPDF & AutoTable:** Geração de documentos PDF dinâmicos no navegador.
* **FontAwesome:** Ícones de interface.

## 📁 Estrutura do Projeto

```text
/sistema-chamada/
│
├── index.html           # Interface Principal (Single Page)
├── README.md            # Documentação
│
└── assets/
    ├── css/
    │   └── style.css    # Estilização (Identidade Visual CPS)
    │
    ├── js/
    │   ├── model.js     # Regras de Negócio, Dados e Logs
    │   ├── view.js      # Manipulação do DOM, Modais e PDF
    │   └── controller.js # Gerenciamento de Eventos
    │
    └── img/
        ├── logo_cps.png       # Logo Institucional
        └── logo_gov_sp.png    # Logo do Governo do Estado
```

## 🎨 Identidade Visual

O design respeita as diretrizes do Centro Paula Souza:

  * **Tipografia:** Fonte **Verdana** (Padrão de sistema oficial).
  * **Cromia Principal:** Vermelho Institucional `#B20000` (Convertido de CMYK 0/100/100/30).
  * **Layout:** Régua de logotipos com Brasão do Governo à direita e CPS à esquerda.

## 📦 Como Usar

### 1\. Configuração Inicial (Base de Alunos)

1.  Acesse a aba **"Gestão de Alunos"**.
2.  **Opção A (Em Massa):** Importe uma planilha (`.xlsx` ou `.csv`) com colunas como `RA`, `NOME`, `CURSO`, `PERIODO`.
3.  **Opção B (Manual):** Utilize o formulário "Novo Aluno" para cadastrar estudantes individualmente.

### 2\. Realizando a Chamada

1.  Na aba **"Realizar Chamada"**, defina a Data, Curso, Período e Tipo.
2.  Marque os alunos presentes.
3.  Clique em **Salvar / Atualizar Lista**.
      * *Nota:* Se a lista já existir, o sistema atualizará o registro e gravará um log da alteração.

### 3\. Histórico e Edição

1.  Vá para a aba **"Histórico"**.
2.  Utilize os botões de ação em cada registro:
      * 👁️ **Ver:** Exibe detalhes e o log de alterações (quem criou, quando editou).
      * ✏️ **Editar:** Abre uma janela para alterar as presenças daquela lista específica.
      * ⬇️ **Baixar:** Download do arquivo `.txt`.
      * 🗑️ **Excluir:** Remove o registro permanentemente.

### 4\. Impressão (PDF)

1.  Acesse a aba **"Imprimir"**.
2.  Escolha a Data e o Tipo da lista.
3.  Selecione "Todas as Turmas" ou uma turma específica.
4.  Clique em **Gerar PDF**. Um arquivo pronto para impressão será baixado.

-----

**Desenvolvido para a Fatec Registro.**
