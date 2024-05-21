from flask import Flask, jsonify, request, make_response, g
from flask_cors import CORS
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
from datetime import datetime
from utils import tokenOperations
from utils import passwordOperations
from sqlalchemy.exc import IntegrityError
import time

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

print(DATABASE_URL)
print(JWT_SECRET_KEY)

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY

db = SQLAlchemy(app)
migrate = Migrate(app, db)


class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __init__(self, email, password):
        self.email = email
        self.password = password


class Product(db.Model):
    __tablename__ = "product"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    images = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __init__(self, name, price, description, images):
        self.name = name
        self.price = price
        self.description = description
        self.images = images

class Cart(db.Model):
    __tablename__ = "cart"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    quantity = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __init__(self, user_id, product_id, quantity):
        self.user_id = user_id
        self.product_id = product_id
        self.quantity = quantity

@app.route("/api/signup", methods=["POST"])
def api_signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    hashed_password = passwordOperations.create_bcrypt_hash(
        password, passwordOperations.generate_salt()
    )

    try:
        new_user = User(email=email, password=hashed_password)
        exp = int(time.time() + 360000)
        payload = {
            "exp": exp,
            "id": new_user.id,
            "email": email,
        }
        token = tokenOperations.encode_token(payload)
        resp = make_response(
            jsonify({"message": "User created successfully", "access_token": token}),
            200,
        )
        return resp
    except IntegrityError as e:
        print(e)
        db.session.rollback()
        return jsonify({"message": "User with this email already exists."}), 409
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"message": "Server error! Please try again later."}), 500


@app.route("/api/signin", methods=["POST"])
def api_signin():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if user:
        if not passwordOperations.verify_password(password, user.password):
            return jsonify({"message": "Password is incorrect."}), 404
        exp = int(time.time() + 360000)
        payload = {
            "exp": exp,
            "id": user.id,
            "email": email,
        }
        token = tokenOperations.encode_token(payload)
        resp = make_response(
            jsonify(
                {
                    "message": "Logged In",
                    "access_token": token,
                }
            ),
            200,
        )
        return resp
    else:
        return jsonify({"message": "Email is incorrect."}), 404


if __name__ == "__main__":
    app.run(port=5000, debug=True)
