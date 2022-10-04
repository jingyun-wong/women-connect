import React from 'react'
import "../Signup/signup.css"
import { Avatar, Image, Button, Tag, Divider, Modal, Spin, List} from 'antd';
import 'antd/dist/antd.css';
import { UserOutlined } from '@ant-design/icons';
import ProfileForm from "../../components/MenteeProfileForm"
import EducationForm from '../../components/EducationForm';
import ProfilePic from '../../components/ProfilePic';
import Loading from '../../components/Loading';
import moment from 'moment';
import axios from 'axios';

class MentorProfile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: "",
            profile_pic: "",
            about : "",
            career: [],
            industry: [],
            education: [],
            visible: false,
            show_visible: "",
            loading: true, 
            loading1: false,
            friend_list: [],
            friend_data: [],
            setFriend: false,
            userFriend: ""
        };
        this.showModal = this.showModal.bind(this)
        this.addFriend = this.addFriend.bind(this)
    }

    componentDidMount(){
        let queryString = window.location.href.split("/");
        let len = queryString.length
        let user = ""
        if (queryString[len-1] === "mentor"){
            user = sessionStorage.user
        }
        else{
            user = queryString[len-1]
            this.setState({userFriend: user})
        }
        
        axios.get(`https://women-connect-app.herokuapp.com/user/` + user)
        .then ((response) => {
            console.log(response)

            this.setState({
                name: response.data.data.name,
            })
        })
        .catch(error => {
            console.log(error.message)
        })

        axios.get("https://women-connect-app.herokuapp.com/profile/create/" + user)
        .then ((response) => {
            console.log(response)
            if (response.data.data.education.length > 0 ){
                console.log(response.data.data.education)
                console.log(response.data.data.education[0]["period"][0].split("T")[0])
                
                const dateFormat = "YYYY-MM-DD";

                for (let i = 0; i < response.data.data.education.length; i++){
                    response.data.data.education[i]["period"]= [moment(response.data.data.education[i]["period"][0].split("T")[0],dateFormat),moment(response.data.data.education[i]["period"][1].split("T")[0],dateFormat)]
                }
            }

            if (response.data.data.career.length > 0 ){
                console.log(response.data.data.career)                
                const dateFormat = "YYYY-MM-DD";
                for (let i = 0; i < response.data.data.career.length; i++){
                    response.data.data.career[i]["period"]= [moment(response.data.data.career[i]["period"][0].split("T")[0],dateFormat),moment(response.data.data.career[i]["period"][1].split("T")[0],dateFormat)]
                }
            }

            if (response.data.data.request.includes(sessionStorage.user)){
                this.setState({setFriend:true})
            }
            
            this.setState({
                about: response.data.data.about,
                career: response.data.data.career,
                industry: response.data.data.industry,
                education: response.data.data.education, 
                profile_pic: response.data.data.image,
                friend_list : response.data.data.friend_list
            })

            this.setState({
                loading: false
            })

            console.log(this.state)
        })
        .catch(error => {
            console.log(error.message)
        })
    }

    addFriend(){
        axios.get(`https://women-connect-app.herokuapp.com/addrequest/` + this.state.userFriend + "/" + sessionStorage.user)  
        .then ((response) => {
            console.log(response)
            alert("Request is sent!")
            this.setState({setFriend: true})
        })
        .catch(error => {
            console.log(error.message)
        })
    }

    showModal(){
        this.setState({visible:true, loading1:true, friend_data:[]})
        let friends = []
        for (let idx = 0; idx < this.state.friend_list.length; idx++ ){
            axios.get("https://women-connect-app.herokuapp.com/user/" + this.state.friend_list[idx])
            .then ((response) => {
                friends.push({name:response.data.data.name})
            })

            axios.get("https://women-connect-app.herokuapp.com/profile/create/" + this.state.friend_list[idx])
                .then ((response) => {
                    friends[idx].profile = response.data.data.image
                    this.setState({friend_data:friends})
                    setTimeout('', 300000);
                    this.setState({loading1:false})
            })
        }
    }

    render(){
        let view = window.location.href.split("/").pop()
        const empty_info = 
                            <div className='border-dashed border-slate-300 border-2 text-center p-5 m-2'>
                                No information yet! Add it using the edit button!
                            </div>

        const career_sections = []
        for (let career of this.state.career){
            career_sections.push(
                <li className='m-2 mt-5'>
                    <span className='text-base font-medium'> {career.company}</span>
                    <div className='text-slate-900 mt-1'>
                        {career.job}
                    </div>
                    <div className='text-xs italic text-slate-500'> {career.period[0].format('DD-MM-YYYY')} - {career.period[1].format('DD-MM-YYYY')}</div>
                    <div>
                        <span className='whitespace-pre'>{career.desc}</span>
                    </div>
                </li>
            )
        }

        const industries = []
        for (let y of this.state.industry){
            industries.push(<Tag color="purple">{y}</Tag>);
        }

        const edu_sections = []
        for (let education of this.state.education){
            edu_sections.push(
                <li className='m-2 mt-5'>
                    <span className='text-base font-medium'> {education.school}</span>
                    <div className='text-slate-900 mt-1'>
                        {education.course} 
                    </div>
                    <div className='text-xs italic text-slate-500'> {education.period[0].format('DD-MM-YYYY')} - {education.period[1].format('DD-MM-YYYY')}</div>
                    <div>
                        <span className='whitespace-pre'>{education.desc}</span>
                    </div>
                </li>
            )
        }

        return(
            <div>
                {this.state.loading === true ? <Loading/> : 
                <div className='grid grid-cols-12'>
                <div className='col-span-1'></div>

                <div className="pb-7 col-span-10">
                <div className='container w-5/6 mt-8 pl-11 pr-4 py-8 bg-slate-100 rounded-t-lg  mb-1'>
                    {view === "mentor" ? <ProfilePic name={this.state.name} profile={this.state.profile_pic} about={this.state.about}/> : null}
                    <Avatar 
                        src={<Image preview={false} src={this.state.profile_pic === "" ? "https://joeschmoe.io/api/v1/female/jane" : "data:image/png;base64," + this.state.profile_pic}/>} 
                        size={{
                            xs: 40,
                            sm: 80,
                            md: 120,
                            lg: 150,
                            xl: 180,
                            xxl: 200
                        }}
                        icon={<UserOutlined />}
                        alt="profile-pic"
                        style={{border: "1px solid gray"}}
                    />
                    
                    <div className='inline-block pl-6 align-middle'>
                        <div className='text-3xl font-semibold pt-3' data-testid="name">{this.state.name}</div>
                        <div data-testid="about" className='ml-0.5 mt-0.5 mb-1'>{this.state.about}</div>
                        {view === "mentor" ? <Button shape="round" onClick={this.showModal}>My Friends</Button> : <Button shape='round' disabled={this.state.setFriend} onClick={this.addFriend} style={{marginTop:"10px"}}>+ Add Friend</Button>}
                        <Modal visible={this.state.visible} title="Friends" footer={null} onCancel={() => {this.setState({visible:false})}}>
                            {this.state.loading1 === true ? <div className='text-center'><Spin tip="Loading..." style={{margin:'auto'}} /></div>:
                            <List
                                dataSource={this.state.friend_data}
                                renderItem={(item) => (
                                    <List.Item key={item.name} style={{
                                        display: "flex",
                                        justifyContent: "start",
                                        padding: "12px 0",
                                        alignItems: "center",
                                    }}>
                                        <Avatar src={<Image preview={false} src={item.profile === "" || item.profile === undefined ? "https://joeschmoe.io/api/v1/female/jane" : "data:image/png;base64," + item.profile}/>}/>
                                        <div className='text-left pl-5 text-sm'>{item.name}</div>                                       
                                    </List.Item>
                                )}
                                style={{justifyContent:"start"}}
                                />}
                            </Modal>
                    </div>
                </div>

                <div className='container w-5/6 items-center border-zinc-300 border mb-1 rounded'>
                    <div className='signup p-4'>
                    {view === "mentor" ? <ProfileForm industry={this.state.industry}/> : null}
                        <div className='rounded px-6 mb-5'>
                            <Divider style={{fontSize:"large", fontWeight:"bold"}} orientation="left" orientationMargin="0">Industry</Divider>
                            <div>
                                {this.state.industry.length === 0 ? empty_info : industries}    
                            </div>
                        </div>
                    </div>
                </div>

                <div className='container w-5/6 items-center border-zinc-300 border mb-1 rounded'>
                    <div className='p-4 signup'>
                        {view === "mentor" ? <EducationForm careers={this.state.career}/> : null}
                        <div className='rounded px-6  mb-5'>
                            <Divider style={{fontSize:"large", fontWeight:"bold"}} orientation="left" orientationMargin="0">Career</Divider>
                            <div>
                                <ul>
                                    {this.state.career.length === 0 ? empty_info : career_sections}    
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='container w-5/6 items-center border-zinc-300 border mb-1'>
                    <div className='p-4 signup'>
                        {view === "mentor" ?<EducationForm educations={this.state.education}/> : null}
                        <div className='rounded px-6 mb-5'>
                            <Divider style={{fontSize:"large", fontWeight:"bold"}} orientation="left" orientationMargin="0">Education</Divider>
                            <div>
                                <ul>
                                    {this.state.education.length === 0 ? empty_info : edu_sections}    
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-span-1'></div>
            </div>}
        </div>
        )
    }
}

export default MentorProfile;