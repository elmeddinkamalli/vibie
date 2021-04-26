import React, { Component } from 'react'
import {BsCardText, BsLink45Deg} from 'react-icons/bs'
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import InitializeData from '../Helper/InitializeData';
import LoadMore from '../Helper/LoadMore';
import Loading from '../Additions/Loading';
import { BiCheck, BiLeftArrow, BiX } from 'react-icons/bi';
import Delete from '../Helper/Delete';

export default class Blogs extends Component {
    constructor(props){
        super(props);
        this.state = {
            isMount: true,
            confirmation: false,
            delete_id: null
        }
        this.loadMore = this.loadMore.bind(this);
        this.sendDeleteRequest = this.sendDeleteRequest.bind(this);
    }

    componentDidMount(){
        if(this.state.isMount){
            this.axiosCancelSource = axios.CancelToken.source();
            this.props.setLoading(true);
            axios.get('api/blogs?limit=10')
            .then((res)=>{
                this.props.setData(res.data);
                this.props.setLoading(false);
            })
            .catch((err)=>{
                this.props.setLoading(false);
            })

            InitializeData(this.props.setCurrentPlaylist, 
                this.props.currentPlaylist, 
                this.props.setCurrentTrack, 
                this.props.currentTrack);

            window.addEventListener('scroll', this.loadMore);
        }
    }

    loadMore(){
        LoadMore(
            this.props.end,
            this.props.setEnd,
            this.state.isMount,
            this.props.loading,
            this.props.setLoading,
            this.props.data,
            this.props.setData,
            "blogs"
        );
    }

    componentWillUnmount() {
        this.props.setData(null);
        this.props.setEnd(false);
        this.props.setLoading(false);
        this.setState({
            isMount: false,
        })
        this.axiosCancelSource.cancel('Axios request canceled.');
        window.removeEventListener('scroll', this.loadMore, false);
    }

    sendDeleteRequest(){
        Delete(this.state.delete_id, 'blog', this.props.setLoading);
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
                <div className="blogsPage">
                    <div className="blogsHeading">
                        <h2>Blogs</h2>
                        <p>See what people talking about</p>
                    </div>
                    {this.props.data && this.props.data.length && this.props.data[0].user ? <div>
                        {this.props.data.map((blog, i)=>{
                            var date = new Date(blog.created_at);
                            return(
                                <div className="blogPost" key={i}>
                                    <div className="heading">
                                        <div className="blogTime">
                                            <b>{date.getDate()}</b>
                                            {monthNames[date.getMonth()] + ',' + date.getFullYear()}
                                        </div>
                                        <div className="title">
                                            <Link to={'/blog/'+blog.slug}><h3>{blog.title}</h3></Link>
                                            <span>
                                                <BsCardText /> 10 Comments
                                            </span>
                                        </div>
                                        {this.props.user && this.props.user.id === blog.user_id ? 
                                            <div className="deleteOption"><BiLeftArrow color="#fff" /> <span onClick={()=>{this.setState({confirmation:true, delete_id: blog.id})}}>Delete</span></div>
                                        : ''}
                                    </div>
                                    {blog.cover ? 
                                        <img src={window.location.origin + blog.cover} />
                                    : ''}
                                    <div className="blogBottom">
                                        <p>{blog.description.substr(0,200)+'...'}</p>
                                        <div className="veryBottom">
                                            <Link to={'/user/'+blog.user.username}>
                                                <img src={blog.user.avatar ? window.location.origin + blog.user.avatar : window.location.origin + '/img/users/default_avatar.jpg'} /> {blog.user.name}
                                            </Link>
                                            <Link to={'/blog/'+blog.slug}><BsLink45Deg /> Read More</Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div> : ''}
                </div>
                {this.props.loading ? 
                <div style={{width:'100%', textAlign: 'center', margin: '30px 0'}}><ClipLoader color="#0C101B" /></div>
                : ''}
            </div>
        )
    }
}
