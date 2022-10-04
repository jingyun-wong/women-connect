import React, { createElement, useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Avatar, Comment, Image} from 'antd';
import {UserOutlined} from '@ant-design/icons';



function IndivPerson(props){
    // const sendRoom = (() => {
    //     sessionStorage.setItem("otherUser", props.name )
    // })
    const [color, setColor] = useState("white")

    useEffect(() => {
        if (sessionStorage.otherUser == props.name){
            setColor("rgba(129, 178, 154, 0.2)")
        }
        else{
            setColor("white")
        }
    })
    
    return (
        <div className='flex items-center px-2 border-y' style={{backgroundColor: color}} >
                        <Avatar src={<Image preview={false} src={ props.image === "" ? "https://joeschmoe.io/api/v1/female/jane" : "data:image/png;base64," + props.image }/>}
                                icon={<UserOutlined />}
                                size="large"
                                style = {{border: "1px solid gray", marginLeft:"10px", marginRight:"10px"}}
                        /> 
                        <Comment
                            onClick = {props.onClick}
                            author={<a id = {props.id} className={props.uid}>{props.name}</a>}
                            content={
                                <div style={{maxWidth:"150px"}}>
                                    <p className='truncate whitespace-nowrap'>{props.chat}</p>
                                </div>
                            }
                            style={{backgroundColor:"transparent"}}
                        />
        </div>
    )
}

export default IndivPerson;