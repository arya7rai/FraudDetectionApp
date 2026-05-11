from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
import sqlite3
import pandas as pd
import os
import bcrypt
from datetime import datetime, timezone
import re

# =========================================================
# PATH SETUP
# =========================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DB_NAME = os.path.join(BASE_DIR, "database", "fraud.db")

# =========================================================
# FASTAPI INIT
# =========================================================

app = FastAPI(title="Fraud Detection API")

# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# MODELS
# =========================================================

class UserAuth(BaseModel):
    username: str
    password: str


class TransactionInput(BaseModel):

    username: str

    amount: float = Field(..., ge=0)

    time_delta: float = Field(..., ge=0)

    num_prev_txn_24h: int = Field(..., ge=0)

    merchant_risk_score: float = Field(..., ge=0)

    device_trust_score: float = Field(..., ge=0)

    ip_risk_score: float = Field(..., ge=0)

    country_risk_score: float = Field(..., ge=0)

    card_age_days: float = Field(..., ge=0)

    customer_tenure_days: float = Field(..., ge=0)

    failed_login_attempts: int = Field(..., ge=0)

# =========================================================
# DB INIT
# =========================================================

def init_db():

    os.makedirs(os.path.dirname(DB_NAME), exist_ok=True)

    with sqlite3.connect(DB_NAME) as conn:

        cur = conn.cursor()

        # USERS TABLE
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                username TEXT UNIQUE,

                password TEXT
            )
        """)

        # TRANSACTIONS TABLE
        cur.execute("""
            CREATE TABLE IF NOT EXISTS transactions (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                username TEXT,

                timestamp TEXT,

                amount REAL,

                time_delta REAL,

                num_prev_txn_24h INTEGER,

                merchant_risk_score REAL,

                device_trust_score REAL,

                ip_risk_score REAL,

                country_risk_score REAL,

                card_age_days REAL,

                customer_tenure_days REAL,

                failed_login_attempts INTEGER,

                is_fraud INTEGER,

                prediction_source TEXT
            )
        """)

        conn.commit()


init_db()

# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {
        "message": "Fraud Detection API Running"
    }

# =========================================================
# REGISTER
# =========================================================

@app.post("/api/register")
def register(user: UserAuth):

    with sqlite3.connect(DB_NAME) as conn:

        cur = conn.cursor()

        cur.execute(
            "SELECT * FROM users WHERE username = ?",
            (user.username,)
        )

        if cur.fetchone():

            raise HTTPException(
                status_code=400,
                detail="Username already exists"
            )

        hashed = bcrypt.hashpw(
            user.password.encode(),
            bcrypt.gensalt()
        ).decode()

        cur.execute(
            """
            INSERT INTO users (username, password)
            VALUES (?, ?)
            """,
            (user.username, hashed)
        )

        conn.commit()

    return {
        "message": "User registered successfully"
    }

# =========================================================
# LOGIN
# =========================================================

@app.post("/api/login")
def login(user: UserAuth):

    with sqlite3.connect(DB_NAME) as conn:

        cur = conn.cursor()

        cur.execute(
            """
            SELECT password
            FROM users
            WHERE username = ?
            """,
            (user.username,)
        )

        row = cur.fetchone()

    if not row:

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    stored_password = row[0]

    if not bcrypt.checkpw(
        user.password.encode(),
        stored_password.encode()
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    return {
        "message": "Login successful",
        "username": user.username
    }

# =========================================================
# INSERT TRANSACTION
# =========================================================

def insert_transaction(row):

    with sqlite3.connect(DB_NAME) as conn:

        conn.execute("""
            INSERT INTO transactions (

                username,
                timestamp,
                amount,
                time_delta,
                num_prev_txn_24h,
                merchant_risk_score,
                device_trust_score,
                ip_risk_score,
                country_risk_score,
                card_age_days,
                customer_tenure_days,
                failed_login_attempts,
                is_fraud,
                prediction_source

            )

            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, row)

        conn.commit()

# =========================================================
# SUMMARY API
# =========================================================

