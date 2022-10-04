from flask import Flask
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
from datetime import datetime


app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'secret'

CORS(app)
socketio = SocketIO(app, logger=True, engineio_logger=True, cors_allowed_origins="*")
socketio.init_app(app, cors_allowed_origins="*")


@socketio.on('connect')
def on_connect():
    print("user connected")


@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected xxx')


@socketio.on('join')
def join_rm(message):
    print(message)
    id = message["id"]
    user = message["user"]
    room = [id, user]
    room.sort()
    room = "-".join(room)
    join_room(room)
    emit('status', {'msg':  room + ' has entered the room.'}, room=room, broadcast= True)


@socketio.on('leave')
def on_leave(message):
    id = message["id"]
    user = message["user"]
    room = [id, user]
    room.sort()
    room = "-".join(room)
    leave_room(room)


@socketio.on('text')
def text(message):
    id = message["id"]
    user = message["user"]
    room = [id, user]
    room.sort()
    room = "-".join(room)
    msg = message["msg"]
    now = datetime.now()
    data = {
                'msg': msg,
                "id": id,
                "datetime": now.strftime("%m/%d/%Y, %H:%M:%S")
        }
    emit('message', data, room=room, broadcast=True)


if __name__ == '__main__':
    socketio.run(app)
