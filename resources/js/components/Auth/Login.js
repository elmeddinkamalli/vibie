import axios from 'axios';
import React, { Component } from 'react'
import { BsLockFill, BsFillPersonFill, BsFillExclamationCircleFill, BsExclamationCircle } from 'react-icons/bs'

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: null,
            password: null,
            errors: [],
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e){
        e.preventDefault();

        const options = {
            url: '/api/login',
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
            },
            withCredentials: true,
            credentials: 'include',
            data: {
                username: this.state.username,
                password: this.state.password,
            }
        };

        axios(options)
        .then(res => {
            if(res.data.message === "Success"){
                window.location.href = "https://vibie.herokuapp.com/";
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
                <div className="loginPage">
                    <h4 className="title">LOG IN</h4>
                    <a href="/" className="brandName"><h4>vibie</h4></a>
                    {this.state.errors ? 
                        Object.keys(this.state.errors).map((key, i)=>{
                            return(
                                <p className="warning" key={i}><BsExclamationCircle />{this.state.errors[key]}</p>
                            )
                        })
                    : ''}
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="username"> <BsFillPersonFill />
                            <input type="text" name="username" placeholder="Username" onChange={(e)=>{this.setState({username: e.target.value})}} style={{borderBottom:this.state.errors && (this.state.errors['username'] || this.state.errors['all']) ? '3px solid red' : '1px solid #fff'}} />
                        </label>
                        <label htmlFor="password"> <BsLockFill />
                            <input type="password" name="password" placeholder="Password" onChange={(e)=>{this.setState({password: e.target.value})}} style={{borderBottom:this.state.errors && (this.state.errors['password'] || this.state.errors['all']) ? '3px solid red' : '1px solid #fff'}} />
                        </label>
                        <p>Click <a href="/register">here</a> to sign up for a new account</p>
                        <input type="submit" value="Login" />
                    </form>
                </div>
            </div>
        )
    }
}
