from flask import Blueprint, jsonify, request
import json

hybrid_bp = Blueprint('hybrid', __name__)

@hybrid_bp.route('/zybTrackerStatisticsAction', methods=['GET'])
def zyb_tracker_statistics():
    data = request.args.get('data', '{}')
    callback = request.args.get('__callback__', '')
    
    response = {
        "status": "success",
        "data": {}
    }
    
    if callback:
        return f"{callback}({json.dumps(response)})"
    return jsonify(response)