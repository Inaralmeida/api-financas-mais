const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const bodyParser = require("body-parser");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Middleware para validar o token JWT em rotas protegidas
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ message: "Acesso não autorizado." });

  try {
    const decoded = jwt.verify(token, "secreto"); // Substitua 'secreto' por sua chave secreta real
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(401).json({ message: "Token inválido." });
  }
};

server.use(middlewares);
server.use(bodyParser.json());

// Rota de login
server.post("/login", (req, res) => {
  const { email } = req.body;
  const db = router.db;

  const password = req.get("X-Password");
  const usuario = db.get("usuarios").find({ email: email }).value();

  if (!usuario) {
    return res.status(401).json({ message: "Email não encontrado." , success: false});
  }

  if (usuario.senha !== password) {
    return res.status(401).json({ message: "Senha incorreta."  , success: false});
  }

  res.status(200).json({data: usuario  , success: true });
});

//=========================usuarios=====================================
server.post("/usuarios", (req, res) => {
  const db = router.db;
  const { email, nome, sobrenome } = req.body;

  const senha = req.get("X-Password");

  const existingUser = db.get("usuarios").find({ email: email }).value();

  if (existingUser) {
    return res.status(400).json({ message: "Email já cadastrado.", success: false });
  }
  const id = crypto.createHash("md5").update(`${Date.now()}`).digest("hex");

  const newUser = { id, email, senha, nome, sobrenome };
  db.get("usuarios").push(newUser).write();

  res.status(201).json({success: true, message: 'usuario criado com sucesso', data: newUser});
});

server.put('/usuarios/:id/senha', (req, res) => {
    const db = router.db;
    const { id } = req.params;
    const newPassword = req.get('X-Password');
    const oldPassword = req.get('X-OldPassword');
  
    const usuarioExistente = db.get('usuarios').find({ id }).value();
  
    if (!usuarioExistente) {
      return res.status(404).json({ message: 'Usuário não encontrado.', success: false });
    }
  
    if (newPassword === usuarioExistente.senha) {
        return res.status(400).json({ message: 'A nova senha deve ser diferente da senha atual.', success: false });
      }

    if (oldPassword !== usuarioExistente.senha) {
        return res.status(400).json({ message: 'Senha atual invalida', success: false });
      }
  
    db.get('usuarios').find({ id }).assign({ senha: newPassword }).write();
  
    res.status(200).json({ message: 'Senha atualizada com sucesso.', success: true });
  });

server.delete('/usuarios/:id', (req, res) => {
    const db = router.db;
    const { id } = req.params;
    const senha = req.get('X-Password'); 
  
    const usuarioExistente = db.get('usuarios').find({ id }).value();
  
    if (!usuarioExistente) {
      return res.status(404).json({ message: 'Usuário não encontrado', success: false });
    }
  
    if (senha !== usuarioExistente.senha) {
      return res.status(401).json({ message: 'Senha incorreta', success: false });
    }
  
    db.get('usuarios').remove({ id }).write();
  
    res.status(200).json({ message: 'Usuário excluído com sucesso', success: true });
  });
  

//=========================transações=====================================

server.post("/transacoes", (req, res) => {
  const { nome, descricao, categoria, data, tipo, usuario } = req.body;
  const db = router.db;

  if (!nome || !descricao || !categoria || !data || !tipo || !usuario) {
    return res
      .status(400)
      .json({ message: "Todos os campos da transação são obrigatórios.", data: {nome, descricao, categoria, data, tipo, usuario}, success: false });
  }

  const id = crypto.createHash("md5").update(`${Date.now()}`).digest("hex");

  const newData = { id, nome, descricao, categoria, data, tipo, usuario };
  db.get("transacoes").push(newData).write();

  res.status(200).json({ success: true, message:'transação adicionada com sucesso' });
});

server.get('/transacoes/:id', (req, res) => {
    const db = router.db;
    const { id } = req.params;
  
    const transacao = db.get('transacoes').find({ id }).value();
  
    if (!transacao) {
      return res.status(404).json({ message: 'Transação não encontrada', success: false });
    }
  
    res.status(200).json({ success: true, data: transacao });
  });

