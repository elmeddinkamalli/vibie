import React, { Component } from 'react'
import { BiCheck, BiLeftArrow, BiX } from 'react-icons/bi';
import { BsCardText } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Loading from '../Additions/Loading';
import Delete from '../Helper/Delete';

export default class SingleBlog extends Component {
    constructor(props){
        super(props);
        this.state = {
            isMonth: true,
            blog: null,
            confirmation: false,
            delete_id: null
        }
        this.sendDeleteRequest = this.sendDeleteRequest.bind(this);
    }

    componentDidMount(){
        if(this.state.isMonth){
            this.props.setLoading(true);
            this.axiosCancelSource = axios.CancelToken.source();
            axios.get('api/blog/'+this.props.slug)
            .then((res)=>{
                this.setState({
                    blog: res.data
                })
                this.props.setLoading(false);
            })
            .catch((err)=>{
                this.props.setLoading(false);
            })
        }
    }

    componentWillUnmount(){
        this.axiosCancelSource.cancel('Axios request canceled.');
        this.setState({
            isMonth: false,
        })
    }

    sendDeleteRequest(){
        Delete(this.state.delete_id, 'blog', this.props.setLoading, true);
    }

    render() {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return (
            <div className="mainWrapper">
                <Loading loading={this.props.loading} />
                {this.state.confirmation ? <div className="grayed-bg active">
                    <div className="shareOvrly active deleteConf">
                    <div className="heading">
                        <h5>Would you like to delete this album?</h5>
                    </div>
                    <div>
                        <button className="confirm" onClick={this.sendDeleteRequest} ><BiCheck /> Confirm</button>
                        <button className="cancel" onClick={(e)=>{this.setState({confirmation:false,delete_id: null})}}><BiX /> Cancel</button>
                    </div>
                    </div>
                </div> : ''}
                <div className="singleBlog">
                    {this.state.blog ? <div className="blogPost">
                        <div className="heading">
                            <div className="blogTime">
                                <b>{new Date(this.state.blog.created_at).getDate()}</b>
                                {monthNames[new Date(this.state.blog.created_at).getMonth()] + ',' + new Date(this.state.blog.created_at).getFullYear()}
                            </div>
                            <div className="title">
                                <h3>{this.state.blog.title}</h3>
                                <span>
                                    <BsCardText /> 10 Comments
                                </span>
                            </div>
                            {this.props.user && this.props.user.id === this.state.blog.user_id ? 
                                <div className="deleteOption"><BiLeftArrow color="#fff" /> <span onClick={()=>{this.setState({confirmation:true, delete_id: this.state.blog.id})}}>Delete</span></div>
                            : ''}
                        </div>
                        {this.state.blog.cover ? 
                        <img src={window.location.origin+this.state.blog.cover} />
                        : ''}
                        <div className="blogBottom">
                            <div className="veryBottom">
                                <Link to={'/user/'+this.state.blog.user.username}>
                                <img src={this.state.blog.user.avatar ? window.location.origin + this.state.blog.user.avatar : window.location.origin + '/img/users/default_avatar.jpg'} /> {this.state.blog.user.name}
                                </Link>
                            </div>
                            <p>{this.state.blog.description}</p>
                        </div>
                    </div> : ''}
                </div>
            </div>
        )
    }
}
