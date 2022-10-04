from flask import request, jsonify
from .model import Profile, User


def get_profile(userId):
    profile = Profile.objects(id=userId).first()
    if profile:
        return jsonify(
            {
                "code": 201,
                "data": profile.to_json()
            }
        ), 201
    else:
        profile = Profile(
                        id=userId,
                        about="",
                        career=[],
                        industry=[],
                        education=[],
                        send_request=[],
                        request=[],
                        friend_list=[]
                )
    try:
        profile.save()
    except:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "userId": userId
                },
                "message": "An error occurred creating the user."
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": {
                "userId": userId
            },
            "message": "Success"
        }
    ), 201


def update_name(): 
    body = request.form
    userId = body["id"]
    user = User.objects(id=userId).first()
    profile = Profile.objects(id=userId).first()

    try:
        if request.files.get("file") is not None:
            profile_img = request.files["file"]
            profile.image.replace(profile_img, content_type="image")
            profile.save()

        user.update(name=request.form.get("name"))
        profile.update(about=body["about"])
    except:
        return jsonify(
            {
                "code": 500,
                "data": {"userId": userId},
                "message": "An error occurred editing the user."
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": "Success Edit"
        }
    ), 201


def update_profile(userId):
    body = request.get_json()
    profile = Profile.objects(id=userId).first()
    try:
        if body.get("career") is not None:
            profile.update(
                add_to_set__career=body["career"],
                add_to_set__industry=body["industry"]
            )
        else:
            profile.update(add_to_set__industry=body["industry"])
    except:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "userId": userId
                },
                "message": "An error occurred creating the user."
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": profile.to_json()
        }
    ), 201


def update_education(userId):
    body = request.get_json()
    profile = Profile.objects(id=userId).first()

    try:
        if body[0].get("company") is None:
            profile.update(pull_all__education=profile.education)

            profile.update(add_to_set__education=body)
        else:
            profile.update(pull_all__career=profile.career)

            profile.update(add_to_set__career=body)
    except:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "userId": userId
                },
                "message": "An error occurred updating the user education."
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": profile.to_json()
        }
    ), 201
