from flask import jsonify
from itsdangerous import json
from .model import User, Profile


def link_nodes(userId, friendId):
    user = Profile.objects(id=userId).first()
    friend = Profile.objects(id=friendId).first()
    user_friends = user.friend_list
    friend_friends = friend.friend_list
    friends = list(set(user_friends + friend_friends))
    friends.append(userId)
    friends.append(friendId)

    node_list = []
    for person in friends:
        person_profile = Profile.objects(id=person).first().to_json()
        person_name = User.objects(id=person).first().name
        person_image = person_profile['image']
        if str(person_image) == "":
            image_person = "https://joeschmoe.io/api/v1/female/jane"
        else:
            image_person = "data:image/png;base64," + person_image
        node_list.append(
            {
                "id": person,
                "name": person_name,
                "img": image_person
            }
        )

    links_list = []
    for user_person in user_friends:
        links_list.append({"source_id": userId, "target_id": user_person})
    for user_person in friend_friends:
        links_list.append({"source_id": friendId, "target_id": user_person})

    final_dict = {
        "nodes": node_list,
        "links": links_list
    }

    return jsonify(final_dict)


def get_mentors(userId):
    users = User.objects(id__ne=userId)
    list_of_profiles = []
    if users:
        for user in users:
            profile = Profile.objects(id=user.id, friend_list__nin=userId)
            name = user.name
            if profile:
                list_of_profiles.append([profile, name])

        all_mentors = []
        for (profile, name) in list_of_profiles:
            profile_dict = json.loads(profile.to_json()[1:-1])
            profile_dict["name"] = name
            all_mentors.append(profile_dict)

        return jsonify(
            {
                "code": 201,
                "data": all_mentors
            }
        ), 201

    else:
        return jsonify(
            {
                "code": 500,
                "message": "An error occurred getting the post."
            }
        ), 500


def find_mentor(userId, searchString):
    users = User.objects(id__ne=userId)

    list_of_profiles = []
    if users:
        for user in users:
            profile = Profile.objects(id=user.id, about__icontains=searchString).first()
            name = user.name
            if searchString.lower() in name.lower():
                profile = Profile.objects(id=user.id).first()
            if profile:
                if userId in profile.friend_list or userId in profile.request:
                    friend = True
                else:
                    friend = False
                list_of_profiles.append([profile, name, user.role, friend])

        all_mentors = []
        for (profile, name, role, friend) in list_of_profiles:
            profile_dict = profile.to_json()
            profile_dict["name"] = name
            profile_dict["role"] = role.title()
            profile_dict["friend"] = friend
            all_mentors.append(profile_dict)

        return jsonify(
            {
                "code": 201,
                "data": all_mentors
            }
        ), 201

    else:
        return jsonify(
            {
                "code": 500,
                "message": "An error occurred getting the post."
            }
        ), 500


def add_mentor(mentorId, userId):
    mentee = Profile.objects(id=userId, send_request__nin=[mentorId])
    mentor = Profile.objects(id=mentorId, request__nin=[userId])

    if list(mentor) == []:
        return jsonify(
            {
                "code": 201,
                "message": "Request sent already"
            }
        )

    try:
        mentee.update(add_to_set__send_request=mentorId)

        mentor.update(add_to_set__request=userId)
    except:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "userId": userId,
                    "mentorId": mentorId
                },
                "message": "An error occurred creating the request."
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": "request success"
        }
    ), 201


def get_mentor(mentorId):
    profile = Profile.objects(id=mentorId).first()
    if profile:
        users = []
        i = 1
        for user in profile.request:
            user_obj = User.objects(id=user).first()
            profile_obj = Profile.objects(id=user).first()
            username = user_obj.name

            users.append({
                "key": i,
                "id": user,
                "name": username,
                "about": profile_obj.about,
                "role": user_obj.role.title()
            })

            i += 1

        return jsonify(
            {
                "code": 201,
                "data": users
            }
        ), 201
    else:
        return jsonify(
            {
                "code": 500,
                "data": {"mentorId": mentorId},
                "message": "An error occurred creating the request."
            }
        ), 500


def accept_request(menteeId, mentorId):
    mentee = Profile.objects(id=menteeId).first()
    mentor = Profile.objects(id=mentorId).first()

    if mentee:
        try:
            mentee.update(add_to_set__friend_list=mentorId, pull__send_request=mentorId)
        except:
            return jsonify(
                {
                    "code": 500,
                    "data": {"menteeId": menteeId},
                    "message": "An error occurred accepting the request."
                }
            ), 500
    if mentor:
        try:
            mentor.update(add_to_set__friend_list=menteeId, pull__request=menteeId)
            return jsonify({
                            "code": 201,
                            "data": mentor.to_json()
                        })
        except:
            return jsonify(
                {
                    "code": 500,
                    "data": {"mentorId": mentorId},
                    "message": "An error occurred accepting the request."
                }
            ), 500


def reject_request(menteeId, mentorId): 
    mentee = Profile.objects(id=menteeId).first()
    mentor = Profile.objects(id=mentorId).first()

    if mentee:
        try:
            mentee.update(pull__send_request=mentorId)
        except:
            return jsonify(
                {
                    "code": 500,
                    "data": {"menteeId": menteeId},
                    "message": "An error occurred accepting the request."
                }
            ), 500
    if mentor:
        try:
            mentor.update(pull__request=menteeId)
            return jsonify(
                {
                    "code": 201,
                    "data": mentor.to_json()
                }
            ), 201
        except:
            return jsonify(
                {
                    "code": 500,
                    "data": {"mentorId": mentorId},
                    "message": "An error occurred accepting the request."
                }
            ), 500
