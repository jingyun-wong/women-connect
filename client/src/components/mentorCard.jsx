import React, {useState}from 'react'
import {Card, Button, Tag, Image} from 'antd';
import {PlusOutlined, ArrowRightOutlined,WechatOutlined} from '@ant-design/icons';
import axios from 'axios';
import './createPost.css'

const { Meta } = Card;

function MentorCard (props){
    const [friend, setFriend] = useState(props.friend)
    const addRequest = () => {
        axios.get(`https://women-connect-app.herokuapp.com/addrequest/` + props.id + "/" + sessionStorage.user)  
        .then ((response) => {
            console.log(response)
            alert("Request is sent!")
            setFriend(true)
        })
        .catch(error => {
            console.log(error.message)
        })
    };

    return (
        <Card
            style={{width: 300, borderColor:"rgb(212 212 216)"}}
            cover={
                <Image
                    preview={false}
                    height="300px"
                    width="100%"
                    src= {props.image === "" ? "https://joeschmoe.io/api/v1/female/jane" : "data:image/png;base64," + props.image}
                    style={{objectFit: 'contain'}}
                />
            }
            actions={[
            <Button disabled={friend} icon={<PlusOutlined style={{fontSize:"10px"}}/>} onClick={addRequest} style={{fontSize:"12px", backgroundColor:"rgb(241 245 249)", border:1, padding:"0",margin:"0", width:"86px"}}> Add Friend </Button>,
            <Button icon={<WechatOutlined style={{fontSize:"10px"}} /> } style={{fontSize:"12px", border:1,backgroundColor:"rgb(241 245 249)", padding:"0",margin:"0", width:"86px"}} href={`https://women-connect.herokuapp.com/message/${props.id}`}> Chat </Button>,
            <Button icon={<ArrowRightOutlined style={{fontSize:"10px"}} />} style={{fontSize:"12px", border:1,backgroundColor:"rgb(241 245 249)", padding:"0",margin:"0", width:"86px"}} href={`https://women-connect.herokuapp.com/profile/${props.role}/${props.id}`} > View More </Button>
            ]}
        >
            <Meta
                title={props.name}
                description={props.about}
            />
            <div className='mt-3'>
                <Tag color="geekblue">{props.role}</Tag>
            </div>
        </Card>
    )
}

export default MentorCard;