@app.get("/api/summary/{username}")
def get_summary(username: str):

    with sqlite3.connect(DB_NAME) as conn:

        cur = conn.cursor()

        cur.execute(
            """
            SELECT COUNT(*)
            FROM transactions
            WHERE username = ?
            """,
            (username,)
        )

        total = cur.fetchone()[0] or 0

        cur.execute(
            """
            SELECT COUNT(*)
            FROM transactions
            WHERE username = ?
            AND is_fraud = 1
            """,
            (username,)
        )

        fraud = cur.fetchone()[0] or 0

        cur.execute(
            """
            SELECT AVG(amount)
            FROM transactions
            WHERE username = ?
            """,
            (username,)
        )

        avg_amount = cur.fetchone()[0]

    avg_amount = round(avg_amount, 2) if avg_amount else 0

    return {

        "total_transactions": total,

        "fraud_transactions": fraud,

        "fraud_rate": (
            round((fraud * 100) / total, 2)
            if total > 0 else 0
        ),

        "avg_amount": avg_amount
    }

# =========================================================
# RECENT TRANSACTIONS
# =========================================================

@app.get("/api/recent/{username}")
def get_recent_transactions(
    username: str,
    limit: int = 20
):

    with sqlite3.connect(DB_NAME) as conn:

        cur = conn.cursor()

        cur.execute("""
            SELECT

                id,
                timestamp,
                amount,
                is_fraud,
                prediction_source

            FROM transactions

            WHERE username = ?

            ORDER BY id DESC

            LIMIT ?
        """, (username, limit))

        rows = cur.fetchall()

    return [
        {
            "id": r[0],
            "timestamp": r[1],
            "amount": r[2],
            "is_fraud": r[3],
            "prediction_source": r[4]
        }
        for r in rows
    ]

# =========================================================
# PREDICT
# =========================================================

@app.post("/api/predict")
def predict(data: TransactionInput):

    fraud_score = 0

    if data.amount > 5000:
        fraud_score += 30

    if data.ip_risk_score > 0.7:
        fraud_score += 20

    if data.country_risk_score > 0.7:
        fraud_score += 20

    if data.failed_login_attempts > 3:
        fraud_score += 15

    if data.device_trust_score < 0.3:
        fraud_score += 15

    is_fraud = 1 if fraud_score >= 50 else 0

    row = (

        data.username,

        datetime.now(timezone.utc).isoformat(),

        data.amount,

        data.time_delta,

        data.num_prev_txn_24h,

        data.merchant_risk_score,

        data.device_trust_score,

        data.ip_risk_score,

        data.country_risk_score,

        data.card_age_days,

        data.customer_tenure_days,

        data.failed_login_attempts,

        is_fraud,

        "rule_based_model"
    )

    insert_transaction(row)

    return {
        "is_fraud": is_fraud,
        "fraud_probability": fraud_score
    }

# =========================================================
# EXPORT USER DATA
# =========================================================

@app.get("/api/export_data/{username}")
def export_data(username: str):

    if not re.match(r'^[a-zA-Z0-9_-]+$', username):
        raise HTTPException(
            status_code=400,
            detail="Invalid username"
        )

    try:

        with sqlite3.connect(DB_NAME) as conn:

            df = pd.read_sql_query(
                """
                SELECT *
                FROM transactions
                WHERE username = ?
                """,
                conn,
                params=(username,)
            )

        export_path = os.path.join(
            BASE_DIR,
            "database",
            f"{username}_powerbi_data.csv"
        )

        # Ensure the resolved path stays within the database directory
        db_dir = os.path.join(BASE_DIR, "database")
        if not os.path.realpath(export_path).startswith(os.path.realpath(db_dir)):
            raise HTTPException(status_code=400, detail="Invalid path")

        df.to_csv(export_path, index=False)

        return FileResponse(
            path=export_path,
            filename=f"{username}_powerbi_data.csv",
            media_type="text/csv"
        )

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Export failed: {str(e)}"
        )