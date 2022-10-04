from flask import request, jsonify
from itertools import chain
from .model import Story


def image_upload():
    body = request.form
    tags_list = []
    if request.form.get("tags") is not None:
        tags_list = body["tags"].split(",")

    tags_list = [x.lower() for x in tags_list]

    posting = Story(
        title=body["title"],
        author=body["id"],
        content=body["content"],
        tags=tags_list,
        posting=body["posting"]
    )

    if request.files.get("file") is not None:
        image_post = request.files["file"]
        print(image_post)
        posting.image.put(image_post, content_type="image")
        print(posting.image)

    try:
        posting.save()
        print(posting.image)
    except:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "userId": "9"
                },
                "message": "An error occurred creating the user."
            }
        ), 500

    return jsonify({
        "code": 201,
        "data": "Success Creation"
    })


def retrieve_post():
    posts = Story.objects()

    if posts:
        return jsonify(
            {
                "code": 201,
                "data": [post.to_json() for post in posts]
            }
        ), 201
    else:
        return jsonify(
            {
                "code": 500,
                "message": "An error occurred getting the post."
            }
        ), 500


def search_post(searchStr):
    posts = Story.objects(title__icontains=searchStr, tags__nin=searchStr).all()
    tag_posts = Story.objects(title__not__contains=searchStr, tags=searchStr).all()
    all_posts = list(chain(posts, tag_posts))

    if all_posts:
        return jsonify(
            {
                "code": 201,
                "data": [post.to_json() for post in all_posts]
            }
        ), 201
    else:
        return jsonify(
            {
                "code": 500,
                "message": "An error occurred getting the post."
            }
        ), 500


def search_tags(searchString):
    tag_posts = Story.objects(tags=searchString.lower()).all()

    if tag_posts:
        return jsonify(
            {
                "code": 201,
                "data": [post.to_json() for post in tag_posts]
            }
        ), 201
    else:
        return jsonify(
            {
                "code": 500,
                "message": "An error occurred getting the post."
            }
        ), 500


def user_posts(userId):
    posts = Story.objects(author=userId).all()

    if posts:
        return jsonify(
            {
                "code": 201,
                "data": [post.to_json() for post in posts]
            }
        ), 201
    else:
        return jsonify(
            {
                "code": 500,
                "message": "An error occurred getting the post."
            }
        ), 500


def top_ten_tags():
    stories = Story.objects.all()
    stories_dict = {}
    for story in stories:
        tags = story.tags
        for tag in tags:
            if tag.lower() not in stories_dict.keys():
                stories_dict[tag.lower()] = 1
            else:
                stories_dict[tag] += 1

    stories_dict = sorted(stories_dict.items(), key=lambda item: item[1], reverse=True)[:10]
    stories_dict = [k.title() for k, v in stories_dict]

    return jsonify(
        {
            "code": 201,
            "data": stories_dict
        }
    ), 201
