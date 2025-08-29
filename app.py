from flask import Flask
from api.market_routes import market_bp
from api.hybrid_routes import hybrid_bp

app = Flask(__name__)
app.register_blueprint(market_bp, url_prefix='/market')
app.register_blueprint(hybrid_bp, url_prefix='/hybridaction')

if __name__ == '__main__':
    app.run(debug=True)