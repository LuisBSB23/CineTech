# **🎬 CineTech \- Plataforma de Ingressos de Cinema**

Bem-vindo ao repositório do **CineTech**, uma aplicação Fullstack para reserva e compra de ingressos de cinema. O sistema permite que usuários naveguem por filmes em cartaz, escolham sessões, selecionem assentos em um mapa interativo e simulem o pagamento. Possui também um painel administrativo para gestão de filmes e sessões.

## **🛠️ Tecnologias Utilizadas**

### **Backend**

* **Java 17**  
* **Spring Boot 3.2.0** (Web, Data JPA, Validation)  
* **MySQL** (Banco de dados relacional)  
* **Maven** (Gerenciador de dependências)

### **Frontend**

* **React 19** (com TypeScript)  
* **Vite** (Build tool)  
* **Tailwind CSS** (Estilização)  
* **Lucide React** (Ícones)  
* **Axios** (Consumo de API)

## **📋 Pré-requisitos**

Antes de começar, certifique-se de ter instalado em sua máquina:

1. **Java JDK 17** ou superior.  
2. **Node.js** (versão 18 ou superior) e **npm**.  
3. **MySQL Server** rodando localmente.  
4. **Git**.

## **🚀 Passo a Passo para Execução**

### **1\. Clonar o Repositório**

git clone \[https://github.com/seu-usuario/cinetech.git\](https://github.com/seu-usuario/cinetech.git)  
cd cinetech

### **2\. Configuração do Banco de Dados (MySQL)**

1. Abra seu cliente MySQL (MySQL Workbench, DBeaver, ou terminal).  
2. Crie um banco de dados vazio chamado cinetechdb:  
   CREATE DATABASE cinetechdb;

3. **Importante:** O projeto está configurado para usar o usuário root e senha samyi23s11. Se o seu MySQL local usar credenciais diferentes, você precisará alterar o arquivo de configuração do backend.

### **3\. Configurando e Rodando o Backend (cinetech-api)**

O Git ignora a pasta target (onde ficam os compilados). O Maven baixará as dependências automaticamente.

1. Navegue até a pasta da API:  
   cd CineTech-Projeto-Fullstack/cinetech-api

2. (Opcional) Se sua senha do MySQL não for a padrão do projeto, edite o arquivo src/main/resources/application.properties:  
   spring.datasource.username=SEU\_USUARIO  
   spring.datasource.password=SUA\_SENHA

3. Execute a aplicação:  
   * **Via terminal (Linux/Mac):** ./mvnw spring-boot:run  
   * **Via terminal (Windows):** mvnw spring-boot:run  
   * **Ou via IDE:** Abra a pasta cinetech-api no IntelliJ/Eclipse e execute a classe CineTechAplicacao.java.

**Nota:** Na primeira execução, o sistema irá popular o banco de dados automaticamente com usuários, filmes e sessões iniciais (graças ao arquivo data.sql).

### **4\. Configurando e Rodando o Frontend (cinetech-frontend)**

O Git ignora a pasta node\_modules (onde ficam as bibliotecas do React). Você precisa restaurá-las.

1. Abra um novo terminal e navegue até a pasta do frontend:  
   cd CineTech-Projeto-Fullstack/cinetech-frontend

2. Instale as dependências:  
   Este comando lê o package.json e baixa tudo o que foi ignorado pelo git:  
   npm install

3. **Execute o projeto:**  
   npm run dev

4. Acesse a aplicação no navegador (geralmente em):  
   http://localhost:5173

## **👤 Credenciais de Acesso (Dados de Teste)**

O sistema já vem com usuários pré-cadastrados para facilitar os testes:

### **Acesso Administrativo (Adicionar Filmes/Sessões)**

* **Email:** admin@cinetech.com  
* **Senha:** admin123

### **Acesso Usuário Comum (Comprar Ingressos)**

* **Email:** ana@email.com  
* **Senha:** 123456

## **📦 Estrutura de Dependências (O que é baixado)**

Como o .gitignore remove arquivos pesados, aqui está o que acontece quando você roda os comandos de instalação:

1. **No Frontend (npm install):**  
   * Baixa bibliotecas como react, react-dom, react-router-dom, framer-motion, axios e tailwindcss.  
   * Cria a pasta node\_modules.  
2. **No Backend (mvn install ou execução):**  
   * Baixa bibliotecas do ecossistema Spring (spring-boot-starter-web, spring-boot-starter-data-jpa, spring-boot-starter-security, etc) e o driver do MySQL.  
   * Gera a pasta target com os arquivos .class compilados.