import React, {useEffect, useState} from 'react'
import { Avatar, Image, Card, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import "../containers/Signup/signup"
import axios from 'axios';

const {Meta} = Card;

function Post(props){
    const [name, setName] = useState("")
    const [photo, setPhoto] = useState("")
    const tags = []
    for (let tag of props.tags){
        tags.push(<Tag color="cyan">{tag}</Tag>)
    }

    useEffect( () => {
        axios.get("https://women-connect-app.herokuapp.com/user/" + props.author)
        .then((response) => {
            console.log(response)
            setName(response.data.data.name)
        })
        .catch((error => {
            console.log(error.message)
        }))

        axios.get("https://women-connect-app.herokuapp.com/profile/create/" + props.author)
        .then((response) => {
            console.log(response)
            setPhoto(response.data.data.image)
        })
        .catch((error => {
            console.log(error.message)
        }))
    })

    return(
        < div className="border border-zinc-300 rounded-lg mb-2">
        <div className='mb-1 pt-5 px-5'>
                <Avatar 
                    src={<Image preview={false} src={photo === "" ? "https://joeschmoe.io/api/v1/female/jane" : "data:image/png;base64," + photo}/>} 
                    icon={<UserOutlined />}
                />
                <span className='text-base pl-3 font-light'>{name}</span>
            </div>
        <Card data-testid="post" style={{ marginTop: 16 }}
            cover={<img style={{marginTop: 16, textAlign:"center", margin:"0", width:"auto", height:"auto"}} src={`data:image/png;base64,${props.image}`}/>}
        >
            <Meta style={{ marginTop: 5 }} title={props.title} description={props.content}></Meta>
            
            <div style={{ marginTop: 16 }}>
                {tags}
            </div>
        </Card>
        </div>
    )

}

export default Post;