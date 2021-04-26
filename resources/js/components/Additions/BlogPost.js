import React, { Component } from 'react'
import { BiCheck, BiLeftArrow, BiX } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import Delete from '../Helper/Delete';

export default class BlogPost extends Component {
    constructor(props){
        super(props);
        this.state = {
            confirmation:false,
            delete_id: null
        }
        this.sendDeleteRequest = this.sendDeleteRequest.bind(this);
    }

    sendDeleteRequest(){
        Delete(this.state.delete_id, 'blog', this.props.setLoading);
    }

    render() {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return (
            this.props.blogs ? 
            <div className="quickBlogPosts">
                {this.state.confirmation ? <div className="grayed-bg active">
                    <div className="shareOvrly active deleteConf">
                    <div className="heading">
                        <h5>Would you like to delete this blog post?</h5>
                    </div>
                    <div>
                        <button className="confirm" onClick={this.sendDeleteRequest} ><BiCheck /> Confirm</button>
                        <button className="cancel" onClick={(e)=>{this.setState({confirmation:false,delete_id: null})}}><BiX /> Cancel</button>
                    </div>
                    </div>
                </div> : ''}
                {this.props.blogs.map((blog, i)=>{
                return(<div key={i} className="quickBlogPost">
                    {this.props.user && this.props.user.id === blog.user_id ? 
                        <div className="deleteOption"><BiLeftArrow /> <span onClick={()=>{this.setState({confirmation:true, delete_id: blog.id})}}>Delete</span></div>
                    : ''}
                    {blog.cover ? 
                        <img src={window.location.origin+blog.cover} />
                    : ''}
                    <div className={blog.cover ? 'quickBlogTime' : 'quickBlogTime2'}>
                        <b>{new Date(blog.created_at).getDate()}</b>
                        {monthNames[new Date(blog.created_at).getMonth()]}
                    </div>
                    <div className="quickBlogInfos">
                        <Link to={'/blog/'+blog.slug}><h5>{blog.title}</h5></Link>
                        <p>{blog.description.substr(0, 35) + '...'}</p>
                    </div>
                </div>)})}
            </div> : ''
        )
    }
}
