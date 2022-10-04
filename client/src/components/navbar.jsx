import React, {useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import {Input} from 'antd';
import './navbar.css'
import './createPost.css'
import { SearchOutlined} from '@ant-design/icons';
const axios = require('axios');

const {Search} = Input;

function Navbar() {
    const user = sessionStorage.type;
    const username = sessionStorage.user
    const [image,setImage] = useState("")
    const [searchItem,setSearch] = useState("")

    useEffect(() => {
        axios.get("https://women-connect-app.herokuapp.com/profile/create/" + username)
        .then ((response) => {
            setImage(response.data.data.image)
        }) 
    })

    function onSearchUser(e){
        console.log(e.target.value)
        let searchItem = e.target.value
        window.location.href = `https://women-connect.herokuapp.com/network/mentee/` + searchItem ;
    }

    return (
        <nav className="px-2 sm:px-4 py-3 rounded dark:bg-gray-800 navbar">
            <div className="container flex flex-wrap justify-between items-center mx-auto h-14">
                <div className="flex items-center">
                    <img src={require('../images/logo.png')} className="p-1 h-16"/>
                    <span className="text-xl font-semibold whitespace-nowrap dark:text-white">Women Connect</span>
                    <Input bordered={false} allowClear defaultValue={window.location.href.split("network/mentee")[0] === "https://women-connect.herokuapp.com/" ? decodeURI(window.location.href.split("network/mentee/")[1]) : ""} onPressEnter={onSearchUser} placeholder="Search for users" style={{marginLeft:"20px", width:"30vw",height:"40px", borderRadius:"10px", border:"1px", backgroundColor:"rgb(248 250 252)"}} prefix={<SearchOutlined/>}/>
                </div>


                <div className=" w-full md:block md:w-auto">
                    <ul className="flex flex-col items-center mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
                        <li>
                            <Link to="/home" className="nav-links py-2 pr-4 pl-3 text-gray-700 md:bg-transparent">
                                Home
                            </Link>
                        </li>
                        
                        <li>
                            <Link to="/message" className="nav-links py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700  dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                                Messaging
                            </Link>                        
                        </li>

                        <li>
                            <Link to='/network/mentor' className="nav-links py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700  dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                                My Network
                            </Link> 
                            {/* //user === "mentor" ? "/network/mentor" : "/network/mentee" */}
                        </li>

                        <li>
                            <Link to={user === "mentor" ? "/profile/mentor" : "/profile/mentee"}>
                                <img className="nav-links mx-auto h-10 w-10 rounded-full sm:mx-0 sm:shrink-0 md:border-0" src={image === "" ? "https://joeschmoe.io/api/v1/female/jane" : "data:image/png;base64," + image}></img>                         
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
