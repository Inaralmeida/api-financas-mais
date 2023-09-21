## Documentação da API Finanças+

Esta documentação descreve os endpoints disponíveis na API Finanças+, incluindo os dados necessários, possíveis erros e exemplos de código.

## Endpoints de Usuário

#### Login

**Descrição:** Realiza a autenticação do usuário.

**Método:** POST

**Endpoint:** `/login`

**Parâmetros:**
- Nenhum parâmetro é necessário na URL.

**Corpo da Solicitação (Body):**
- `email` (string, obrigatório): O email do usuário.
- `senha` deve ser passado no cabeçalho `X-Password`.

**Possíveis Saídas de Erro:**
- Status 401 - Email não encontrado: Quando o email fornecido não corresponde a nenhum usuário.
- Status 401 - Senha incorreta: Quando a senha fornecida não corresponde à senha do usuário.

**Saída em Caso de Sucesso:**
- Status 200: A autenticação foi bem-sucedida.
- Corpo da resposta:
  - `data` (objeto): Contém informações do usuário autenticado.
  - `success` (boolean): Indica o sucesso da operação.

**Exemplo de Chamada:**
```javascript

axios.post('/login', {
  email: 'usuario@example.com'
}, {
  headers: {
    'X-Password': 'senha_secreta'
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error.response.data);
});
```

#### Cadastro de Usuários

**Descrição:** Cadastra um novo usuário.

**Método:** POST

**Endpoint:** `/usuarios`

**Parâmetros:**
- Nenhum parâmetro é necessário na URL.

**Corpo da Solicitação (Body):**
- `email` (string, obrigatório): O email do novo usuário.
- `nome` (string, obrigatório): O nome do novo usuário.
- `sobrenome` (string, obrigatório): O sobrenome do novo usuário.
- `senha` deve ser passado no cabeçalho `X-Password`.

**Possíveis Saídas de Erro:**
- Status 400 - Email já cadastrado: Quando o email já está em uso por outro usuário.
- Status 400 - Todos os campos são obrigatórios: Quando algum dos campos obrigatórios está ausente no corpo da solicitação.

**Saída em Caso de Sucesso:**
- Status 201: O usuário foi criado com sucesso.
- Corpo da resposta:
  - `data` (objeto): Contém informações do novo usuário.
  - `success` (boolean): Indica o sucesso da operação.
  - `message` (string): Mensagem de sucesso.

**Exemplo de Chamada:**
```javascript

axios.post('/usuarios', {
  email: 'novo_usuario@example.com',
  nome: 'Novo',
  sobrenome: 'Usuário'
}, {
  headers: {
    'X-Password': 'senha_secreta'
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error.response.data);
});
```


## Endpoints de Transações

#### Todas as Transações de um Usuário

**Descrição:** Obtém a lista de todas as transações de um usuário específico.

**Método:** GET

**Endpoint:** `/usuario/:id/transacoes/`

**Parâmetros:**
- `id` (string, obrigatório): O ID do usuário para o qual deseja listar as transações.

**Possíveis Saídas de Erro:**
- Status 404 - Usuário não encontrado: Quando o usuário com o ID especificado não existe.

**Saída em Caso de Sucesso:**
- Status 200: As transações foram obtidas com sucesso.
- Corpo da resposta:
  - `success` (boolean): Indica o sucesso da operação.
  - `data` (array): Contém a lista de todas as transações do usuário.

**Exemplo de Chamada:**
```javascript

axios.get('/usuario/123/transacoes', {
  headers: {
    'X-Password': 'senha_secreta'
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error.response.data);
});
```
---
#### Transação Específica de um Usuário

**Descrição:** Obtém os detalhes de uma transação específica de um usuário.

**Método:** GET

**Endpoint:** `/usuario/:id/transacao/:idTransacao`

**Parâmetros:**
- `id` (string, obrigatório): O ID do usuário para o qual deseja obter os detalhes da transação.
- `idTransacao` (string, obrigatório): O ID da transação que deseja detalhar.

**Possíveis Saídas de Erro:**
- Status 404 - Usuário não encontrado: Quando o usuário com o ID especificado não existe.
- Status 404 - Transação não encontrada: Quando a transação com o ID especificado não existe.

**Saída em Caso de Sucesso:**
- Status 200: Os detalhes da transação foram obtidos com sucesso.
- Corpo da resposta:
  - `success` (boolean): Indica o sucesso da operação.
  - `data` (objeto): Contém os detalhes da transação específica.

**Exemplo de Chamada:**
```javascript

axios.get('/usuario/123/transacao/456')
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error.response.data);
});
```
---

#### Endpoint de Listagem de Transações por Tipo

**Descrição:** Obtém a lista de transações de um usuário específico com base no tipo de transação (entrada ou saída).

**Método:** GET

**Endpoint:** `/usuario/:id/transacoes/:tipo`

**Parâmetros:**
- `id` (string, obrigatório): O ID do usuário para o qual deseja listar as transações.
- `tipo` (string, obrigatório): O tipo de transação desejado, que deve ser "entrada" ou "saída".

