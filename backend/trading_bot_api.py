from fastapi import FastAPI , HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from trading_bot_cli import BasicBot
from dotenv import load_dotenv
import os
load_dotenv()

API_KEY = os.getenv("API_KEY")
SECRET_PHRASE_KEY = os.getenv("SECRET_PHRASE_KEY") 


bot = BasicBot(API_KEY,SECRET_PHRASE_KEY)
app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Order(BaseModel):
    symbol: str
    side: str
    type: str
    quantity: float
    price: float = None
    stop_price: float = None


@app.get("/price")
def get_price(data: str):

    try:
        data = data.upper()
        ticker = bot.client.futures_symbol_ticker(symbol=data)
        return {
            "symbol": ticker["symbol"],
            "price": float(ticker["price"])
        }
    except Exception as e:
        return {"error": str(e)}
    
@app.post("/place-order")
def order_request(order : Order):
    print(order)
    order_type = order.type.upper()

    if order_type == "LIMIT"  and order.price == None:
        raise HTTPException(status_code= 400 , detail= "Price is required with the order.")
    
    elif order_type == "STOP"  and (order.price is None or order.stop_price is None):
        raise HTTPException(status_code= 400 , detail= "Both price and stop_price are required for STOP orders.")
    
    try:
        placed_order = bot.place_order(
            symbol=order.symbol.upper(),
            side=order.side.upper(),
            order_type=order_type,
            quantity=order.quantity,
            price=order.price,
            stop_price=order.stop_price
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Order failed: {str(e)}")

    return {"success": True, "order": placed_order}