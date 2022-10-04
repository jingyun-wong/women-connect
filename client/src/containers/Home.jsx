import React from 'react'
import Post from '../components/post';
import CreatePost from "../components/createPost"
import Loading from '../components/Loading';
import './Signup/signup.css'
import '../components/createPost.css'
import axios from 'axios';
import { Input, Menu} from 'antd';
import { FireTwoTone, ShareAltOutlined  } from '@ant-design/icons';


const { Search } = Input;
// const items = [
//     "software", "women", "myths", "technology", "engineer", "discrimination", "work ethics", "marketing", "advocate", "upskill"
//     ].map((name, index) => ({
//     key: name,
//     icon: <FireTwoTone twoToneColor="#ff8e57" style={{ verticalAlign: '3px',}}/>,
//     label: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
//     }));

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            posts_data: [],
            top_ten:["software", "women", "myths", "technology", "engineer", "discrimination", "work ethics", "marketing", "advocate", "upskill"],
            loading: true,
            loading_first: false,
            current_search: "",
            item : []
        }
        this.setVisible = this.setVisible.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount(){
        axios.get("https://women-connect-app.herokuapp.com/post/findtag")
        .then((response) => { 
            console.log(response)
            let top_ten_tags = response.data.data
            let items_tags = top_ten_tags.map((name, index) => ({
                key: name,
                icon: <FireTwoTone twoToneColor="#ff8e57" style={{ verticalAlign: '3px',}}/>,
                label: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
                }));
            this.setState({item:items_tags})
        })
        .catch(error => {
            console.log(error.message)
        })

        axios.get("https://women-connect-app.herokuapp.com/post/retrievePost")
        .then((response) => { 
            console.log(response)
            let post_data = response.data.data
            post_data = post_data.reverse()
            this.setState({posts_data : post_data, loading:false})
        })
        .catch(error => {
            console.log(error.message)
        })
    }

    setVisible(event){
        event.preventDefault()
        if (this.state.visible){
            this.setState({visible: false})
        }
        else{
            this.setState({visible: true})
        }
    }

    onClick(e){
        console.log(e.key)
        if (this.state.current_search === "" || this.state.current_search !== e.key){
            this.setState({current_search: e.key, loading_first: true})
            axios.get("https://women-connect-app.herokuapp.com/post/searchtag/" + e.key)
            .then((response) => { 
                console.log(response)
                let post_data = response.data.data
                post_data = post_data.reverse()
                this.setState({posts_data : post_data, loading_first:false})
            })
            .catch(error => {
                console.log(error.message)
            })
        }
        else if (this.state.current_search === e.key){
            this.setState({current_search: "", loading_first:true})
            axios.get("https://women-connect-app.herokuapp.com/post/retrievePost")
            .then((response) => { 
                console.log(response)
                let post_data = response.data.data
                post_data = post_data.reverse()
                this.setState({posts_data : post_data, loading_first:false})
            })
            .catch(error => {
                console.log(error.message)
            })
        }
    }

    onSearch(value){
        console.log(value)
        this.setState({loading_first: true})
        if (value !== ""){
            axios.get("https://women-connect-app.herokuapp.com/post/searchpost/" + value)
            .then((response) => { 
                console.log(response)
                let post_data = response.data.data
                post_data = post_data.reverse()
                this.setState({posts_data : post_data, loading_first:false})
            })
            .catch(error => {
                console.log(error.message)
            })
        }
        else{
            axios.get("https://women-connect-app.herokuapp.com/post/retrievePost")
            .then((response) => { 
                console.log(response)
                let post_data = response.data.data
                post_data = post_data.reverse()
                this.setState({posts_data : post_data, loading_first:false})
            })
            .catch(error => {
                console.log(error.message)
            })
        }
        
    }

    render(){
        const posts = []
        for (let post of this.state.posts_data){
            posts.push(<Post author={post.author} title={post.title} image={post.image} content={post.content} tags={post.tags}/>)
        }

        return(
            <>
                {this.state.loading === true ? <Loading/> : 
            <>
                <div className='grid grid-cols-12'>
                    <div className='col-span-1'></div>
                    <div className='pt-12 col-span-2' 
                        style={{
                            height: '90vh',
                        }}
                        theme="light"
                    >
                        <h1 className='text-base'>Trends for You</h1>
                        <Menu   theme="light" 
                                items={this.state.item} onClick={this.onClick} selectedKeys={[this.state.current_search]}
                                style={{paddingRight:30}}
                        />
                    </div>

                    <div className='mt-12 ml-6 col-span-7' >
                            <Search placeholder="Search for title or tags..." size="large" enterButton allowClear style={{right:0}} onSearch={this.onSearch}/><br></br>
                            
                            <div className="py-5" style={{ borderRadius:"10px"}}>
                                <button style={{backgroundColor:"rgba(129, 178, 154, 0.2)", boxShadow:"0px 4px 4px rgba(0, 0, 0, 0.25)"}} onClick={this.setVisible} className="bg-white w-full text-zinc h-16 rounded text-left py-3 pl-5 border-slate-300 shadow-md text-lg"><ShareAltOutlined style={{paddingRight:"5px"}}/> Share a story!</button>
                            </div>
                            
                            {this.state.loading_first === true ? <Loading/> : 
                            <div>
                                {posts}
                            </div>}
                    </div>
                    <div className='col-span-2'>
                    </div>
                </div>

                <CreatePost  visible={this.state.visible} onCancel={this.setVisible}/>
            </>}
            </>
        )
    }
        


}

export default Home;