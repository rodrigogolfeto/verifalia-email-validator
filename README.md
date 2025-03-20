# Verifalia Email Validator

Projeto Node.js para validar e-mails utilizando a API Verifalia. O sistema lê e-mails de um arquivo CSV, verifica sua validade e gera relatórios separados para e-mails válidos e inválidos, além de um resumo estatístico da verificação.

## 🚀 Tecnologias Utilizadas
- Node.js
- Verifalia API
- CSV Parser
- Dotenv
- Git

## 📦 Instalação e Configuração

### 1️⃣ Clonar o Repositório
```sh
git clone https://github.com/seu-usuario/verifalia-email-validator.git
cd verifalia-email-validator
```

### 2️⃣ Instalar Dependências
```sh
npm install
```

### 3️⃣ Configurar Credenciais da API Verifalia
Crie um arquivo `.env` na raiz do projeto e adicione suas credenciais:

```
VERIFALIA_USERNAME=seu_usuario
VERIFALIA_PASSWORD=sua_senha
```

### 4️⃣ Criar um Arquivo CSV de Teste
O script lê um arquivo CSV com e-mails. Crie um arquivo chamado `emails.csv` no formato abaixo:

```
id;email
1;teste@emailvalido.com
2;email.invalido@exemplo
3;outro@emailvalido.com
```

⚠️ **Importante:** Certifique-se de que o separador seja ponto e vírgula (`;`).

## 📌 Como Executar a Validação

### 1️⃣ Rodar o Script de Validação
```sh
node index.js
```

O script:
- Lê os e-mails do arquivo CSV
- Valida os e-mails usando a API Verifalia
- Cria uma pasta com os resultados
  
### 2️⃣ Estrutura dos Resultados
Após a execução, uma pasta será criada com nome similar a `validacao_emails_1712345678901`, contendo:

📄 `emails_validos.csv` → Lista de e-mails válidos

📄 `emails_invalidos.csv` → Lista de e-mails inválidos

📄 `resumo_validacao.txt` → Estatísticas gerais da verificação

## 🛠 Como Verificar o Saldo de Créditos na Verifalia
```sh
node creditos.js
```
Isso retornará os créditos disponíveis para validação.

## 🤝 Contribuição
Contribuições são bem-vindas! Para sugerir melhorias:
1. Fork o repositório
2. Crie uma branch (`feature/minha-melhoria`)
3. Faça um commit das mudanças (`git commit -m 'Melhoria: Descrição'`)
4. Envie um Pull Request

## 📄 Licença
Este projeto está sob a licença MIT. Sinta-se à vontade para usá-lo e modificá-lo.

---

Feito com ❤️ por [Rodrigo Golfeto](https://github.com/rodrigogolfeto) 🚀

