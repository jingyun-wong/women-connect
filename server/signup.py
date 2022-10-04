from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from .model import User


def get_user(userId):
    user = User.objects(id=userId).first()
    if user:
        return jsonify(
            {
                "code": 201,
                "data": user.to_json()
            }
        ), 201

    return jsonify(
        {
            "code": 500,
            "data": {"userId": userId},
            "message": "An error occurred getting the user."
        }
    ), 500


def login_user():
    body = request.get_json()
    email_add = body["email"]
    user = User.objects(email=email_add).first()
    if user:
        check = check_password_hash(user.password, body["password"])
        if check:
            return jsonify({
                "code": 201,
                "data": user.to_json()
            })
    else:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "userId": email_add
                },
                "message": "Wrong User / Password"
            }
        ), 500

    return jsonify(
        {
            "code": 500,
            "data": {
                "userId": email_add
            },
            "message": "Wrong Password"
        }
    ), 500


def create_user():
    body = request.get_json()
    userId = User.objects.count() + 1
    password = body["password"]
    hashed_password = generate_password_hash(password, "sha256")
    user = User(
        id=str(userId),
        name=body["name"],
        email=body["email"],
        password=hashed_password,
        phone_number=body["phone_number"],
        dob=body["dob"],
        role=body["role"]
    )

    try:
        user.save()
    except:
        return jsonify(
            {
                "code": 500,
                "data": {"user": user.to_json()},
                "message": "An error occurred creating the user."
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": user.to_json()
        }
    ), 201
