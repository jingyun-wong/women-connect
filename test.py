import unittest
import server
import server.app as app


class UserCheck(unittest.TestCase):
    def setUp(self):
        app.db.disconnect()
        app.db.connect('mongoenginetest', host='mongomock://localhost')
        self.app = app.app.test_client()

    def tearDown(self):
        app.db.disconnect()

    def test_password_hash(self):
        response = self.app.post(
            '/signup',
            json={
                "name": "JY",
                "email": "jingyun0309@gmail.com",
                "password": "ABCDEF",
                "phone_number": "77777777",
                "dob": "",
                "role": "mentee"
            }, follow_redirects=True)

        html = response.get_data(as_text=True)
        self.assertNotIn("ABCDEF", html)

    def test_id_creation(self):
        for i in range(1, 4):
            response = self.app.post(
                '/signup',
                json={
                        "name": "JY",
                        "email": "jingyun0309@gmail.com",
                        "password": "ABCDEF",
                        "phone_number": "77777777",
                        "dob": "",
                        "role": "mentee"
                    }, follow_redirects=True)

        html = response.get_data(as_text=True)
        assert '"id":"3"' in html


class ProfileCheck(unittest.TestCase):
    def setUp(self):
        app.db.disconnect()
        app.db.connect('mongoenginetest', host='mongomock://localhost')
        self.app = app.app.test_client()
        server.model.Profile(
            id="1",
            about="Student at SMU",
            career=[],
            industry=[],
            education=[],
            send_request=[],
            request=[],
            friend_list=[]
        ).save()

    def tearDown(self):
        app.db.disconnect()

    def test_profile_created(self):
        response = self.app.get('/profile/create/2')     
        html = response.get_data(as_text=True)
        assert '"message":"Success"' in html

        response = self.app.get('/profile/create/1')
        html = response.get_data(as_text=True)
        self.assertNotIn('"message":"Success"', html)


class PostCheck(unittest.TestCase):
    def setUp(self):
        app.db.disconnect()
        app.db.connect('mongoenginetest', host='mongomock://localhost')
        self.app = app.app.test_client()

    def tearDown(self):
        app.db.disconnect()


class SearchMentorCheck(unittest.TestCase):
    def setUp(self):
        app.db.disconnect()
        app.db.connect('mongoenginetest', host='mongomock://localhost')
        self.app = app.app.test_client()

    def tearDown(self):
        app.db.disconnect()


if __name__ == '__main__':
    unittest.main()
