import yfinance as yf
import pandas as pd
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MarketDataFetcher:
    def __init__(self):
        self.symbols = [
            "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS",
            "ICICIBANK.NS", "HINDUNILVR.NS", "ITC.NS",
            "LT.NS", "SBIN.NS", "BHARTIARTL.NS"
        ]
        self.last_update = None
        self.cache = {}

    def fetch_live_prices(self):
        try:
            for symbol in self.symbols:
                stock = yf.Ticker(symbol)
                data = stock.history(period="1d", interval="1m")
                if not data.empty:
                    self.cache[symbol] = {
                        'price': float(data['Close'][-1]),
                        'volume': int(data['Volume'][-1]),
                        'timestamp': datetime.now().isoformat()
                    }
                    logger.info(f"Updated {symbol}: ₹{self.cache[symbol]['price']}")
            
            self.last_update = datetime.now()
            return self.cache
        except Exception as e:
            logger.error(f"Error fetching market data: {e}")
            return None