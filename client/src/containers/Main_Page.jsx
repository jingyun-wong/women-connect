import React from 'react'
import { Carousel,Image, Button} from 'antd';

class MainPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className='h-screen'>
                <nav className="px-2 sm:px-4 py-3 rounded dark:bg-gray-800 navbar">
                    <div className="container flex flex-wrap justify-between items-center mx-auto h-14">
                            <div className="flex items-center">
                                <img src={require('../images/logo.png')} alt='logo' className="p-1 h-16"/>
                                <span className="text-xl font-semibold whitespace-nowrap dark:text-white">Women Connect</span>
                            </div>
                    </div>
                </nav>
                <div className='mx-36 m-5 grid grid-cols-5 justify-center content-center h-5/6'>
                    <div className='mt-2 col-span-2 mr-15'>
                        <h1 className='text-6xl leading-snug'>Connect, chat, and create new story</h1>
                        <h5 className='text-base font-light pr-24 leading-8'>One-stop platform that allows women to share their career journey and support each other</h5>
                        <Button href='https://women-connect.herokuapp.com/signup' className='mr-5 my-7' size="large" type="default" style={{backgroundColor:"rgba(129, 178, 154, 0.2)"}}>Create New Account</Button>
                        <Button href='https://women-connect.herokuapp.com/login' size="large" type='primary'>Log In</Button>
                    </div>
                    <div className='col-span-3'>
                        <Carousel autoplay>
                            <div><Image preview={false} src={require('../images/women_empowerment.jpg')}></Image></div>
                            <div><Image preview={false} src={require('../images/women_empowerment_2 (3).jpg')}></Image></div>
                            <div><Image preview={false} src={require('../images/linkedin-sales-solutions-IjkIOe-2fF4-unsplash.jpg')}></Image></div>
                            <div><Image preview={false} src={require('../images/women_empowerment_2 (1).jpg')}></Image></div>
                            <div><Image preview={false} src={require('../images/markus-winkler-btXaHWJbO4s-unsplash.jpg')}></Image></div>
                        </Carousel>
                    </div>
                </div>
            </div>
    
            )
        }
}

export default MainPage;