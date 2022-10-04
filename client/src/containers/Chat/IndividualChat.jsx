import React from 'react'
import { Input, Form, Avatar, Image, Button, Comment, Spin } from 'antd';
import { SearchOutlined, UserOutlined} from '@ant-design/icons';
import MessageText from './MessageText';
import IndivPerson from './IndivPerson';
import Loading from '../../components/Loading';
import io from 'socket.io-client'
import axios from 'axios';

const socket = io('https://women-connect-chat.herokuapp.com')

class Message extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: "",
            msg: "",
            chat: [],
            friends: [],
            no_chat: true,
            loading: true,
            loading_1: false
        };
        this.sendMsg = this.sendMsg.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.addMessage = this.addMessage.bind(this)
        this.el = React.createRef();
        this.scrollToBottom = this.scrollToBottom.bind(this)
        this.onSearchUser = this.onSearchUser.bind(this)
        this.sendRoom = this.sendRoom.bind(this)
    }
    

    componentDidMount(){
        sessionStorage.removeItem('otherUser');
        axios.get(`https://women-connect-app.herokuapp.com/friendlist/` + sessionStorage.user)
        .then ((response) => {
            this.setState({
                name: response.data.data.name,
                friends: response.data.data.friends,
                otherUser: "",
                loading:false
            })

            let name = response.data.data.name
            let friend_list = []
            sessionStorage.setItem("name", name)

            for (let fren of response.data.data.friends){
                friend_list.push(fren.name)
            }

            if(window.location.href.split('message/')[1] !== undefined){
                axios.get(`https://women-connect-app.herokuapp.com/user/` + window.location.href.split('message/')[1])  
                .then ((response) => {
                    sessionStorage.setItem('otherUser', response.data.data.name)
                    
                    if (!friend_list.includes(response.data.data.name)){
                        this.setState(prevState => ({
                            friends: [{
                                chat: 'No Conversation Yet!',
                                image: '',
                                name: response.data.data.name, 
                                role: 'mentor',
                                id: window.location.href.split('message/')[1]
                            } ,...prevState.friends]
                    }))

                        console.log(this.state.friends)
                    }
                    this.sendRoom(response.data.data.id, window.location.href.split('message/')[1])
                })
            }
        })
        .catch(error => {
            console.log(error.message)
        })

        socket.on('message', (data) => {
            this.addMessage(data.msg, data.id, data.datetime)
        });

    }

    onSearchUser(){
        console.log('ki')
    }

    sendRoom = async(event, otherId) => {
        this.setState({loading_1:true})
        axios.get('https://women-connect-app.herokuapp.com/profile/create/' + sessionStorage.user)
        .then((response) => {
            sessionStorage.setItem('userPic', response.data.data.image)
        })

        let id = event
        if (typeof(event) !== 'string'){
            id = this.state.friends[event.target.id].name
            sessionStorage.setItem("otherUser", id )
            otherId = event.target.className
        }        

        this.setState({otherUser: id, no_chat:false, chat:[], enterRoom:true})
        
        let res = await axios.get('https://women-connect-app.herokuapp.com/profile/create/' + otherId)
            .then((response) => {
                sessionStorage.setItem('otherPic', response.data.data.image)
                this.setState({loading_1:false})
        })

        let room = [sessionStorage.name, sessionStorage.otherUser].sort()
        room = room.join("-")
        axios.get('https://women-connect-app.herokuapp.com/getMessage/' + room)
        .then((response) => {
            if (response.data.code != 500){
                let chats = []
                for (let chat of response.data.data.message){
                    let message = {
                        "id": chat.author,
                        "msg": chat.msg,
                        "datetime": chat.datetime,
                        'uid': otherId
                    }

                    chats.push(message)
                }

                this.setState({
                    chat: chats
                })

                socket.emit('join', {"id": sessionStorage.name, "user": sessionStorage.otherUser});

                socket.on("status", function(){
                    console.log("In room")
                })

                this.scrollToBottom()
            }

            else{
                this.setState({
                    chat: []
                })

                socket.emit('join', {"id": sessionStorage.name, "user": sessionStorage.otherUser});
                socket.on("status", function(){
                    console.log("In room")
                })

            }
        })
        
        
    }

    addMessage(msg,id, datetime){
        this.setState(prevState => ({
            chat: [...prevState.chat, {"msg": msg, "id":id, "datetime": datetime}]
        }))

        this.scrollToBottom()
    }

    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            msg: value
        })
    }

    sendMsg(event){
        event.preventDefault()
        let text = this.state.msg
        socket.emit('text', {msg: text , id: sessionStorage.name, user: sessionStorage.otherUser});
        this.setState({
            msg: "", 
        })

        let room = [sessionStorage.name, sessionStorage.otherUser].sort()
        room = room.join("-")
        let message_json = {
            "room": room, 
            "message": text,
            "author": sessionStorage.name,
        }

        axios.post('https://women-connect-app.herokuapp.com/addMessage', message_json)
        .then((response) => {
            console.log(response)
        })
    }

    scrollToBottom() {
        this.el.current.scrollIntoView({behavior:"smooth", block: "end"})
    }

    render(){
        let personlist = []
        let x = 0;
        for (let i = 0 ; i < this.state.friends.length; i++){
            personlist.push(<IndivPerson onClick={this.sendRoom} id={i} uid={this.state.friends[i].id} name={this.state.friends[i].name} chat={this.state.friends[i].chat} image={this.state.friends[i].image}/>)
            x ++
        }
        let empty_convo = <div className="text-center mt-48"><h2>No Convo Yet! Start one now!</h2></div>
        let messagebox = []
        for (let i of this.state.chat){
            messagebox.push(<MessageText message={i["msg"]} author={i["id"]} uid={i['uid']} datetime={i["datetime"]}/>);
        }
        return (
            <>
            {this.state.loading === true ? <Loading/> : 

            <div className='grid grid-cols-12 '>
                <div className=' col-span-1'></div>
                
                <div className='mt-8 border border-zinc-300 col-span-3 flex flex-col'>
                    <Input allowClear onPressEnter={this.onSearchUser} placeholder="Search or start a new convo" style={{borderRadius:"10px",margin:"15px auto", width:"85%"}} prefix={<SearchOutlined/>}/>
                    {personlist}
                </div>
                {this.state.no_chat === false ? 
                <>
                <div className='col-span-7 container flex flex-col mx-auto mt-8 border border-zinc-300' style={{height:"85vh"}}>
                    <h2 className='text-2xl p-4 h-18'>Chat with {sessionStorage.otherUser}</h2>
                    {this.state.loading_1 === false ? 
                    <>
                    <div className="h-4/5 overflow-scroll">
                        {messagebox}
                        {/* {messagebox.length === 0 ? empty_convo : messagebox} */}
                        <div ref={this.el} ></div>
                    </div >
                    <div className="bg-slate-200 py-5 flex-grow">
                        <div className='text-center'>
                                <Input.TextArea size="large" rows={1} style={{width:"85%", marginRight:"10px"}} value={this.state.msg} onChange={this.handleChange}/>
                                <Button onClick={this.sendMsg} style={{display:"inline-block",  verticalAlign:"top"}} shape='round' type='primary'>Send</Button>
                        </div>
                    </div>  
                    </> : <Spin tip="Loading your message..." size="large" style={{margin:"auto auto", position:"absolute", top:"300px"}}> </Spin>}
                </div> </>  
                : <div className='col-span-7 container flex flex-col mx-auto mt-8 border border-zinc-300 text-center py-72 text-base italic' style={{height:"85vh"}}>Choose who you want to converse with!</div>}
                
                <div className=' col-span-1'></div>
            </div>}
            </>
        )
    }
}

export default Message;