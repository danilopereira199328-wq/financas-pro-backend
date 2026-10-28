const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Base de dados em memória temporária (ou podes ligar à tua base de dados real)
let transacoes = [];

// Rota para testar se a API está ativa
app.get('/', (req, res) => {
    res.send('Financas PRO Backend a funcionar!');
});

// Obter transações
app.get('/api/transactions', (req, res) => {
    res.json(transacoes);
});

// Adicionar transação
app.post('/api/transactions', (req, res) => {
    const novaTx = req.body;
    transacoes.unshift(novaTx);
    res.status(201).json({ success: true, novaTx });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
});