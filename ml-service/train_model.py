# train_model.py – ML Training Script Placeholder
# -------------------------------------------------------
# Digital Twin Air Quality Monitoring System
# ML Service – Prototype Placeholder
#
# This file is a scaffold for the future machine learning model.
# No ML logic is implemented here yet.
#
# PLAN (FUTURE IMPLEMENTATION):
#   1. Load AQI sensor dataset (CSV / database)
#   2. Feature engineering on pollutant readings
#   3. Train a Random Forest or XGBoost regression model
#   4. Evaluate and save model to disk
#   5. Expose via predict.py / FastAPI endpoint
#
# TODO: Train Random Forest model
# TODO: Load dataset from CSV or database
# TODO: Feature engineering on pollutants (PM2.5, PM10, NO2, SO2, CO, O3)
# TODO: Split data into train / test sets
# TODO: Model evaluation (MAE, RMSE, R²)
# TODO: Save trained model to models/aqi_model.pkl
# TODO: Log training metrics with MLflow or similar

import os

# ── Placeholder Imports (install when implementing) ────────────────────────
# import pandas as pd
# import numpy as np
# from sklearn.ensemble import RandomForestRegressor
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
# import joblib


def load_dataset(path: str):
    """
    TODO: Load AQI dataset from CSV file.
    Expected columns: station_id, pm25, pm10, no2, so2, co, o3,
                      humidity, zone_type, aqi (target)

    Args:
        path: Path to dataset CSV file.
    Returns:
        pd.DataFrame with sensor readings + AQI target.
    """
    # TODO: Load dataset
    # df = pd.read_csv(path)
    # return df
    raise NotImplementedError("TODO: Load dataset — not yet implemented.")


def preprocess_features(df):
    """
    TODO: Feature engineering.
    - Encode zone_type (one-hot or label encoding)
    - Handle missing values
    - Normalise pollutant readings

    Args:
        df: Raw DataFrame from load_dataset()
    Returns:
        X: Feature matrix
        y: AQI target vector
    """
    # TODO: Feature engineering
    raise NotImplementedError("TODO: Feature engineering — not yet implemented.")


def train_model(X_train, y_train):
    """
    TODO: Train a Random Forest regressor on AQI data.

    Args:
        X_train: Training feature matrix
        y_train: Training AQI target vector
    Returns:
        Trained RandomForestRegressor model
    """
    # TODO: Train Random Forest model
    # model = RandomForestRegressor(
    #     n_estimators=100,
    #     max_depth=10,
    #     random_state=42,
    # )
    # model.fit(X_train, y_train)
    # return model
    raise NotImplementedError("TODO: Train Random Forest model — not yet implemented.")


def evaluate_model(model, X_test, y_test):
    """
    TODO: Evaluate model performance.

    Args:
        model: Trained model
        X_test: Test feature matrix
        y_test: True AQI values
    Returns:
        dict with MAE, RMSE, R² scores
    """
    # TODO: Model evaluation
    # y_pred = model.predict(X_test)
    # mae  = mean_absolute_error(y_test, y_pred)
    # rmse = mean_squared_error(y_test, y_pred, squared=False)
    # r2   = r2_score(y_test, y_pred)
    # return {'mae': mae, 'rmse': rmse, 'r2': r2}
    raise NotImplementedError("TODO: Model evaluation — not yet implemented.")


def save_model(model, output_path: str = "models/aqi_model.pkl"):
    """
    TODO: Persist trained model to disk.

    Args:
        model: Trained model object
        output_path: File path to save model
    """
    # TODO: Save model
    # os.makedirs(os.path.dirname(output_path), exist_ok=True)
    # joblib.dump(model, output_path)
    # print(f"Model saved to {output_path}")
    raise NotImplementedError("TODO: Save model — not yet implemented.")


if __name__ == "__main__":
    print("=" * 55)
    print("  Digital Twin AQI – ML Training Script")
    print("  STATUS: PLACEHOLDER – No ML logic yet.")
    print("=" * 55)
    print()
    print("  TODO: Train Random Forest model")
    print("  TODO: Load dataset from CSV")
    print("  TODO: Feature engineering")
    print("  TODO: Model evaluation")
    print()
    print("  Run this script once the above TODOs are filled.")
