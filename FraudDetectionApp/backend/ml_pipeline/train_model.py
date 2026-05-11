import numpy as np
import pandas as pd
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib

def main():
    # 1. Generate synthetic fraud dataset
    X, y = make_classification(
        n_samples=5000,
        n_features=10,
        n_informative=6,
        n_redundant=2,
        n_repeated=0,
        n_classes=2,
        weights=[0.96, 0.04],  # 4% fraud
        class_sep=1.5,
        random_state=42
    )

    feature_names = [
        "amount", "time_delta", "num_prev_txn_24h", "merchant_risk_score",
        "device_trust_score", "ip_risk_score", "country_risk_score",
        "card_age_days", "customer_tenure_days", "failed_login_attempts"
    ]

    df = pd.DataFrame(X, columns=feature_names)
    df["is_fraud"] = y

    # Optional: scale "amount" to look realistic
    df["amount"] = (np.abs(df["amount"]) * 2000).round(2)  # 0–2000 roughly

    X_train, X_test, y_train, y_test = train_test_split(
        df[feature_names], df["is_fraud"], test_size=0.2, random_state=42, stratify=df["is_fraud"]
    )

    model = RandomForestClassifier(
        n_estimators=150,
        max_depth=8,
        min_samples_split=10,
        min_samples_leaf=5,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print("Classification Report:")
    print(classification_report(y_test, y_pred))

    joblib.dump((model, feature_names), "model.pkl")
    print("Model saved to model.pkl")

if __name__ == "__main__":
    main()
