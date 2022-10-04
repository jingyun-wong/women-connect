import React, { createElement, useState , useEffect} from 'react';
import 'antd/dist/antd.css';
import { Avatar, Comment, Tooltip } from 'antd';


function MessageText(props){
    let color = "rgba(129, 178, 154, 0.2)"
    let html =  <Avatar src= {sessionStorage.otherPic === "" ? "https://joeschmoe.io/api/v1/female/jane" :"data:image/png;base64," + sessionStorage.otherPic }  alt={props.author} size={64} style={{verticalAlign:"bottom", margin:"10px"}} />
    let html_two =  <div className='w-20'></div>

    if (props.author == sessionStorage.name){
        color = "rgba(255, 184, 184, 0.2)"
        html = <div className='w-20'></div>
        html_two = <Avatar src= {sessionStorage.userPic === "" ? "https://joeschmoe.io/api/v1/female/jane"  : "data:image/png;base64," + sessionStorage.userPic} alt={props.author} size={64} style={{verticalAlign:"bottom", margin:"10px"}} />
    }
    return (
        <div className='flex flex-row'>
            {html}
            <Comment
                    author={<a>{props.author}</a>}
                    content={
                    <p>
                        {props.message}
                    </p>
                    }
                    style={{backgroundColor:color,flexGrow:"1" ,borderRadius:"25px", paddingLeft:"20px",paddingRight:"20px", marginLeft:"10px", marginRight:"10px", marginBottom:"10px"}}
                    datetime={
                    <Tooltip  title={props.datetime}>
                        <span>{props.datetime}</span>
                    </Tooltip>
                    }
            />
            {html_two}
        </div>
    );
};

export default MessageText;