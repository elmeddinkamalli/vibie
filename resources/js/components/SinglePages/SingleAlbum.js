import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { BsPlay, BsFlag, BsHeart, BsPause, BsHeartFill, BsFlagFill, BsTrash } from 'react-icons/bs'
import InitializeData from '../Helper/InitializeData';
import SetPlaylistToLocal from '../Helper/SetPlaylistToLocal';
import Loading from '../Additions/Loading';
import Like from '../Helper/Like';
import Track from '../Additions/Track';
import { BiCheck, BiX } from 'react-icons/bi';
import Delete from '../Helper/Delete';

class SingleAlbum extends Component {
    constructor(props) {
        super(props);
        this.state = {
            album: null,
            tracks: null,
            slug: this.props.slug,
            confirmation: false,
            delete_id: null,
            isMount: true,
        }
        this.setPlaylistToLocal = this.setPlaylistToLocal.bind(this);
        this.sendDeleteRequest = this.sendDeleteRequest.bind(this);
    }

    componentDidMount(){
        if(this.state.isMount){
            this.props.setLoading(true);
            this.axiosCancelSource = axios.CancelToken.source();
            axios.get(`api/album/${this.state.slug}`)
            .then((res)=>{
                this.setState({
                    album: res.data.album,
                    tracks: res.data.tracks,
                },()=>{
                    InitializeData(this.props.setCurrentPlaylist, 
                    this.props.currentPlaylist, 
                    this.props.setCurrentTrack, 
                    this.props.currentTrack, 
                    this.state.tracks, 
                    this.state.tracks[0])
                });
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
        this.axiosCancelSource.cancel('Axios request canceled.');
        this.setState({
            album: null,
            isMount: false,
        })
    }

    likeUnlike(e, direction){
        if(e){
            Like(
                e,
                direction,
                this.props.loading,
                this.props.setLoading,
                this.props.setErrors
            )
        }
    }

    sendDeleteRequest(){
        Delete(this.state.delete_id, 'album', this.props.setLoading, true);
    }

    render(){
        return (
            <div className="mainWrapper">
                <Loading loading={this.props.loading} />
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
                {this.state.album ? 
                <div>
                    <section className="singleTrack" style={{backgroundImage: `url(${window.location.origin + '/img/track-bg.webp'})`}}>
                        <div className="trackInfos">
                            <div className="singTrackImg">
                                <img src={window.location.origin + this.state.album.cover} />
                            </div>
                            <div className="singTrackInf">
                                <h2>{this.state.album.name}</h2>
                                <div><a>{this.state.album.artist}</a></div>
                                <div className="singleTrackPublisher">Publisher: <Link to={'/user/'+this.state.album.publisher.username}>{this.state.album.publisher.name}</Link></div>
                                <p>{this.state.album.description}</p>
                            </div>
                            <div className="singleTrackActions">
                            <button 
                                data-idenity={this.state.album.id}
                                onClick={(e)=>{
                                    this.likeUnlike(e, "savealbum")
                                }}
                            >{this.state.album.isSaved ? <BsFlagFill /> : <BsFlag />}</button>
                            <button 
                                data-idenity={this.state.album.id}
                                onClick={(e)=>{
                                    this.likeUnlike(e, "likealbum")
                                }}
                            >{this.state.album.isLiked ? <BsHeartFill /> : <BsHeart />}</button>
                            {this.props.user && this.props.user.id === this.state.album.user_id ? 
                                <button title="Delete" className="deleteOptionFlat" onClick={()=>{this.setState({confirmation:true, delete_id: this.state.album.id})}}><BsTrash /></button>
                            : ''}
                            </div>
                        </div>
                    </section>
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
                    </div> 
                </div> : ''}
            </div>
        )   
    }
}

export default SingleAlbum
