if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração da Base de Dados PostgreSQL (ex: Neon.tech, Supabase ou Railway)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Necessário para o Supabase na nuvem
});

// Testar Ligação à Base de Dados
pool.connect()
    .then(() => console.log('Base de dados PostgreSQL ligada com sucesso!'))
    .catch(err => console.error('Erro de ligação à base de dados:', err));

// Rota de Teste da API
app.get('/api/status', (req, res) => {
    res.json({ status: 'Online', message: 'Finanças PRO Backend a funcionar a 100%!' });
});

// Endpoint para Buscar Transações Reais da BD
app.get('/api/transactions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC', [userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint para Adicionar Transação Real
app.post('/api/transactions', async (req, res) => {
    try {
        const { userId, type, desc, amount, date, category, currency, tags } = req.body;
        const query = `INSERT INTO transactions (user_id, type, description, amount, date, category, currency, tags) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
        const values = [userId, type, desc, amount, date, category, currency, tags];
        const newTx = await pool.query(query, values);
        res.status(201).json(newTx.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));