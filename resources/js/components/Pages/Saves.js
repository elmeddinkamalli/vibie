import React, { Component } from 'react'
import { BsFlag, BsFlagFill, BsHeart, BsHeartFill, BsPause, BsPlay } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import AlbumBox from '../Additions/AlbumBox';
import Like from '../Helper/Like';
import Loading from '../Additions/Loading';
import Track from '../Additions/Track';
import InitializeData from '../Helper/InitializeData';

export default class Likes extends Component {
    constructor(props){
        super(props);
        this.state={
            albums: null,
            tracks: null,
            isMount: true,
        }
    }

    componentDidMount(){
        if(this.state.isMount){
            this.options = {
                url: null,
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
                },
                withCredentials: true,
                credentials: 'include',
            };
            if(this.state.isMount){
                this.axiosCancelSource = axios.CancelToken.source();
                this.props.setLoading(true);
                this.options.url = 'api/albums/saved';
                axios(this.options)
                .then(res => {
                    this.setState({
                        albums: res.data
                    })
                })
                this.props.setLoading(true);
                this.options.url = 'api/tracks/saved';
                axios(this.options)
                .then((res)=>{
                    this.setState({
                        tracks: res.data
                    },()=>{
                        InitializeData(this.props.setCurrentPlaylist, 
                        this.props.currentPlaylist, 
                        this.props.setCurrentTrack, 
                        this.props.currentTrack, 
                        this.state.tracks, 
                        this.state.tracks[0])
                    })
                    this.props.setLoading(false);
                })
                .catch((err)=>{
                    this.props.setLoading(false);
                })
            }
        }
    }

    componentWillUnmount(){
        this.axiosCancelSource.cancel('Axios request canceled.')
        this.setState({
            isMount: false,
            albums: null,
        });
    }

    render() {
        return (
            <div className="mainWrapper">
                <Loading loading={this.props.loading} />
                <div className="likedSavedPage">
                    <div className="heading">
                        <img src={require('../../../../public/img/dfltforsaves.svg').default} />
                    </div>
                    <div className="albums">
                    {this.state.albums && this.state.albums.length ? 
                    <AlbumBox 
                        headline="Albums"
                        play={this.props.play} 
                        setPlay={this.props.setPlay} 
                        albums={this.state.albums}
                        currentTrack={this.props.currentTrack}
                        setCurrentTrack={this.props.setCurrentTrack}
                        currentPlaylist={this.props.currentPlaylist}
                        setCurrentPlaylist={this.props.setCurrentPlaylist}
                        trackPlaylistIndex={this.props.trackPlaylistIndex}
                        setTrackPlaylistIndex={this.props.setTrackPlaylistIndex}
                        loading={this.props.loading}
                        setLoading={this.props.setLoading}
                        user={this.props.user}
                        setErrors={this.props.setErrors}
                    /> : ''}
                    </div>
                    {this.state.tracks ? 
                    <div className="relatedTracks">
                        <div className="relatedTracksHeading"><h4>Tracks</h4></div>
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
                </div>
            </div>
        )
    }
}