server.patch('/transacoes/:id', (req, res) => {
const db = router.db;
const { id } = req.params;
const { nome, descricao, categoria, data, tipo } = req.body;

// Verifique se a transação com o ID especificado existe
const transacaoExistente = db.get('transacoes').find({ id }).value();

if (!transacaoExistente) {
    return res.status(404).json({ message: 'Transação não encontrada', success: false });
}

// Atualize a transação (exceto ID e usuário)
db.get('transacoes').find({ id }).assign({ nome, descricao, categoria, data, tipo }).write();

res.status(200).json({ success: true, message: 'Transação atualizada com sucesso' });
});

server.delete('/transacoes/:id', (req, res) => {
    const db = router.db;
    const { id } = req.params;
    const { userId } = req.body;
    const senha = req.get('X-Password'); 
  
    const transacaoExistente = db.get('transacoes').find({ id }).value();
  
    if (!transacaoExistente) {
      return res.status(404).json({ message: 'Transação não encontrada', success: false });
    }
  
    const usuarioExistente = db.get('usuarios').find({ id: userId }).value();
  
    if (!usuarioExistente) {
      return res.status(404).json({ message: 'Usuário não encontrado', success: false });
    }
  
    if (senha !== usuarioExistente.senha) {
      return res.status(401).json({ message: 'Senha incorreta', success: false });
    }
  
    db.get('transacoes').remove({ id }).write();
  
    res.status(200).json({ success: true, message: 'Transação excluída com sucesso' });
  });

// Rota GET para obter todas as transações de um usuário específico
server.get('/transacoes/usuario/:id', (req, res) => {
    const db = router.db;
    const { id } = req.params;
  
    const usuarioExistente = db.get('usuarios').find({ id }).value();
  
    if (!usuarioExistente) {
      return res.status(404).json({ message: 'Usuário não encontrado', success: false });
    }
  
    const transacoesUsuario = db.get('transacoes').filter({ usuario: id }).value();
  
    res.status(200).json({ success: true, data: transacoesUsuario });
  });

// Rota GET para obter todas as transações do tipo "entrada" de um usuário específico
server.get('/transacoes/usuario/:id/entrada', (req, res) => {
    const db = router.db;
    const { id } = req.params;
  
    const usuarioExistente = db.get('usuarios').find({ id }).value();
  
    if (!usuarioExistente) {
      return res.status(404).json({ message: 'Usuário não encontrado', success: false });
    }
  
    const transacoesEntrada = db.get('transacoes').filter({ usuario: id, tipo: 'entrada' }).value();
  
    res.status(200).json({ success: true, data: transacoesEntrada });
  });

// Rota GET para obter todas as transações do tipo "saída" de um usuário específico
server.get('/transacoes/usuario/:id/saida', (req, res) => {
    const db = router.db;
    const { id } = req.params;
  
    // Verifique se o usuário com o ID especificado existe
    const usuarioExistente = db.get('usuarios').find({ id }).value();
  
    if (!usuarioExistente) {
      return res.status(404).json({ message: 'Usuário não encontrado', success: false });
    }
  
    // Recupere todas as transações do tipo "saída" do usuário com base no ID do usuário
    const transacoesSaida = db.get('transacoes').filter({ usuario: id, tipo: 'saida' }).value();
  
    res.status(200).json({ success: true, data: transacoesSaida });
  });
  
//=========================categorias=====================================
server.post("/categorias", (req, res) => {
  const { categoria } = req.body;
  const db = router.db;

  const categoriaExistente = db
    .get("categorias")
    .find({ id: categoria })
    .value();

  if (categoriaExistente) {
    return res.status(400).json({ message: "A categoria especificada já existe.", success: false });
  }

  const id = crypto.createHash("md5").update(`${Date.now()}`).digest("hex");

  const newData = { id, categoria };
  db.get("transacoes").push(newData).write();

  res.status(200).json({ success: true, message: 'transação adicionada com sucesso.' });
})

server.get('/categorias', (req, res) => {
    const db = router.db;
  
    // Recupere todas as categorias do banco de dados
    const categorias = db.get('categorias').value();
  
    res.status(200).json({ success: true, data: categorias });
  });
  

server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
