from flask import Flask, request, jsonify, render_template, send_from_directory
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

MODEL_PATH = "crop_yield_model.joblib"


# -------------------------
# Train Model
# -------------------------
def train_model():
    print("Training model...")

    df = pd.read_csv("crop_data.csv")
    print("Loaded CSV columns:", df.columns.tolist())

    # Auto-detect yield column
    possible_yield_columns = [
        "yield_kg_per_ha",
        "yield",
        "Yield",
        "production",
        "yield_value",
    ]

    yield_column = None
    for col in df.columns:
        if col.strip().lower() in [c.lower() for c in possible_yield_columns]:
            yield_column = col
            break

    if yield_column is None:
        raise KeyError(f"No yield column found! Columns: {df.columns.tolist()}")

    print(f"Using yield column: {yield_column}")

    X = df.drop(yield_column, axis=1)
    y = df[yield_column]

    categorical_features = ["crop_type", "soil_type", "rainfall", "season", "irrigation", "farm_size"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
        ]
    )

    model = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("regressor", LinearRegression())
    ])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model.fit(X_train, y_train)
    joblib.dump(model, MODEL_PATH)
    print("Model trained successfully.")

    return model


# Load saved model or train
if os.path.exists(MODEL_PATH):
    print("Loading saved model...")
    model = joblib.load(MODEL_PATH)
else:
    model = train_model()


# -------------------------
# Prediction API
# -------------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        input_data = pd.DataFrame([{
            "crop_type": data["cropType"],
            "soil_type": data["soilType"],
            "rainfall": data["rainfall"],
            "season": data["season"],
            "irrigation": data["irrigation"],
            "farm_size": data["farmSize"]
        }])

        prediction = model.predict(input_data)[0]

        crops = ["wheat", "rice", "corn", "soybean", "potato"]
        current_crop = data["cropType"]

        yields = {}
        for crop in crops:
            if crop != current_crop:
                alt_input = input_data.copy()
                alt_input["crop_type"] = crop
                yields[crop] = model.predict(alt_input)[0]

        best_alt_crop, best_alt_yield = max(yields.items(), key=lambda x: x[1])

        response = {
            "predicted_yield": float(prediction),
            "confidence": 92,
            "crop_type": current_crop,
            "alternative_crop": best_alt_crop,
            "alternative_yield": float(best_alt_yield),
            "alternative_percent": float(((best_alt_yield - prediction) / prediction) * 100)
        }

        return jsonify(response)

    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": str(e)}), 400


# -------------------------
# Page Routes
# -------------------------
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")


@app.route("/crops")
def crops():
    return render_template("crops.html")


# -------------------------
# Serve components folder
# -------------------------
@app.route("/components/<path:filename>")
def components(filename):
    return send_from_directory("components", filename)


# -------------------------
# Run Server
# -------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
