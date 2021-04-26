import axios from 'axios';
import React, { Component } from 'react'
import { BsExclamationCircle, BsFillEnvelopeFill, BsFillPersonFill, BsLockFill } from 'react-icons/bs';

export default class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: null,
            username: null,
            email: null,
            password: null,
            password_confirmation: null,
            errors: [],
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e){
        e.preventDefault();
        const options = {
            url: '/api/register',
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
            },
            data: {
                name: this.state.name,
                username: this.state.username,
                email: this.state.email,
                password: this.state.password,
                password_confirmation: this.state.password_confirmation,
            },
            headers: {
                'X-CSRF-TOKEN': document.getElementById('csrf_token').getAttribute('content')
            }
        };
        axios(options)
        .then(res => {
            if(res.data.message === "Success"){
                window.location.href = "http://localhost:8000/";
            }else{
                var error  = Array();
                error['all'] = "Something went wrong. Refresh the page and try again.";
                this.setState({
                    errors: error
                })
            }
        })
        .catch(err => {
            if(err.response.status == 401){
                var error  = Array();
                error['all'] = err.response.data.error;
                this.setState({
                    errors: error
                })
            }else if(err.response.status == 422){
                this.setState({
                    errors: err.response.data.errors
                })
            }else{
                var error  = Array();
                error['all'] = "Something went wrong. Refresh the page and try again.";
                this.setState({
                    errors: error
                })
            }
        })
    }

    render() {
        return (
            <div className="mainWrapper">
                <div className="registerPage">
                    <h4 className="title">REGISTER</h4>
                    <a href="/" className="brandName"><h4>vibie</h4></a>
                    {this.state.errors ? 
                        Object.keys(this.state.errors).map((key, i)=>{
                            return(
                                <p className="warning" key={i}><BsExclamationCircle />{this.state.errors[key]}</p>
                            )
                        })
                    : ''}
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="name"> <BsFillPersonFill />
                            <input type="text" name="name" placeholder="Full name" onChange={(e)=>{this.setState({name: e.target.value})}} style={{borderBottom:this.state.errors && (this.state.errors['name'] || this.state.errors['all']) ? '3px solid red' : '1px solid #fff'}} />
                        </label>
                        <label htmlFor="username"> <BsFillPersonFill />
                            <input type="text" name="username" placeholder="Username" onChange={(e)=>{this.setState({username: e.target.value})}} style={{borderBottom:this.state.errors && (this.state.errors['username'] || this.state.errors['all']) ? '3px solid red' : '1px solid #fff'}} />
                        </label>
                        <label htmlFor="email"> <BsFillEnvelopeFill />
                            <input type="email" name="email" placeholder="Email" onChange={(e)=>{this.setState({email: e.target.value})}} style={{borderBottom:this.state.errors && (this.state.errors['email'] || this.state.errors['all']) ? '3px solid red' : '1px solid #fff'}} />
                        </label>
                        <label htmlFor="password"> <BsLockFill />
                            <input type="password" name="password" placeholder="Password" onChange={(e)=>{this.setState({password: e.target.value})}} style={{borderBottom:this.state.errors && (this.state.errors['password'] || this.state.errors['all']) ? '3px solid red' : '1px solid #fff'}} />
                        </label>
                        <label htmlFor="password_confirmation"> <BsLockFill />
                            <input type="password" name="password_confirmation" placeholder="Confirm password" onChange={(e)=>{this.setState({password_confirmation: e.target.value})}} style={{borderBottom:this.state.errors && (this.state.errors['password_confirmation'] || this.state.errors['all']) ? '3px solid red' : '1px solid #fff'}} />
                        </label>
                        <p>Click <a href="/login">here</a> to log in</p>
                        <input type="submit" value="Register" />
                    </form>
                </div>
            </div>
        )
    }
}
