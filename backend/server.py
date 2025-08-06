from flask import Flask, request, jsonify
from flask_cors import CORS
from text_gen import read_img
import base64
import os

app = Flask(__name__)
CORS(app)

@app.route('/generate_ad', methods=['POST'])
def analyze_image():
    data = request.get_json()
    base64_image = data.get('image')
    template = data.get('template')
    if not base64_image or not template:
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        image = base64.b64decode(base64_image)
        description = read_img(image, template)
        print(f"Analysis completed for template: {template}")
        return jsonify({"result": description})
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return jsonify({"error": f"Failed to process image: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)