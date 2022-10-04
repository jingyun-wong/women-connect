import axios from 'axios';
import React from 'react'
import { Form, Input, Button, Row } from 'antd';
import "./signup.css"

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: "",
            email_address: "",
            password: "",
            userId: ""
        };
        this.onFinish = this.onFinish.bind(this);
        this.onFinishFailed = this.onFinishFailed.bind(this);
    }

    onFinish(values){
        axios.post("https://women-connect-app.herokuapp.com/login/check", values)
            .then ((response) => {
                this.setState({
                    userId : response.data.data.id
                });
                sessionStorage.setItem('user', response.data.data.id);
                sessionStorage.setItem("type", response.data.data.role)
                window.location.href = `https://women-connect.herokuapp.com/home`;
            })
            .catch(error => {
                alert("Email Address / Password Wrong! ")
            })
    }

    onFinishFailed(){
        console.log('finish')
    }

    render(){
        return(
            <div>
                <nav className="px-2 sm:px-4 py-3 rounded dark:bg-gray-800 navbar">
                    <div className="container flex flex-wrap justify-between items-center mx-auto h-14">
                            <div className="flex items-center">
                                <img src={require('../../images/logo.png')} alt='logo' className="p-1 h-16"/>
                                <span className="text-xl font-semibold whitespace-nowrap dark:text-white">Women Connect</span>
                            </div>
                    </div>
                </nav>
                <div className="w-1/3 mx-auto border-2 mt-36 p-10">
                    <div className='text-center mb-5'> 
                        <img src={require('../../images/logo.png')} alt='logo' className="p-1 h-16 inline-block"/>
                        <h1 className="text-lg font-light text-center tracking-tight my-auto inline-block align-middle ml-0 mr-5">Women Connect</h1>
                        <h1 className='text-3xl mt-5'>Sign In</h1>
                    </div>
                    <Form name="basic"
                        // labelCol={{
                        //     span: 5,
                        // }}
                        // wrapperCol={{
                        //     span: 25,
                        // }}
                        initialValues={{
                            remember: true,
                        }}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                    autoComplete="on"
                    layout='vertical'
                    style={{width:"100%", textAlign:"right"}}
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{required: true,message: 'Please input your Email!'}]}
                            // style={{margin:"0 auto", alignItems:"left", width:"100%"}}
                        >
                            <Input />
                        </Form.Item>
                    
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{required: true,message: 'Please input your password!'}]}
                        // style={{margin:"0 auto", alignItems:"left"}}
                    >
                        <Input.Password />
                    </Form.Item>
                    
                    <Form.Item
                        wrapperCol={{
                        offset: 8,
                        span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit" style={{textAligh:"left", marginTop:5}}>
                        Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
    }
}

export default Login;