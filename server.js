const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const bodyParser = require("body-parser");
const crypto = require("crypto");

server.use(middlewares);
server.use(bodyParser.json());

// Rota de login -
server.post("/login", (req, res) => {
  const { email } = req.body;
  const db = router.db;
  const password = req.get("X-Password");

  const usuario = db.get("usuarios").find({ email: email }).value();


  if (!usuario) {
    return res
      .status(401)
      .json({ message: "Email não encontrado.", success: false });
  }

  if (usuario.senha !== password) {
    return res
      .status(401)
      .json({ message: "Senha incorreta.", success: false });
  }

  res.status(200).json({ data: usuario, success: true });
});

// cadastro - ok
server.post("/usuarios", (req, res) => {
  const db = router.db;
  const { email, nome, sobrenome } = req.body;

  const senha = req.get("X-Password");

  const existingUser = db.get("usuarios").find({ email: email }).value();

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Email já cadastrado.", success: false });
  }
  const id = crypto.createHash("md5").update(`${Date.now()}`).digest("hex");
  const transacoes = [];

  const newUser = { id, email, senha, nome, sobrenome, transacoes };
  db.get("usuarios").push(newUser).write();

  res.status(201).json({
    success: true,
    message: "usuario criado com sucesso",
    data: { id, nome },
  });
});

// transações
server.patch("/usuarios/:id/editar/:idTransacao", (req, res) => {
  const db = router.db;
  const { id, idTransacao } = req.params;
  const { valor, descricao, categoria, data, tipo } = req.body;

  // Verifique se a transação com o ID especificado existe
  const usuarioExistente = db.get("usuarios").find({ id }).value();

  if (!usuarioExistente) {
    return res
      .status(404)
      .json({ message: "Transação não encontrada", success: false });
  }

  const transacoes = usuarioExistente.transacoes.map((transacao) => {
    if (transacao.id === idTransacao) {
      return {
        ...transacao,
        valor,
        descricao,
        categoria,
        tipo,
      };
    } else {
      return transacao;
    }
  });

  db.get("usuarios").find({ id }).assign({ transacoes: transacoes }).write();
  res
    .status(200)
    .json({ success: true, message: "Transação atualizada com sucesso" });
});

server.delete("/usuario/:id/deletar/:idTransacao", (req, res) => {
  const db = router.db;
  const { id, idTransacao } = req.params;

  const usuarioExistente = db.get("usuarios").find({ id }).value();

  if (!usuarioExistente) {
    return res
      .status(404)
      .json({ message: "Usuário não encontrado", success: false });
  }

  const transacoes = usuarioExistente.transacoes.filter(
    (transacao) => transacao.id !== idTransacao
  );

  db.get("usuarios").find({ id }).assign({ transacoes: transacoes }).write();
  res
    .status(200)
    .json({ success: true, message: "Transação excluida com sucesso" });
});

// Rota GET para obter todas as transações de um usuário específico
server.get("/usuario/:id/transacoes", (req, res) => {
  const db = router.db;
  const { id } = req.params;

  const usuarioExistente = db.get("usuarios").find({ id }).value();
  if (!usuarioExistente) {
    return res
      .status(404)
      .json({ message: "Usuário não encontrado", success: false });
  }

  res.status(200).json({ success: true, data: usuarioExistente.transacoes });
});

// Rota GET para obter uma transação de um usuário específico
server.get("/usuario/:id/transacao/:idTransacao", (req, res) => {
  const db = router.db;
  const { id, idTransacao } = req.params;

  const usuarioExistente = db.get("usuarios").find({ id }).value();
  if (!usuarioExistente) {
    return res
      .status(404)
      .json({ message: "Usuário não encontrado", success: false });
  }

  const [transacao] = usuarioExistente.transacoes.filter(
    (item) => item.id === idTransacao
  );

  res.status(200).json({ success: true, data: transacao });
});

server.post("/usuario/:id/novatransacao", (req, res) => {
  const db = router.db;
  const { id } = req.params;
  const { descricao, categoria, valor, tipo } = req.body;

  const usuarioExistente = db.get("usuarios").find({ id }).value();

  if (!usuarioExistente) {
    return res
      .status(404)
      .json({ message: "Usuário não encontrado", success: false });
  }

  if (!descricao || !categoria || !valor || !id || !tipo) {
    return res.status(400).json({
      message: "Todos os campos da transação são obrigatórios.",
      data: { descricao, categoria, valor, id, tipo },
      success: false,
    });
  }

  const transacoes = usuarioExistente.transacoes;


  const newTransaction = {
    id: geraId(),
    descricao,
    categoria,
    valor,
    data: obterDataFormatada(),
    tipo,
  };

  transacoes.push(newTransaction);

  db.get("usuarios").find({ id }).assign({ transacoes: transacoes }).write();

  res.status(200).json({ success: true, data: newTransaction });
});

// Rota GET para obter todas as transações por tipo 
server.get("/usuario/:id/transacoes/:tipo", (req, res) => {
  const db = router.db;
  const { id,tipo } = req.params;

  const usuarioExistente = db.get("usuarios").find({ id }).value();

  if (!usuarioExistente) {
    return res
      .status(404)
      .json({ message: "Usuário não encontrado", success: false });
  }

  const transacoes= usuarioExistente.transacoes.filter(
    (transacao) => transacao.tipo === tipo
  );

  res.status(200).json({ success: true, data: transacoes });
});

//=========================categorias=====================================
server.get("/categorias", (req, res) => {
  const db = router.db;

  // Recupere todas as categorias do banco de dados
  const categorias = db.get("categorias").value();

  res.status(200).json({ success: true, data: categorias });
});

server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});

function obterDataFormatada() {
  const data = new Date();
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

function geraId() {
  return crypto.createHash("md5").update(`${Date.now()}`).digest("hex");
}
