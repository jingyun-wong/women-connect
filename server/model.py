import base64
from datetime import datetime
import mongoengine as db

# Sign Up Page
class User(db.Document):
    id = db.StringField(primary_key=True)
    name = db.StringField()
    email = db.StringField()
    password = db.StringField()
    phone_number = db.StringField()
    dob = db.StringField()
    role = db.StringField()

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone_number": self.phone_number,
            "password": self.password,
            "dob": self.dob,
            "role": self.role
        }

# Profile Page
class Profile(db.Document):
    id = db.StringField(primary_key=True)
    image = db.FileField()
    about = db.StringField()
    career = db.ListField()
    industry = db.ListField()
    education = db.ListField()
    send_request = db.ListField()
    request = db.ListField()
    friend_list = db.ListField()

    def to_json(self):
        if "no file" in str(self.image):
            photo = ""
        else:
            photo = base64.b64encode(self.image.read()).decode("utf-8")
        return {
            "id": self.id,
            "image": photo,
            "about": self.about,
            "career": self.career,
            "industry": self.industry,
            "education": self.education,
            "send_request": self.send_request,
            "request": self.request,
            "friend_list": self.friend_list
        }

# Stories
class Story(db.Document):
    title = db.StringField(max_length=120)
    image = db.FileField()
    author = db.StringField()
    tags = db.ListField(db.StringField(max_length=30))
    content = db.StringField()
    posting = db.StringField()
    date_added = db.DateTimeField(default=datetime.utcnow)

    def to_json(self):
        return {
            "title": self.title,
            "image": base64.b64encode(self.image.read()).decode("utf-8"),
            "author": self.author,
            "tags": self.tags,
            "content": self.content
        }

# Messaging
class Message(db.Document):
    id = db.StringField(primary_key=True)
    message = db.ListField()

    def to_json(self):
        return {
            "room": self.id,
            "message": self.message,
            # "data_time": self.data_time
        }
