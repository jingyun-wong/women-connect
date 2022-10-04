from flask import Flask
from flask_cors import CORS, cross_origin
from server import signup, profile, message, network, home
from server.model import db

dbURL = "mongodb+srv://user1:QxYkKJRADifaITMl@cluster0.xnups.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

app = Flask(__name__)
app.config['MONGODB_SETTINGS'] = {
    'host': dbURL,
}

CORS(app)
db.connect(host=dbURL)


@app.route("/graph/<string:userId>/<string:friendId>")
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def link_nodes(userId, friendId):
    return network.link_nodes(userId, friendId)


@app.route("/user/<string:userId>")
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def get_user(userId):
    return signup.get_user(userId)


@app.route("/login/check", methods=["POST"])
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def login_user():
    return signup.login_user()


@app.route("/signup", methods=["POST"])
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def create_user():
    return signup.create_user()


@app.route("/profile/create/<string:userId>")
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def get_profile(userId):
    return profile.get_profile(userId)


@app.route("/profile/edit/name", methods=["POST"])
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def update_name():
    return profile.update_name()


@app.route("/profile/edit/first/<string:userId>", methods=["PUT"])
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def update_profile(userId):
    return profile.update_profile(userId)


@app.route("/profile/edit/second/<string:userId>", methods=["PUT"])
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def update_education(userId):
    return profile.update_education(userId)


@app.route("/post/createPost", methods=["POST"])
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def image_upload():
    return home.image_upload()


@app.route("/post/retrievePost")
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def retrieve_post():
    return home.retrieve_post()


@app.route("/post/searchpost/<string:searchString>")
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def search_post(searchString):
    return home.search_post(searchString)


@app.route("/post/searchtag/<string:searchString>")
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def search_tags(searchString):
    return home.search_tags(searchString)


@app.route("/post/findtag")
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def top_ten_tags():
    return home.top_ten_tags()


@app.route("/post/user/<string:userId>")
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def user_posts(userId):
    return home.user_posts(userId)


@app.route("/mentorsearch/<string:userId>")
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def get_mentors(userId):
    return network.get_mentors(userId)


@app.route("/mentor/filter/<string:userId>/<string:searchString>")
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def find_mentor(userId, searchString):
    return network.find_mentor(userId, searchString)


@app.route("/addrequest/<string:mentorId>/<string:userId>")
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def add_mentor(mentorId, userId):
    return network.add_mentor(mentorId, userId)


@app.route("/getrequest/<string:mentorId>")
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def get_mentor(mentorId):
    return network.get_mentor(mentorId)


@app.route("/acceptrequest/<string:menteeId>/<string:mentorId>")
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def accept_request(menteeId, mentorId):
    return network.accept_request(menteeId, mentorId)


@app.route("/rejectrequest/<string:menteeId>/<string:mentorId>")
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def reject_request(menteeId, mentorId):
    return network.reject_request(menteeId, mentorId)


@app.route("/friendlist/<string:userId>")
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def get_friends(userId):
    return message.get_friends(userId)


@app.route("/addMessage", methods=["POST"])
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def addMessage():
    return message.addMessage()


@app.route("/getMessage/<string:roomId>")
@cross_origin(origins=['https://women-connect.herokuapp.com'])
def getMessage(roomId):
    return message.getMessage(roomId)


if __name__ == "__main__":
    app.run(port=5000, debug=True)
