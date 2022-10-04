import axios from 'axios';
import React from 'react'
import "./signup.css"
import { Button} from 'antd';

class Signup extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: "",
            email_address: "",
            phone_number: "",
            password: "",
            dob: "",
            confirm_password: "",
            isMentor: "",
            checkPassword: "", 
            userId: "",
            submit: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
                
        this.setState({
            [name]: value
        }, () => {
            if (this.state.username !== "" && this.state.email_address !== "" && this.state.password !== "" && this.state.confirm_password !== "" && this.state.isMentor !== ""){
                this.setState({
                    submit: false
                })
            }
        })
    }

    handleSubmit(event){
        event.preventDefault();
        this.setState({checkPassword: ""});
        if (this.state.password !== this.state.confirm_password){
            let errorsList = "Password do not match";
            this.setState({checkPassword: errorsList});
        }
        else{
            let user = {
                name: this.state.username,
                email: this.state.email_address,
                password: this.state.password,
                phone_number: this.state.phone_number,
                dob: this.state.dob,
                role: this.state.isMentor
            }
            axios.post("https://women-connect-app.herokuapp.com/signup",user)
            .then ((response) => {
                this.setState({
                    successful_signup: true,
                    userId : response.data.data.id
                });
                sessionStorage.setItem('user', response.data.data.id);
                sessionStorage.setItem("type", user.role)
                window.location.href = `https://women-connect.herokuapp.com/profile/${this.state.isMentor}`;
            })

            .catch(error => {
                console.log( error.message )
            })
        }
    }

    render() {
        return (
            <div>
                <nav className="px-2 sm:px-4 py-3 rounded dark:bg-gray-800 navbar">
                    <div className="container flex flex-wrap justify-between items-center mx-auto h-14">
                            <div className="flex items-center">
                                <img src={require('../../images/logo.png')} alt='logo' className="p-1 h-16"/>
                                <span className="text-xl font-semibold whitespace-nowrap dark:text-white">Women Connect</span>
                            </div>
                    </div>
                </nav>

                <div className="flex h-full justify-center items-center">
                    <div className="signup border-slate-100 drop-shadow-md container p-10 mt-20">
                        <div className='mb-5'>
                            <img src={require('../../images/logo.png')} alt='logo' className="p-1 h-16 inline-block"/>
                            <h1 className="text-3xl font-light tracking-tight my-auto inline-block align-middle">Create your Women Connect Account</h1>
                        </div>
                        <form>
                            <div className="mb-6">
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">Name<span className='text-red-400'> *</span></label>
                                <input type="text" name="username" value={this.state.username} onChange={this.handleChange} id="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5" placeholder="Full Name" required/>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="Email Address" className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">Email Address<span className='text-red-400'> *</span></label>
                                <input data-testid="email" type="text" name="email_address" value={this.state.email_address} onChange={this.handleChange} id="email_address" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5" placeholder="jane.doe@company.com" required/>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="Phone Number" className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">Phone Number</label>
                                    <input data-testid="phone" type="text" name="phone_number" value={this.state.phone_number} onChange={this.handleChange} id="phone_number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5" placeholder="Phone Number"/>
                                </div>

                                <div>
                                    <label htmlFor="Date of Birth" className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">Date of Birth</label>
                                    <input data-testid="dob" type="date" name="dob" value={this.state.dob} onChange={this.handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg w-full p-2.5" placeholder="Select date"></input>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="Password" className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">Password<span className='text-red-400'> *</span></label>
                                    <input data-testid="pw" type="Password" name="password" value={this.state.password} onChange={this.handleChange} pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                    title="At least one  number and one uppercase and lowercase letter and 8 or more characters" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5" placeholder="Password" required/>
                                    <span data-testid="fail_pw" className='text-sm text-red-500'>{this.state.checkPassword}</span>
                                </div>

                                <div>
                                    <label htmlFor="Confirm Password" className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">Confirm Password<span className='text-red-400'> *</span></label>
                                    <input data-testid="pw_cfm" type="Password" name="confirm_password" value={this.state.confirm_password} onChange={this.handleChange} id="confirm _password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5" placeholder="Confirm Password" required/>
                                </div>
                                
                            </div>
                            <span className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">Role:<span className='text-red-400'> *</span></span>
                            <div className="flex items-center mb-4">
                                <input id='mentor' data-testid="mentor" type="radio" onChange={this.handleChange} checked={this.state.isMentor==='mentor'} value="mentor" name="isMentor" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                <label htmlFor="mentor" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Mentor</label>
                            
                                <input id='mentee'  data-testid="mentee" type="radio" onChange={this.handleChange} checked={this.state.isMentor==='mentee'} value="mentee" name="isMentor" className="ml-4 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                <label htmlFor="mentee" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Mentee</label>
                            </div>

                            <Button onClick={this.handleSubmit} disabled={this.state.submit} type="primary" size="medium" shape="round" >Sign Up</Button>
                        </form>
                    </div>
                </div>
            </div>
            )
        }
}

export default Signup;