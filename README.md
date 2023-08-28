## Documentação da API Finanças+

Esta documentação descreve os endpoints disponíveis na API Finanças+, incluindo os dados necessários, possíveis erros e exemplos de código.

### Rota de Login

#### Endpoint: `/login`

**Método:** POST

**Descrição:** Realiza o login de um usuário com base no email e senha fornecidos.

**Dados Necessários:**

- `email`: O email do usuário.
- `X-Password`: A senha do usuário passada no cabeçalho.

**Possíveis Erros:**

- 401 - Email não encontrado.
- 401 - Senha incorreta.

**Exemplo de Requisição:**

```javascript
const resposta = await api.post(
  "/login",
  { 
    email: "usuario@example.com" 
  },
  { 
    headers: { 
      "X-Password": "senha123"
    } 
  }
);
```

---

### Cadastro de Usuário

#### Endpoint: `/usuarios`

**Método:** POST

**Descrição:** Cadastra um novo usuário.

**Dados Necessários:**

- `email`: O email do usuário.
- `nome`: O nome do usuário.
- `sobrenome`: O sobrenome do usuário.
- `X-Password`: A senha do usuário passada no cabeçalho.

**Possíveis Erros:**

- 400 - Email já cadastrado.

**Exemplo de Requisição:**

```javascript
const resposta = await api.post(
  "/usuarios",
  { 
    email: "novo@example.com", 
    nome: "Novo", 
    sobrenome: "Usuário" 
  },
  { 
    headers: { 
      "X-Password": "senha123" 
    } 
  }
);
```

---

### Atualização de Senha de Usuário

#### Endpoint: `/usuarios/:id/senha`

**Método:** PUT

**Descrição:** Atualiza a senha de um usuário.

**Dados Necessários:**

- `X-Password`: A senha atual do usuário passada no cabeçalho.
- `X-OldPassword`: A senha atual do usuário passada no cabeçalho.

**Possíveis Erros:**

- 404 - Usuário não encontrado.
- 400 - A nova senha deve ser diferente da senha atual.
- 400 - A senha atual está incorreta.

**Exemplo de Requisição:**

```javascript
const resposta = await api.put("/usuarios/1/senha", null, {
  headers: {
    "X-Password": "senha123",
    "X-OldPassword": "123senha",
  },
});
```

---

### Exclusão de Usuário

#### Endpoint: `/usuarios/:id`

**Método:** DELETE

**Descrição:** Exclui um usuário.

**Dados Necessários:**

- `X-Password`: A senha do usuário passada no cabeçalho.

**Possíveis Erros:**

- 404 - Usuário não encontrado.
- 401 - Senha incorreta.

**Exemplo de Requisição:**

```javascript
const resposta = await api.delete("/usuarios/1", {
  headers: { 
    "X-Password": "senha123" 
  },
});
```

---

### Cadastro de Transação

#### Endpoint: `/transacoes`

**Método:** POST

**Descrição:** Cadastra uma nova transação.

**Dados Necessários:**

- `nome`: Nome da transação.
- `descricao`: Descrição da transação.
- `categoria`: Categoria da transação.
- `data`: Data da transação.
- `tipo`: Tipo da transação (entrada ou saída).
- `usuario`: ID do usuário relacionado à transação.
- `X-Password`: A senha do usuário passada no cabeçalho.

**Possíveis Erros:**

- 400 - Todos os campos da transação são obrigatórios.

**Exemplo de Requisição:**

```javascript
const transacao = {
  nome: "Compra de Livro",
  descricao: "Livro de Ficção Científica",
  categoria: "Livros",
  data: "2023-08-30",
  tipo: "saida",
  usuario: 1,
};

const resposta = await api.post("/transacoes", transacao, {
  headers: { 
    "X-Password": "senha123" 
  },
});
```

---

### Obtenção de Transação por ID

#### Endpoint: `/transacoes/:id`

**Método:** GET

**Descrição:** Obtém uma transação pelo seu ID.

**Possíveis Erros:**

- 404 - Transação não encontrada.

**Exemplo de Requisição:**

```javascript
const resposta = await api.get("/transacoes/1");
```

---

### Atualização de Transação por ID

#### Endpoint: `/transacoes/:id`

**Método:** PATCH

**Descrição:** Atualiza uma transação pelo seu ID.

**Dados Necessários:**

- `nome`: Nome da transação.
- `descricao`: Descrição da transação.
- `categoria`: Categoria da transação.
- `data`: Data da transação.
- `tipo`: Tipo da transação (entrada ou saída).

**Possíveis Erros:**

- 404 - Transação não encontrada.

**Exemplo de Requisição:**

```javascript
const atualizacao = {
  nome: "Nova Descrição",
  descricao: "Descrição atualizada",
  categoria: "Outra Categoria",
  data: "2023-08-31",
  tipo: "entrada",
};

const resposta = await api.patch("/transacoes/1", atualizacao, {
  headers: { 
    "X-Password": "senha123" 
  },
});
```

---

### Exclusão de Transação por ID

#### Endpoint: `/transacoes/:id`

**Método:** DELETE

**Descrição:** Exclui uma transação pelo seu ID.

**Dados Necessários:**

- `userId`: ID do usuário relacionado à transação.
- `X-Password`: A senha do usuário passada no cabeçalho.

**Possíveis Erros:**

- 404 - Transação não encontrada.
- 404 - Usuário não encontrado.
- 401 - Senha incorreta.

**Exemplo de Requisição:**

```javascript
const resposta = await api.delete("/transacoes/1", {
  data: { 
    userId: 1 
  },
  headers: {
    "X-Password": "senha123" 
  },
});
```

---

### Obtenção de Todas as Transações de um

Usuário

#### Endpoint: `/transacoes/usuario/:id`

**Método:** GET

**Descrição:** Obtém todas as transações de um usuário específico pelo seu ID.

**Possíveis Erros:**

- 404 - Usuário não encontrado.

**Exemplo de Requisição:**

```javascript
const resposta = await api.get("/transacoes/usuario/1");
```

---

### Obtenção de Todas as Transações do Tipo "Entrada" de um Usuário

#### Endpoint: `/transacoes/usuario/:id/entrada`

**Método:** GET

**Descrição:** Obtém todas as transações do tipo "entrada" de um usuário específico pelo seu ID.

**Possíveis Erros:**

- 404 - Usuário não encontrado.

**Exemplo de Requisição:**

```javascript
const resposta = await api.get("/transacoes/usuario/1/entrada");
```

---

### Obtenção de Todas as Transações do Tipo "Saída" de um Usuário

#### Endpoint: `/transacoes/usuario/:id/saida`

**Método:** GET

**Descrição:** Obtém todas as transações do tipo "saída" de um usuário específico pelo seu ID.

**Possíveis Erros:**

- 404 - Usuário não encontrado.

**Exemplo de Requisição:**

```javascript
const resposta = await api.get("/transacoes/usuario/1/saida");
```

---

### Cadastro de Categoria

#### Endpoint: `/categorias`

**Método:** POST

**Descrição:** Cadastra uma nova categoria.

**Dados Necessários:**

- `categoria`: Nome da categoria.

**Possíveis Erros:**

- 400 - A categoria especificada já existe.

**Exemplo de Requisição:**

```javascript
const resposta = await api.post("/categorias", { 
  categoria: "Nova Categoria" 
});
```

---

### Obtenção de Todas as Categorias

#### Endpoint: `/categorias`

**Método:** GET

**Descrição:** Obtém todas as categorias cadastradas.

**Exemplo de Requisição:**

```javascript
const resposta = await api.get("/categorias");
```
