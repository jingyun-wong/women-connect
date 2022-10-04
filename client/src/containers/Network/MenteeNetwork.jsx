import React from 'react'
import MentorCard from '../../components/mentorCard';
import Loading from '../../components/Loading';
import {Row, Col, Input} from 'antd';
import axios from 'axios';

const {Search} = Input;

class MenteeNetwork extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            all_mentors: [], 
            loading: true
        }
        this.onSearch = this.onSearch.bind(this) 
        
    }

    onSearch(value){
        console.log(value)
        axios.get("https://women-connect-app.herokuapp.com/mentor/filter/" + sessionStorage.user + "/" + value)
        .then((response) => { 
            let mentors = response.data.data
            this.setState({all_mentors: mentors})
        })
        .catch(error => {
            console.log(error.message)
        })
    }

    componentDidMount(){
        // axios.get(`http://127.0.0.1:5000/mentorsearch/` + sessionStorage.user)
        // .then ((response) => {
        //     console.log(response)
        //     this.setState({all_mentors: response.data.data})
        // })
        // .catch(error => {
        //     console.log(error.message)
        // })

        let searchItem = window.location.href.split("/").pop()
        axios.get("https://women-connect-app.herokuapp.com/mentor/filter/" + sessionStorage.user + "/" + searchItem)
        .then((response) => { 
            console.log(response)
            let mentors = response.data.data
            this.setState({all_mentors: mentors})
            this.setState({loading:false})
        })
        .catch(error => {
            console.log(error.message)
        })
    }
    render(){
        let children = []
        let x = 4;
        let total_mentors = this.state.all_mentors
        let len = total_mentors.length;
        
        if (len > 4){
            for (let i = 4; i < len; i+=4){
                children.push(
                    <Row key={`row-${i}`} justify="start" gutter={16}>
                        <Col className="gutter-row" style={{marginBottom:"26px"}} xs= {{span: 10}} lg={{span: 6}}>
                            <MentorCard friend={total_mentors[x-4].friend} role={total_mentors[x-4].role} image={total_mentors[x-4].image} name={total_mentors[x-4].name} about={total_mentors[x-4].about} id={total_mentors[x-4].id}/>
                        </Col> 
                        <Col className="gutter-row" style={{marginBottom:"26px"}} xs= {{span: 10}} lg={{span: 6}}>
                            <MentorCard friend={total_mentors[x-3].friend} role={total_mentors[x-3].role} image={total_mentors[x-3].image} name={total_mentors[x-3].name} about={total_mentors[x-3].about} id={total_mentors[x-3].id}/>
                        </Col>
                        <Col className="gutter-row" style={{marginBottom:"26px"}} xs= {{span: 10}} lg={{span: 6}}>
                            <MentorCard friend={total_mentors[x-2].friend} role={total_mentors[x-2].role} image={total_mentors[x-2].image} name={total_mentors[x-2].name} about={total_mentors[x-2].about} id={total_mentors[x-2].id}/>
                        </Col> 
                        <Col className="gutter-row" style={{marginBottom:"26px"}} xs= {{span: 10}} lg={{span: 6}}>
                            <MentorCard friend={total_mentors[x-1].friend} role={total_mentors[x-1].role} image={total_mentors[x-1].image} name={total_mentors[x-1].name} about={total_mentors[x-1].about} id={total_mentors[x-1].id}/>
                        </Col> 
                    </Row>
                );
                x = x + 4;
            }

            let extra = this.state.all_mentors.length % 4
            children.push(
                <Row key={`row-${len}`} justify="start" style={{ margin:"auto"}} gutter={16}>
                    {extra-3 >= 0 ? <Col className="gutter-row" style={{marginBottom:"26px"}} xs= {{span: 10}} lg={{span: 6}}>
                        <MentorCard friend={total_mentors[len-extra].friend} role={total_mentors[len-extra].role} image={total_mentors[len-extra].image} name={total_mentors[len-extra].name} about={total_mentors[len-extra].about} id={total_mentors[len-extra].id}/>
                    </Col>: <></>}
                    {extra-2 >= 0 ? <Col className="gutter-row" style={{marginBottom:"26px"}} xs= {{span: 10}} lg={{span: 6}}>
                        <MentorCard friend={total_mentors[len-extra+1].friend} role={total_mentors[len-extra+1].role} image={total_mentors[len-extra+1].image}  name={total_mentors[len-extra+1].name} about={total_mentors[len-extra+1].about} id={total_mentors[len-extra+1].id}/>
                    </Col>: <></>}
                    {extra-1 >= 0 ? <Col className="gutter-row" style={{marginBottom:"26px"}} xs= {{span: 10}} lg={{span: 6}}>
                        <MentorCard friend={total_mentors[len-extra+2].friend} role={total_mentors[len-extra+2].role} image={total_mentors[len-extra+2].image}  name={total_mentors[len-extra+2].name} about={total_mentors[len-extra+2].about} id={total_mentors[len-extra+2].id}/>
                    </Col>: <></>}
                </Row>
            )
        }

        else{
            children.push(
                <Row key={`row-${len}`} justify="start" gutter={16}>
                    {total_mentors.length > 0 ? <Col className="gutter-row" style={{marginBottom:"26px"}} xs= {{span: 10}} lg={{span: 6}}>
                        <MentorCard friend={total_mentors[x-4].friend} role={total_mentors[x-4].role} image={total_mentors[x-4].image} name={total_mentors[x-4].name} about={total_mentors[x-4].about} id={total_mentors[x-4].id}/>
                    </Col> : <></>}
                    {total_mentors.length > 1 ? <Col className="gutter-row" style={{marginBottom:"26px"}} xs= {{span: 10}} lg={{span: 6}}>
                        <MentorCard friend={total_mentors[x-3].friend} role={total_mentors[x-3].role} image={total_mentors[x-3].image} name={total_mentors[x-3].name} about={total_mentors[x-3].about} id={total_mentors[x-3].id}/>
                    </Col> : <></>}
                    {total_mentors.length > 2 ? <Col className="gutter-row" style={{marginBottom:"26px"}} xs= {{span: 10}} lg={{span: 6}}>
                        <MentorCard friend={total_mentors[x-2].friend} role={total_mentors[x-2].role} image={total_mentors[x-2].image} name={total_mentors[x-2].name} about={total_mentors[x-2].about} id={total_mentors[x-2].id}/>
                    </Col> : <></>}
                    {total_mentors.length > 3 ? <Col className="gutter-row" style={{marginBottom:"26px"}} xs= {{span: 10}} lg={{span: 6}}>
                        <MentorCard friend={total_mentors[x-1].friend} prole={total_mentors[x-1].role} rofile={total_mentors[x-1].image} name={total_mentors[x-1].name} about={total_mentors[x-1].about} id={total_mentors[x-1].id}/>
                    </Col> : <></>}
                </Row>
            );
        }


        return (
            <>
                {this.state.loading === true ? <Loading/> : 
                <>
                    <div className='flex flex-col mx-auto mt-8'>
                        <h1 className='text-center text-3xl pt-4 px-4'>Search for like-minded members</h1>
                        <div className='grid grid-cols-12 ' >
                        <div className=' col-span-1'></div>
                        <div className="mt-12 col-span-10" data-testid = "mentorCard">
                            {children}
                        </div>
                        <div className=' col-span-1'></div>
                        </div>
                    </div>
                </>}
            </>
        )
    }
}

export default MenteeNetwork;