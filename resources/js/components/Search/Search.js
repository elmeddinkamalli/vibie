import React, { Component } from 'react'
import { BsFlag, BsFlagFill, BsHeart, BsHeartFill, BsPause, BsPlay } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Loading from '../Additions/Loading';
import Track from '../Additions/Track';
import InitializeData from '../Helper/InitializeData';
import Like from '../Helper/Like';

export default class Search extends Component {
    constructor(props){
        super(props);
        this.state = {
            isMount: true,
            tracks: null,
            users: null,
            query: new URLSearchParams(window.location.search).get('s_query'),
            currentPage: "tracks"
        }
        this.setPlaylistToLocal = this.setPlaylistToLocal.bind(this);
        this.changePage = this.changePage.bind(this);
    }

    componentDidMount(){
        if(this.state.isMount && this.state.query){
            this.props.setLoading(true);
            this.axiosCancelSource = axios.CancelToken.source();
            axios.get(`api/search?s_query=${this.state.query}`)
            .then((res)=>{
                this.setState({
                    tracks: res.data.tracks,
                    users: res.data.users
                },()=>{
                    InitializeData(this.props.setCurrentPlaylist, 
                        this.props.currentPlaylist, 
                        this.props.setCurrentTrack, 
                        this.props.currentTrack, 
                        res.data.tracks ?? res.data.tracks, 
                        res.data.tracks ?? res.data.tracks[0])
                })
                this.props.setLoading(false);
            })
            .catch((err)=>{
                this.props.setLoading(false);
            })
        }
    }

    setPlaylistToLocal(e){
        if(e){
            SetPlaylistToLocal(
                e,
                this.props.currentTrack,
                this.props.setCurrentTrack,
                this.props.currentPlaylist,
                this.props.setCurrentPlaylist,
                this.props.play,
                this.props.setPlay,
                this.state.tracks,
                this.props.setTrackPlaylistIndex
            );
        }
    }

    componentWillUnmount(){
        this.setState({
            isMount: false,
            tracks: null,
            users: null,
        })
        this.axiosCancelSource.cancel('Axios request canceled.');
    }

    changePage(e){
        if(e){
            this.setState({
                currentPage: e.target.dataset.page
            })
        }
    }

    render() {
        return (
            <div className="mainWrapper">
                <Loading loading={this.props.loading} />
                <div className="searchPage">
                    <div className="navigator">
                        <span className={this.state.currentPage === "tracks" ? "active" : ""} onClick={this.changePage} data-page="tracks">Tracks</span>
                        <span className={this.state.currentPage === "users" ? "active" : ""} onClick={this.changePage} data-page="users">Users</span>
                    </div>
                    {this.state.tracks ? 
                    <div className={this.state.currentPage === "tracks" ? "relatedTracks active" : "relatedTracks"}>
                        <div className="relatedTracksHeading"><h4>
                            {this.state.tracks.length === 0 ? `Tracks not found for \"${this.state.query}\"` : `Tracks for \"${this.state.query}\" search query`}
                        </h4></div>
                        <ul>
                            {this.state.tracks.map((track, i)=>{
                                return (<Track
                                    key={i} 
                                    i={i} 
                                    track={track} 
                                    currentTrack={this.props.currentTrack} 
                                    setCurrentTrack={this.props.setCurrentTrack}
                                    currentPlaylist={this.props.currentPlaylist}
                                    setCurrentPlaylist={this.props.setCurrentPlaylist}
                                    play={this.props.play}
                                    setPlay={this.props.setPlay}
                                    tracks={this.state.tracks}
                                    setTrackPlaylistIndex={this.props.setTrackPlaylistIndex}
                                    loading={this.props.loading}
                                    setLoading={this.props.setLoading}
                                    user={this.props.user}
                                    setErrors={this.props.setErrors}
                                />)
                            })}
                        </ul>
                    </div> : ''}
                    {this.state.users ? 
                    <div className={this.state.currentPage === "users" ? "foundUsers active" : "foundUsers"}>
                        <div className="foundUsersHeading"><h4>{this.state.tracks.length === 0 ? `Users not found for \"${this.state.query}\"` : `Users for \"${this.state.query}\" search query`}</h4></div>
                        <div className="publishersGrid">
                            {this.state.users.map(function(user, i){
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
                    </div> : ''}
                </div>
            </div>
        )
    }
}