**Possíveis Saídas de Erro:**
- Status 404 - Usuário não encontrado: Quando o usuário com o ID especificado não existe.
- Status 400 - Tipo de transação inválido: Quando o parâmetro `tipo` não é "entrada" nem "saída".

**Saída em Caso de Sucesso:**
- Status 200: As transações foram obtidas com sucesso.
- Corpo da resposta:
  - `success` (boolean): Indica o sucesso da operação.
  - `data` (array): Contém a lista de transações do usuário com o tipo especificado.

**Exemplo de Chamada:**
```javascript
// Exemplo de chamada usando Axios em JavaScript
axios.get('/usuario/123/transacoes/entrada')
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error.response.data);
});
```

---
#### Criação de Nova Transação para um Usuário

**Descrição:** Cria uma nova transação para um usuário.

**Método:** POST

**Endpoint:** `/usuario/:id/novatransacao`

**Parâmetros:**
- `id` (string, obrigatório): O ID do usuário para o qual deseja criar a nova transação.

**Corpo da Solicitação (Body):**
- `descricao` (string, obrigatório): A descrição da nova transação.
- `categoria` (string, obrigatório): A categoria da nova transação.
- `valor` (string, obrigatório): O valor da nova transação.
- `tipo` (string, obrigatório): O tipo da nova transação (entrada ou saída).


**Possíveis Saídas de Erro:**
- Status 404 - Usuário não encontrado: Quando o usuário com o ID especificado não existe.
- Status 400 - Todos os campos da transação são obrigatórios: Quando algum dos campos obrigatórios está ausente no corpo da solicitação.

**Saída em Caso de Sucesso:**
- Status 200: A nova transação foi criada com sucesso.
- Corpo da resposta:
  - `success` (boolean): Indica o sucesso da operação.
  - `data` (objeto): Contém informações da nova transação criada.

**Exemplo de Chamada:**
```javascript

axios.post('/usuario/123/novatransacao', {
  descricao: 'Nova transação',
  categoria: 'Alimentação',
  valor: 50,
  tipo: 'saída'
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error.response.data);
});
```

---
#### Atualização de Transação

**Descrição:** Atualiza uma transação específica de um usuário.

**Método:** PATCH

**Endpoint:** `/usuarios/:id/editar/:idTransacao`

**Parâmetros:**
- `id` (string, obrigatório): O ID do usuário.
- `idTransacao` (string, obrigatório): O ID da transação a ser atualizada no usuário.

**Corpo da Solicitação (Body):**
- `valor` (number, opcional): O novo valor da transação.
- `descricao` (string, opcional): A nova descrição da transação.
- `categoria` (string, opcional): A nova categoria da transação.
- `data` (string, opcional): A nova data da transação.
- `tipo` (string, opcional): O novo tipo da transação (entrada ou saída).

**Possíveis Saídas de Erro:**
- Status 404 - Transação não encontrada: Quando a transação com o ID especificado não existe.


**Saída em Caso de Sucesso:**
- Status 200: A transação foi atualizada com sucesso.
- Corpo da resposta:
  - `success` (boolean): Indica o sucesso da operação.
  - `message` (string): Mensagem de sucesso.

**Exemplo de Chamada:**
```javascript

axios.patch('/usuarios/123/editar/456', {
  valor: 100,
  descricao: 'Nova descrição',
  categoria: 'Nova categoria',
  data: '2023-09-19',
  tipo: 'entrada'
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error.response.data);
});
```
---
#### Exclusão de Transação

**Descrição:** Exclui uma transação específica de um usuário.

**Método:** DELETE

**Endpoint:** `/usuario/:id/deletar/:idTransacao`

**Parâmetros:**
- `id` (string, obrigatório): O ID do usuário.
- `idTransacao` (string, obrigatório): O ID da transação a ser excluída no usuário.

**Possíveis Saídas de Erro:**
- Status 404 - Usuário não encontrado: Quando o usuário com o ID especificado não existe.
- Status 404 - Transação não encontrada: Quando a transação com o ID especificado não existe.


**Saída em Caso de Sucesso:**
- Status 200: A transação foi excluída com sucesso.
- Corpo da resposta:
  - `success` (boolean): Indica o sucesso da operação.
  - `message` (string): Mensagem de sucesso.

**Exemplo de Chamada:**
```javascript

axios.delete('/usuario/123/deletar/456')
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error.response.data);
});
```

---
#### Listagem de Categorias

**Descrição:** Obtém a lista de todas as categorias disponíveis.

**Método:** GET

**Endpoint:** `/categorias`

**Parâmetros:**
- Nenhum parâmetro é necessário.


**Saída em Caso de Sucesso:**
- Status 200: As categorias foram obtidas com sucesso.
- Corpo da resposta:
  - `success` (boolean): Indica o sucesso da operação.
  - `data` (array): Contém a lista de categorias.

**Exemplo de Chamada:**
```javascript

axios.get('/categorias')
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error.response.data);
});
```


