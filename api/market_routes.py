from flask import Blueprint, jsonify
from market_data.live_quotes import MarketDataFetcher
import threading
import time

market_bp = Blueprint('market', __name__)
market_fetcher = MarketDataFetcher()

def background_updater():
    while True:
        market_fetcher.fetch_live_prices()
        time.sleep(60)

@market_bp.route('/top10', methods=['GET'])
def get_top_10_prices():
    return jsonify({
        'data': market_fetcher.cache,
        'last_update': market_fetcher.last_update.isoformat() if market_fetcher.last_update else None
    })