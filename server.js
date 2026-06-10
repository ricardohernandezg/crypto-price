const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // Excel accede sin problemas
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Endpoint para Excel: /api/criptos
app.get('/api/criptos', async (req, res) => {
  try {
    // Llama CoinGecko (gratis)
    //let url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano&vs_currencies=usd&include_24hr_change=true';
    let url = 'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&symbols=btc,eth,bnsol,ada,sui,xrp,wbeth,bnb,paxg,sol,aster';
    const { data } = await axios.get(
      url
    );

    // Formato PERFECTO para Excel (array de objetos)
    const precios = Object.entries(data).map(([id, info]) => ({
      cripto: id.toUpperCase(),
      price: `$${info.usd.toLocaleString()}`,
      timestamp: new Date().toLocaleString('es-VE')
    }));

    res.json(precios);
  } catch (error) {
    res.json([{ error: 'No precios disponibles' }]);
  }
});

// Test endpoint
app.get('/', (req, res) => {
  res.json({ mensaje: '🪙 Servidor crypto listo! Usa /api/criptos' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
  console.log(`📊 Excel: http://localhost:${PORT}/api/criptos`);
});
