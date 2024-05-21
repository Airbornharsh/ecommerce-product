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
    name = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password


class Product(db.Model):
    __tablename__ = "product"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    images = db.Column(db.ARRAY(db.Text), nullable=False)
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
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"))
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __init__(self, user_id, product_id, quantity, price):
        self.user_id = user_id
        self.product_id = product_id
        self.quantity = quantity
        self.price = price


@app.route("/api/signup", methods=["POST"])
def api_signup():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    hashed_password = passwordOperations.create_bcrypt_hash(
        password, passwordOperations.generate_salt()
    )

    try:
        new_user = User(name=name, email=email, password=hashed_password)
        exp = int(time.time() + 360000)
        payload = {
            "exp": exp,
            "id": new_user.id,
            "email": email,
        }
        token = tokenOperations.encode_token(payload)
        db.session.add(new_user)
        db.session.commit()
        resp = make_response(
            jsonify(
                {
                    "message": "User created successfully",
                    "access_token": token,
                    "user": {
                        "id": new_user.id,
                        "name": new_user.name,
                        "email": new_user.email,
                    },
                }
            ),
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
                    "user": {
                        "id": user.id,
                        "name": user.name,
                        "email": user.email,
                    },
                }
            ),
            200,
        )
        return resp
    else:
        return jsonify({"message": "Email is incorrect."}), 404


@app.route("/api/products", methods=["POST"])
def create_product():
    res, code = tokenOperations.authenticate_user(request)
    if code != 200:
        return jsonify({"error": res}), code
    try:
        data = request.json
        name = data.get("name")
        price = data.get("price")
        description = data.get("description")
        images = data.get("images")
        new_product = Product(
            name=name, price=price, description=description, images=images
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify({"message": "Product created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"message": "Server error! Please try again later."}), 500


@app.route("/api/products", methods=["GET"])
def get_products():
    page = int(request.args.get("page", 1))
    page = page - 1 if page > 0 else 0
    per_page = int(request.args.get("per_page", 20))
    offset = page * per_page
    search = request.args.get("search", "")
    products = (
        Product.query.filter((Product.name.ilike(f"%{search}%")))
        .order_by(Product.created_at.asc())
        .limit(per_page)
        .offset(offset)
        .all()
    )
    result = [
        {
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "description": product.description,
            "images": product.images,
        }
        for product in products
    ]
    return jsonify({"products": result}), 200


@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    result = {
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "description": product.description,
        "images": product.images,
    }
    return jsonify({"product": result}), 200


@app.route("/api/cart", methods=["POST"])
def add_to_cart():
    res, code = tokenOperations.authenticate_user(request)
    if code != 200:
        return jsonify({"error": res}), code
    data = request.json
    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)
    try:
        cart_item = Cart.query.filter_by(user_id=res, product_id=product_id).first()
        if cart_item:
            cart_item.quantity += quantity
        else:
            product = Product.query.get_or_404(product_id)
            cart_item = Cart(
                user_id=res,
                product_id=product_id,
                quantity=quantity,
                price=product.price,
            )
            db.session.add(cart_item)
        db.session.commit()
        return jsonify({"message": "Item added to cart"}), 201
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"message": "Server error! Please try again later."}), 500


@app.route("/api/cart", methods=["GET"])
def get_cart():
    res, code = tokenOperations.authenticate_user(request)
    if code != 200:
        return jsonify({"error": res}), code
    page = int(request.args.get("page", 1))
    page = page - 1 if page > 0 else 0
    per_page = int(request.args.get("per_page", 20))
    offset = page * per_page
    cart_items = (
        Cart.query.filter(Cart.user_id == int(res))
        .order_by(Cart.updated_at.asc())
        .limit(per_page)
        .offset(offset)
        .all()
    )

    result = [
        {
            "id": cart_item.id,
            "product_id": cart_item.product_id,
            "quantity": cart_item.quantity,
            "price": cart_item.price,
        }
        for cart_item in cart_items
    ]
    return jsonify({"cart": result}), 200


@app.route("/api/cart/<int:cart_item_id>", methods=["DELETE"])
def remove_from_cart(cart_item_id):
    res, code = tokenOperations.authenticate_user(request)
    if code != 200:
        return jsonify({"error": res}), code
    try:
        cart_item = Cart.query.filter_by(user_id=res, id=cart_item_id).first()
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({"message": "Item removed from cart"}), 200
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"message": "Server error! Please try again later."}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)
