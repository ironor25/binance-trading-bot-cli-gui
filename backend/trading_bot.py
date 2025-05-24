import logging
from binance.client import Client
from binance.enums import *
import argparse
import sys
from dotenv import load_dotenv
import os
load_dotenv()

API_KEY = os.getenv("API_KEY")
SECRET_PHRASE_KEY = os.getenv("SECRET_PHRASE_KEY") 




logging.basicConfig(
    filename="bot.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

class BasicBot:
    def __init__(self, api_key, api_secret, testnet=True):
        self.client = Client(api_key, api_secret)
        if testnet:
            self.client.FUTURES_URL = "https://testnet.binancefuture.com/fapi"
        logging.info("Initialized bot with testnet=%s", testnet)

    def place_order(self, symbol, side, order_type, quantity, price=None, stop_price=None):
        try:
            if side not in [SIDE_BUY, SIDE_SELL]:
                raise ValueError("Invalid order side.")

            if order_type == FUTURE_ORDER_TYPE_MARKET:
                order = self.client.futures_create_order(
                    symbol=symbol,
                    side=side,
                    type=FUTURE_ORDER_TYPE_MARKET,
                    quantity=quantity
                )

            elif order_type == FUTURE_ORDER_TYPE_LIMIT:
                if not price:
                    raise ValueError("Price is required for LIMIT order.")
                order = self.client.futures_create_order(
                    symbol=symbol,
                    side=side,
                    type=FUTURE_ORDER_TYPE_LIMIT,
                    quantity=quantity,
                    price=price,
                    timeInForce=TIME_IN_FORCE_GTC
                )

            elif order_type == FUTURE_ORDER_TYPE_STOP:
                print(stop_price,price)
                if not stop_price or not price:
                    raise ValueError("Both stop_price and price are required for STOP_LIMIT order.")
                order = self.client.futures_create_order(
                    symbol=symbol,
                    side=side,
                    type=FUTURE_ORDER_TYPE_STOP,
                    stopPrice=stop_price,
                    price=price,
                    quantity=quantity,
                    timeInForce=TIME_IN_FORCE_GTC
                )

            else:
                raise ValueError("Unsupported order type.")

            logging.info("Order placed: %s", order)
            print("Order successful:", order)
            return order

        except Exception as e:
            logging.error("Error placing order: %s", str(e))
            print("Error:", e)
            return None

def main():
    parser = argparse.ArgumentParser(description="Binance Futures Trading Bot")
    parser.add_argument("--symbol", required=True, help="e.g., BTCUSDT")
    parser.add_argument("--side", required=True, choices=["BUY", "SELL"])
    parser.add_argument("--quantity", required=True, type=float)
    parser.add_argument("--type", required=True, choices=[
    FUTURE_ORDER_TYPE_MARKET,
    FUTURE_ORDER_TYPE_LIMIT,
    FUTURE_ORDER_TYPE_STOP
    ])
    parser.add_argument("--price", type=float, help="Price for LIMIT and STOP orders")
    parser.add_argument("--stop_price", type=float, help="Stop price for STOP orders")

    args = parser.parse_args()

    if args.type == "LIMIT" and not args.price:
        print("Error: --price is required for LIMIT orders.")
        sys.exit(1)

    bot = BasicBot(API_KEY,SECRET_PHRASE_KEY )
    bot.place_order(
        symbol=args.symbol.upper(),
        side=args.side,
        order_type=args.type,
        quantity=args.quantity,
        price=args.price,
        stop_price=args.stop_price
    )

if __name__ == "__main__":
    main()
