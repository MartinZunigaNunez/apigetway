// api-gateway/index.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:4010', // <--- tu frontend
  credentials: true
}));


const { AUTH_SERVICE, PRODUCT_SERVICE, CART_SERVICE } = process.env;

app.get('/', (req, res) => {
  res.send('🚪 API Gateway funcionando');
});

// 🔐 Rutas manuales
app.post('/api/auth/register', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE}/api/auth/register`, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE}/api/auth/login`, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// Ejemplo con headers y token
app.get('/api/cart', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const response = await axios.get(`${CART_SERVICE}/api/cart`, {
      headers: { Authorization: token }
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE}/api/products`, req.body);
    res.status(response.status).json(response.data);

  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway escuchando en http://localhost:${PORT}`);
});
