from flask import request, jsonify
from datetime import datetime
from .model import Profile, User, Message
import base64


def get_friends(userId):
    user = Profile.objects(id=userId).first()
    username = User.objects(id=userId).first()
    if user and username:
        friends = []
        for fren in user.friend_list:
            user_obj = User.objects(id=fren).first()
            profile_obj = Profile.objects(id=fren).first()
            last_msg = "No Conversation Yet"
            room = [user_obj.name, username.name]
            room.sort()
            room = "-".join(room)
            room_id = Message.objects(id=room).first()
            if room_id:
                last_msg = room_id.message[-1]["msg"]

            if "no file" in str(profile_obj.image):
                photo = ""
            else:
                photo = base64.b64encode(profile_obj.image.read()).decode("utf-8")

            friends.append({
                "role": user_obj.role,
                "image": photo,
                "name": user_obj.name,
                "chat": last_msg,
                "id": fren
            })

        return jsonify(
            {
                "code": 201,
                "data":
                    {
                        "name": username.name,
                        "friends": friends
                    }
            }
        ), 201
    return jsonify(
        {
            "code": 500,
            "data": {
                "id": userId
            },
            "message": "An error occurred accepting the request."
        }
    ), 500


def addMessage():
    body = request.get_json()
    room = body["room"]
    msg = body["message"]
    author = body["author"]

    room_id = Message.objects(id=room).first()
    now = datetime.now()
    msg_details = {
        "msg": msg,
        "author": author,
        "datetime": now.strftime("%m/%d/%Y, %H:%M:%S")
    }

    try:
        if room_id:
            room_id.update(push__message=msg_details)
        else:
            room_id = Message(
                id=str(room),
                message=[msg_details])
            room_id.save()
    except:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "id": room
                },
                "message": "An error occurred accepting the request."
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": room_id.to_json()
        }
    ), 201


def getMessage(roomId):
    room_id = Message.objects(id=roomId).first()
    if room_id:
        return jsonify({
            "code": 201,
            "data": room_id.to_json()
        })
    else:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "id": roomId
                },
                "message": "An error occurred accepting the request."
            }
        ), 201
