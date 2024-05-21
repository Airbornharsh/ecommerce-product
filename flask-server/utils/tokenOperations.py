import os
import jwt
from utils import tokenOperations
from flask import g


def decode_token(token):
    try:
        decoded = jwt.decode(token, os.getenv("JWT_SECRET_KEY"), algorithms=["HS256"])
        return decoded
    except jwt.ExpiredSignatureError as e:
        return "Expired Singnature. Please log in again."
    except jwt.InvalidTokenError as e:
        return "Token is invalid. Please log in again."


def encode_token(payload):
    return jwt.encode(payload, os.getenv("JWT_SECRET_KEY"), algorithm="HS256")


def authenticate_user(request):
    if request.path == "/api/signup" or request.path == "/api/signin":
        return
    g.user = None
    token = request.headers.get(key="Authorization")
    if not token:
        return "Unauthorized", 401
    token = token.split(" ")[1]
    if token:
        try:
            payload = tokenOperations.decode_token(token)
            if not payload:
                return "Unauthorized", 401
            if type(payload) == str:
                return payload, 401
            return payload["id"], 200
        except jwt.ExpiredSignatureError:
            return "Token has expired", 401
        except jwt.InvalidTokenError:
            return "Invalid token", 401
    else:
        return "Unauthorized", 401
