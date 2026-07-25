const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // Excel accede sin problemas
app.use(express.json());

const PORT = process.env.PORT || 3001;

/**
 * Genera la URL completa para consultar múltiples símbolos en Binance.
 * @param {string[]} symbols - Array con los pares (ej. ['BTCUSDT', 'ETHUSDT'])
 * @returns {string} URL formateada y lista para usar en fetch
 */
function buildBinanceUrl(symbols) {
  const baseUrl = 'https://api.binance.com/api/v3/ticker/price';
  
  // Limpiamos espacios y convertimos a mayúsculas por seguridad
  const cleanSymbols = symbols.map(s => s.trim().toUpperCase());
  
  // Creamos la URL y añadimos el parámetro `symbols` como un string JSON
  const url = new URL(baseUrl);
  url.searchParams.append('symbols', JSON.stringify(cleanSymbols));
  
  return url.toString();
}

// --- Ejemplo de uso ---

const misMonedas = ['btcusdt', 'bnbusdt', 'ethusdt', 'solusdt', 'adausdt', 'suiusdt', 'wbethusdt', 'xrpusdt', 'paxgusdt', 'bnsolusdt', 'asterusdt'];
const targetUrl = buildBinanceUrl(misMonedas);

//console.log(targetUrl);
// Resultado:
// https://api.binance.com/api/v3/ticker/price?symbols=%5B%22BTCUSDT%22%2C%22ETHUSDT%22%2C%22SOLUSDT%22%2C%22ADAUSDT%22%5D


// Endpoint para Excel: /api/criptos
app.get('/api/criptos', async (req, res) => {
  try {
    // Llama CoinGecko (gratis)
    //let url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano&vs_currencies=usd&include_24hr_change=true';
    //let url = 'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&symbols=btc,eth,bnsol,ada,sui,xrp,wbeth,bnb,paxg,sol,aster';
    let url = targetUrl;
    const { data } = await axios.get(
      url
    );

    // Formato PERFECTO para Excel (array de objetos)
    const precios = Object.entries(data).map(([id, cripto]) => ({
      name: cripto.symbol.replace('USDT','').toUpperCase(),
      price: `${parseFloat(cripto.price).toLocaleString('es-VE')}`,
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
