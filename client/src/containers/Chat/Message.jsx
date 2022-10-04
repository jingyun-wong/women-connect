import React from 'react'
import { Table, Button, Modal, Input } from 'antd';
import axios from 'axios';

class MessageHomePage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            chats: [],
            isVisible: false,
            name : "",
            friendList: []
        };
    this.sendRoom = this.sendRoom.bind(this)
    this.showModal = this.showModal.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleOk = this.handleOk.bind(this)

    }

    componentDidMount(){
        axios.get(`https://women-connect-app.herokuapp.com/friendlist/` + sessionStorage.user )
        .then ((response) => {
            console.log(response)
            this.setState({
                name: response.data.data.name,
                chats: response.data.data.friends
            })
            let name = response.data.data.name
            sessionStorage.setItem("name", name)
            console.log(this.state)

        })
        .catch(error => {
            console.log(error.message)
        })
    }

    showModal(){
        this.setState({
            isVisible: true
        })
    }

    handleOk(){
        console.log("handle")
    }

    handleCancel(){
        this.setState({
            isVisible: false
        })
    }

    sendRoom(event){
        event.preventDefault()
        console.log(this.state.chats)
        console.log(event.target.id)
        let id = this.state.chats[event.target.id].name
        sessionStorage.setItem("otherUser", id )
        window.location.href = `https://women-connect.herokuapp.com/message`;
    }

    render(){
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: text => <span>{text}</span>,
                width: 150
            },
            {
                title: 'Chat',
                dataIndex: 'chat',
                key: 'chat',
                render: (text,record,index) => <a onClick={this.sendRoom} id={index}>{text}</a>
            },
            {
                title: 'Role',
                dataIndex: 'role',
                key: 'role',
                width: 150,
            }
        ]
        return (
            <>
                <div className='container flex flex-col mx-auto mt-8'>
                    <h1 className='text-center text-4xl p-4'>Chat</h1>
                    <Button onClick={this.showModal}>+ Add New Chat</Button>
                    <Modal title="Basic Modal" visible={this.state.isVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                        {/* <InfiniteScroll
                            dataLength={data.length}
                            next={loadMoreData}
                            hasMore={data.length < 50}
                            loader={
                            <Skeleton
                                avatar
                                paragraph={{
                                rows: 1,
                                }}
                                active
                            />
                            }
                            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                            scrollableTarget="scrollableDiv"
                        >
                            <List
                            dataSource={data}
                            renderItem={(item) => (
                                <List.Item key={item.email}>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.picture.large} />}
                                    title={<a href="https://ant.design">{item.name.last}</a>}
                                    description={item.email}
                                />
                                <div>Content</div>
                                </List.Item>
                            )}
                            />
                        </InfiniteScroll> */}
                        
                    </Modal>
                    <div className="mt-16">
                        <Table 
                            columns={columns} 
                            dataSource={this.state.chats} 
                        />
                    </div>
                </div>
            </>
        )
    }
}

export default MessageHomePage;