import React from 'react'
import { Table, Button } from 'antd';
import axios from 'axios';
import '../Signup/signup.css'
import { CheckOutlined,CloseOutlined } from '@ant-design/icons';
import Loading from '../../components/Loading';
import NetworkGraph from '../../components/networkGraph';
import Graph from '../../components/data';


class MentorNetwork extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            requests : [],
            loading: true
        };
    this.accept_request = this.accept_request.bind(this)
    this.reject_request = this.reject_request.bind(this) 
    }

    componentDidMount(){
        axios.get(`https://women-connect-app.herokuapp.com/getrequest/` + sessionStorage.user )
        .then ((response) => {
            console.log(response)
            this.setState({
                requests: response.data.data,
                loading:false
            })
        })
        .catch(error => {
            console.log(error.message)
        })
    }

    accept_request(event){
        event.preventDefault()
        let id = event.currentTarget.value
        console.log(id)
        axios.get(`https://women-connect-app.herokuapp.com/acceptrequest/` + id + "/" + sessionStorage.user)
        .then ((response) => {
            console.log(response)
            alert('Friend Accepted!')
            window.location.reload(false);
        })
        .catch(error => {
            console.log(error.message)
        })
    }

    reject_request(event){
        event.preventDefault()
        let id = event.currentTarget.value
        console.log(id)
        axios.get(`https://women-connect-app.herokuapp.com/rejectrequest/` + id + "/" + sessionStorage.user)
        .then ((response) => {
            console.log(response)
            window.location.reload(false);
        })
        .catch(error => {
            console.log(error.message)
        })
    }
    render(){
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: '20%',
                render: text => <a >{text}</a>
            },
            {
                title: 'About',
                dataIndex: 'about',
                key: 'about',
                width: '50%',
            },
            {
                title: 'Role',
                dataIndex: 'role',
                key: 'role',
                width: '10%'
            },
            {
                title: '',
                key: 'accept',
                width: '20%',
                render: (record) => (
                    <div className='text-center'> 
                        <Button onClick={this.accept_request} value={record.id} shape="circle" style={{color:'green', borderColor:"green", marginRight:"40px"}} icon={<CheckOutlined />}></Button>
                        <Button onClick={this.reject_request} value={record.id} shape="circle" danger icon={<CloseOutlined />}></Button>
                    </div>
                    
                )
        }]
        
        return (
            <>
                {this.state.loading === true ? <Loading/> : 
                <>
                <div className='flex flex-col mx-auto mt-8'>
                    <h1 className='text-center text-3xl pt-4 px-4'>Friend Request</h1>
                    <div className='grid grid-cols-12 ' >
                    <div className=' col-span-1'></div>
                    <div className="mt-12 col-span-10">
                        <Table bordered={true} 
                                columns={columns} 
                                dataSource={this.state.requests} 
                                expandable={{
                                    expandedRowRender: (record) => (
                                        <Graph id={record.id} owner={sessionStorage.user}/>
                                    )
                                }}
                                style={{borderColor:'rgb(203 213 225)'}}
                        />
                    </div>
                    <div className='col-span-1'></div>
                    </div>
                </div>
                </>}
            </>
        )
    }
}

export default MentorNetwork;