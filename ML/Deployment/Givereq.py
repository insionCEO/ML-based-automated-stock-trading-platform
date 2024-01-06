from flask import Flask, request, jsonify
import numpy as np
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import load_model

app = Flask(__name__)

# Standard scaler for normalization
scaler = StandardScaler()


@app.route("/predict/<symbol>", methods=["POST"])
def predict(symbol):
    try:
        # Load the pre-trained model for the specified symbol
        model_path = f"/content/models/{symbol}.h5"
        classifier = load_model(model_path)

        # Get data from the request
        data = request.get_json(force=True)

        # Extract features from the input data
        features = np.array(data["features"]).reshape(1, -1)

        # Normalize the features
        features_scaled = scaler.transform(features)

        # Make predictions
        prediction = classifier.predict(features_scaled)

        # Convert the prediction to -1 or 1
        prediction = np.where(prediction == 0, -1, 1)

        # Return the prediction as JSON
        return jsonify({"prediction": int(prediction[0])})

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(port=5000)
