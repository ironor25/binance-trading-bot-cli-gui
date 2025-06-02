import React, { useState, useEffect } from 'react';
import axios from 'axios';



const ORDER_TYPES = [
  { value: 'MARKET', label: 'Market' },
  { value: 'LIMIT', label: 'Limit' },
  { value: 'STOP', label: 'Stop Limit' },
];
const SIDES = [
  { value: 'BUY', label: 'Buy' },
  { value: 'SELL', label: 'Sell' },
];


function App() {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [orderType, setOrderType] = useState('MARKET');
  const [side, setSide] = useState('BUY');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [marketPrice, setMarketPrice] = useState(null);
  const [glow, setGlow] = useState(false);
  const link = "https://binancebotbackend-production.up.railway.app"
  // helpers for showing price/stop fields
  const showPrice = orderType === 'LIMIT' || orderType === 'STOP';
  const showStopPrice = orderType === 'STOP';

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    let order = {
      symbol: symbol.trim(),
      side: side,
      type: orderType,
      quantity: parseFloat(quantity)
    };
    if (orderType === 'LIMIT' || orderType === 'STOP') {
      order.price = price ? parseFloat(price) : undefined;
    }
    if (orderType === 'STOP') {
      order.stop_price = stopPrice ? parseFloat(stopPrice) : undefined;
    }

    axios.post(`${link}/place-order`, order, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        setResult(res.data);
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.detail) {
          setError(err.response.data.detail);
        } else {
          setError('Network error. Please try again.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

    
  useEffect(() => {
    let prevPrice = null;
    const fetchPrice = async () => {
      try {
        const response = await axios.get(`${link}/price`, { params: { data: symbol } });
        const newPrice = response.data.price;
        setMarketPrice(prev => {
          if (prev !== null && parseFloat(prev) !== parseFloat(newPrice)) {
            setGlow(true);
            setTimeout(() => setGlow(false), 400);
          }
          return newPrice;
        });
      } catch (error) {
        // Optionally handle error
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 1000);
    return () => clearInterval(interval);
  }, [symbol]);


  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-3xl p-8 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-center mb-4 text-indigo-400 tracking-tight drop-shadow-lg">Binance Futures Trading Bot</h1>
        {marketPrice !== null && (
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="text-gray-300 text-base">Live Price for {symbol}:</span>
            <span
              className={
                `text-2xl font-bold text-yellow-400 bg-gray-800 px-3 py-1 rounded shadow-inner transition-all duration-300 ${glow ? 'ring-4 ring-yellow-400/60 ring-offset-2' : ''}`
              }
            >
              {parseFloat(marketPrice).toFixed(2)}
            </span>
          </div>
        )}
        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            <label className="mb-1 text-indigo-300 font-semibold self-start">Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={e => setSymbol(e.target.value.toUpperCase())}
              placeholder="BTCUSDT"
              required
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-lg tracking-widest font-mono shadow"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="mb-1 text-indigo-300 font-semibold self-start">Order Type</label>
            <select
              value={orderType}
              onChange={e => setOrderType(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-lg font-semibold shadow"
            >
              {ORDER_TYPES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-center">
            <label className="mb-1 text-indigo-300 font-semibold self-start">Side</label>
            <div className="flex gap-4 w-full justify-center p-2">
              <button
                type="button"
                className="flex-1 p-3 rounded-lg font-bold border-2 text-lg  bg-green-600/80 border-green-400 text-white"                  
                onClick={() => setSide('BUY')}
              >
                Buy
              </button>
              <button
                type="button"
                className="flex-1 p-3 rounded-lg font-bold border-2 text-lg shadow bg-red-500/80 border-red-400 text-white"                  
                onClick={() => setSide('SELL')}
              >
                Sell
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <label className="mb-1 text-indigo-300 font-semibold self-start">Quantity</label>
            <input
              type="number"
              min="0"
              step="any"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-lg font-mono shadow"
            />
          </div>
          {showPrice && (
            <div className="flex flex-col items-center">
              <label className="mb-1 text-indigo-300 font-semibold self-start">Price</label>
              <input
                type="number"
                min="0"
                step="any"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required={orderType === 'LIMIT' || orderType === 'STOP'}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-lg font-mono shadow"
              />
            </div>
          )}
          {showStopPrice && (
            <div className="flex flex-col items-center">
              <label className="mb-1 text-indigo-300 font-semibold self-start">Stop Price</label>
              <input
                type="number"
                min="0"
                step="any"
                value={stopPrice}
                onChange={e => setStopPrice(e.target.value)}
                required={orderType === 'STOP'}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-lg font-mono shadow"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-extrabold py-3 px-4 rounded-xl transition-all duration-150 shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed text-lg tracking-wide"
          >
            {loading ? 'Placing Order...' : 'Submit Order'}
          </button>
        </form>
        {error && (
          <div className="mt-6 text-red-400 bg-red-900/60 p-4 rounded-xl text-center font-semibold shadow-lg w-full">{error}</div>
        )}
        {result && result.success && (
          <div className="mt-6 text-green-400 bg-green-900/60 p-4 rounded-xl text-center font-semibold shadow-lg w-full">
            <b>Order placed successfully!</b>
            <pre className="bg-gray-950 text-white p-3 rounded mt-3 text-left overflow-x-auto text-sm shadow-inner">{JSON.stringify(result.order, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
