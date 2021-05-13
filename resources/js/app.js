require('./bootstrap');

import axios from 'axios';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Index from './components/Layouts/Index';

const root = document.getElementById('app');
class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: null,
            authenticateRestult: false
        }
    }

    componentDidMount(){
        const options = {
            url: '/api/isauth',
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
            },
            withCredentials: true,
            credentials: 'include',
        };
        axios(options)
        .then(res => {
            if(res.data){
                this.setState({
                    user: res.data,
                    authenticateRestult: true
                });
            }
        })
        .catch(err => {
            this.setState({authenticateRestult: true});
        })
    }

    render() {
        return (this.state.authenticateRestult ? <Index user={this.state.user} /> : '')
    }
}
if (root) {
    axios.defaults.baseURL = "https://vibie.herokuapp.com/";
    window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = window.Laravel.csrfToken;
                console.log(window.Laravel.csrfToken);
    ReactDOM.render(<App />, root)
}
