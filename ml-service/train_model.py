import pandas as pd
import os
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

# 📁 Path to your dataset folder
DATA_FOLDER = "../backend/src/data/aqi"

# ─────────────────────────────────────────────
# STEP 1: LOAD ALL CSV FILES
# ─────────────────────────────────────────────
dfs = []

for file in os.listdir(DATA_FOLDER):
    if file.endswith(".csv"):
        file_path = os.path.join(DATA_FOLDER, file)
        print(f"Loading: {file}")
        df = pd.read_csv(file_path)
        dfs.append(df)

# Combine all files
data = pd.concat(dfs, ignore_index=True)

print("\nInitial Shape:", data.shape)
print("Columns:", data.columns.tolist())

# ─────────────────────────────────────────────
# STEP 2: CLEAN COLUMN NAMES
# ─────────────────────────────────────────────
data.columns = data.columns.str.strip().str.lower()

print("\nCleaned Columns:", data.columns.tolist())

# ─────────────────────────────────────────────
# STEP 3: SELECT REQUIRED COLUMNS SAFELY
# ─────────────────────────────────────────────
required_cols = ['pm25', 'pm10', 'no2', 'so2', 'co', 'o3', 'final_aqi']

# Keep only available columns
available_cols = [col for col in required_cols if col in data.columns]
data = data[available_cols]

print("\nUsing Columns:", available_cols)

# ─────────────────────────────────────────────
# STEP 4: HANDLE MISSING VALUES
# ─────────────────────────────────────────────

# Remove rows where target is missing
if 'final_aqi' not in data.columns:
    raise Exception("❌ 'final_aqi' column not found in dataset!")

# Convert ALL columns to numeric (fix #VALUE! issue)
for col in data.columns:
    data[col] = pd.to_numeric(data[col], errors='coerce')

# Remove rows where target is invalid
data = data.dropna(subset=['final_aqi'])

# Fill missing values with mean
data = data.fillna(data.mean(numeric_only=True))

print("\nAfter Cleaning Shape:", data.shape)

# Check if data exists
if len(data) == 0:
    raise Exception("❌ No data left after cleaning. Check your dataset.")

# ─────────────────────────────────────────────
# STEP 5: SPLIT FEATURES & TARGET
# ─────────────────────────────────────────────
X = data[['pm25', 'pm10', 'no2', 'so2', 'co', 'o3']]
y = data['final_aqi']

# ─────────────────────────────────────────────
# STEP 6: TRAIN TEST SPLIT (SAFE)
# ─────────────────────────────────────────────
if len(data) < 10:
    print("⚠️ Very small dataset, skipping train-test split")
    X_train, y_train = X, y
else:
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

# ─────────────────────────────────────────────
# STEP 7: TRAIN MODEL
# ─────────────────────────────────────────────
print("\nTraining model...")

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

print("✅ Model training complete!")

# ─────────────────────────────────────────────
# STEP 8: SAVE MODEL
# ─────────────────────────────────────────────
os.makedirs("models", exist_ok=True)

model_path = "models/aqi_model.pkl"
joblib.dump(model, model_path)

print(f"✅ Model saved at: {model_path}")