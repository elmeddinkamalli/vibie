import React, { Component } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import InitializeData from '../Helper/InitializeData';
import LoadMore from '../Helper/LoadMore';
import Loading from '../Additions/Loading';

export default class Users extends Component {
    constructor(props){
        super(props);
        this.state = {
            isMount: true,
        }
        this.loadMore = this.loadMore.bind(this);
    }

    componentDidMount(){
        if(this.state.isMount){
            this.props.setLoading(true);
            this.axiosCancelSource = axios.CancelToken.source();
            axios.get('api/users')
            .then(res => {
                this.props.setData(res.data);
                this.props.setLoading(false);
            })
            .catch(err => {
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
            "users"
        );
    }

    componentWillUnmount(){
        this.props.setData(null);
        this.props.setEnd(false);
        this.props.setLoading(false);
        this.setState({
            isMount: false,
        });
        this.axiosCancelSource.cancel('Axios request canceled.');
        window.removeEventListener('scroll', this.loadMore, false);
    }

    render() {
        return (
            <div className="mainWrapper">
                <Loading loading={this.props.loading} />
                <div className="genresPage">
                    <div className="genresHeading">
                        <h2>Publishers</h2>
                        <p>Listen tracks from publishers below</p>
                    </div>
                    <div>
                        {this.props.data && this.props.data.length ?
                        <div className="publishersGrid">
                            {this.props.data.map(function(user, i){
                                return(
                                    <Link to={'/user/'+user.username} className="publishersGridItem" key={i}>
                                        <img src={user.avatar ? window.location.origin + user.avatar : window.location.origin + '/img/users/default_avatar.jpg'} />
                                        <span>
                                            <p>{user.name}</p>
                                            <small>{user.tracks_count} Tracks</small>
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>
                        : ''}
                    </div>
                </div>
                {this.props.loading ? 
                <div style={{width:'100%', textAlign: 'center', margin: '30px 0'}}><ClipLoader color="#0C101B" /></div>
                : ''}
            </div>
        )
    }
}
