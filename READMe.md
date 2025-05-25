# Binance Futures Trading Bot

This project provides both a **CLI interface** and a **full-stack GUI** for trading Binance USDT-margined futures contracts. You can place orders via the command line or through a modern React web interface, with a FastAPI backend.

---

## 1. CLI Interface (Command Line)

The CLI lets you place futures orders directly from your terminal. It uses the `trading_bot_cli.py` script.

### Note:

To use CLI Interface first complete installation.

### Usage

```bash
python trading_bot_cli.py --symbol BTCUSDT --side BUY --quantity 0.01 --type LIMIT --price 65000
```

**Arguments:**

- `--symbol` (required): Trading pair, e.g., BTCUSDT
- `--side` (required): BUY or SELL
- `--quantity` (required): Order quantity (float)
- `--type` (required): Order type: MARKET, LIMIT, or STOP
- `--price`: Price for LIMIT and STOP orders
- `--stop_price`: Stop price for STOP orders

**Examples:**

Place a market order:

```bash
python trading_bot_cli.py --symbol BTCUSDT --side BUY --quantity 0.01 --type MARKET
```

Place a stop-limit order:

```bash
python trading_bot_cli.py --symbol BTCUSDT --side SELL --quantity 0.01 --type STOP --price 64000 --stop_price 63900
```

---

## 2. GUI Interface (Web App)

The GUI is a modern React app with a FastAPI backend. It allows you to place orders and view live market prices in your browser.

### Features

- Place MARKET, LIMIT, and STOP orders
- Live price feed for any symbol
- Clean, trading-inspired UI
- Error and success notifications

---

## 3. Installation & Setup

### Backend (FastAPI)

1. **(Recommended) Create a virtual environment**  
   This helps avoid library version conflicts:
   ```bash
   cd backend
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Set up your Binance API keys:**
   - Copy `.env.example` to `.env` and fill in your API_KEY and SECRET_PHRASE_KEY.
   - Or edit `.env` directly.
4. **Run the FastAPI server:**
   ```bash
   uvicorn trading_bot_api:app --reload
   ```

### Frontend (React)

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. **Open your browser:**
   - Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal)

---

## 4. API Endpoints

**POST `/place-order`**

- Place a futures order. JSON body:
  ```json
  {
    "symbol": "BTCUSDT",
    "side": "BUY",
    "type": "LIMIT",
    "quantity": 0.01,
    "price": 65000,
    "stop_price": 64000
  }
  ```

**GET `/price?symbol=BTCUSDT`**

- Get the latest price for a symbol.

---

## 5. Notes

- The backend uses Binance Testnet by default for safe testing.
- For production, update the URLs and API keys accordingly.
- The frontend uses Tailwind CSS for styling.

---

## 6. License

MIT License
