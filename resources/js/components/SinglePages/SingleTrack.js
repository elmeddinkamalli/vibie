import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { BsPlay, BsFlag, BsHeart, BsPause, BsHeartFill, BsFlagFill, BsTrash } from 'react-icons/bs'
import InitializeData from '../Helper/InitializeData'
import SetPlaylistToLocal from '../Helper/SetPlaylistToLocal'
import Like from '../Helper/Like'
import Loading from '../Additions/Loading';
import { BiCheck, BiX } from 'react-icons/bi'
import Delete from '../Helper/Delete'
import Track from '../Additions/Track'

class SingleTrack extends Component {
    constructor(props) {
        super(props);
        this.state = {
            track: null,
            related_tracks: null,
            slug: this.props.slug,
            asideSlug: this.props.asideSlug,
            playerSlug: this.props.playerSlug,
            isMount: true,
            firstLoad: true,
            confirmation: false,
            delete_id: null
        }
        this.show = this.show.bind(this);
        this.setPlaylistToLocal = this.setPlaylistToLocal.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.setSlug = this.setSlug.bind(this);
        this.likeUnlike = this.likeUnlike.bind(this);
        this.sendDeleteRequest = this.sendDeleteRequest.bind(this);
    }

    async componentDidMount(slug=null){
        if(this.state.isMount){
            this.props.setLoading(true);
            this.axiosCancelSource = axios.CancelToken.source();
            const options = {
                url: `api/track/${slug ? slug : this.state.slug}`,
                method: 'GET',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
                },
                withCredentials: true,
                credentials: 'include',
            };
            await axios(options)
            .then((res)=>{
                this.setState({
                    track: res.data.track,
                    related_tracks: res.data.related_tracks
                });
                this.props.setLoading(false);
            })
            .catch((err)=>{
                this.props.setLoading(false);
            })

            if(this.state.firstLoad && this.state.related_tracks){
                this.setState({
                    firstLoad: false,
                });

                InitializeData(this.props.setCurrentPlaylist, 
                    this.props.currentPlaylist, 
                    this.props.setCurrentTrack, 
                    this.props.currentTrack, 
                    this.state.related_tracks, 
                    this.state.related_tracks[0]);
            }
        }
    }

    componentDidUpdate(){
        if(this.props.slug && this.props.slug !== this.state.slug){
            this.setSlug(this.props.slug);
        }
    }

    setSlug(slug){
        this.setState({
            slug: slug,
        }, ()=>{
            this.componentDidMount(slug);
        })
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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
                this.state.related_tracks,
                this.props.setTrackPlaylistIndex
            );
        }
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

    componentWillUnmount(){
        this.setState({
            isMount: false,
            track: null,
            related_tracks: null,
        })
        this.axiosCancelSource.cancel('Axios request canceled.');
    }

    show(){
        console.log(this.state.track);
        console.log(this.state.related_tracks);
    }

    sendDeleteRequest(){
        Delete(this.state.delete_id, 'track', this.props.setLoading, true);
    }

    render(){
        return (
            <div className="mainWrapper" onClick={this.show}>
                <Loading loading={this.props.loading} />
                {this.state.confirmation ? <div className="grayed-bg active">
                    <div className="shareOvrly active deleteConf">
                    <div className="heading">
                        <h5>Would you like to delete this track?</h5>
                    </div>
                    <div>
                        <button className="confirm" onClick={this.sendDeleteRequest} ><BiCheck /> Confirm</button>
                        <button className="cancel" onClick={(e)=>{this.setState({confirmation:false,delete_id: null})}}><BiX /> Cancel</button>
                    </div>
                    </div>
                </div> : ''}
                {this.state.track ? 
                <section className="singleTrack" style={{backgroundImage: `url(${window.location.origin + '/img/track-bg.webp'})`}}>
                    <div className="trackInfos">
                        <div className="singTrackImg">
                            <img src={window.location.origin + this.state.track.cover} />
                        </div>
                        <div className="singTrackInf">
                            <h2>{this.state.track.name}</h2>
                            <div><p>{this.state.track.singer}</p></div>
                            <div>{this.state.track.album ? <span className="singleTrackAlbum">Album: <Link to={'/album/'+this.state.track.album.slug}>{this.state.track.album.name}</Link></span> : ''}</div>
                            <div className="singleTrackPublisher">Publisher: <Link to={'/user/'+this.state.track.publisher.username}>{this.state.track.publisher.name}</Link></div>
                            <p>{this.state.track.description}</p>
                            {this.props.currentTrack != null && this.state.track.id == this.props.currentTrack.id && this.props.play ? 
                            <button 
                                data-id={0}
                                data-idenity={this.state.track.id}
                                data-file={this.state.track.file_name} 
                                className="singleTrackPlayBtn playToggle"
                                onClick={this.setPlaylistToLocal}
                            ><BsPause />Pause</button>
                            :
                            <button 
                                data-id={0}
                                data-idenity={this.state.track.id}
                                data-file={this.state.track.file_name} 
                                className="singleTrackPlayBtn playToggle"
                                onClick={this.setPlaylistToLocal}
                            ><BsPlay />Play</button> }
                        </div>
                        <div className="singleTrackActions">
                            <button 
                                data-idenity={this.state.track.id}
                                onClick={(e)=>{
                                    this.likeUnlike(e, "save")
                                }}
                            >{this.state.track.isSaved ? <BsFlagFill /> : <BsFlag />}</button>
                            <button 
                                data-idenity={this.state.track.id}
                                onClick={(e)=>{
                                    this.likeUnlike(e, "like")
                                }}
                            >{this.state.track.isLiked ? <BsHeartFill /> : <BsHeart />}</button>
                            {this.props.user && this.props.user.id === this.state.track.user_id ? 
                                <button title="Delete" className="deleteOptionFlat" onClick={()=>{this.setState({confirmation:true, delete_id: this.state.track.id})}}><BsTrash /></button>
                            : ''}
                        </div>
                    </div>
                </section> : '' }
                {this.state.related_tracks ? 
                <div className="relatedTracks">
                    <div className="relatedTracksHeading"><h4>Related Tracks</h4></div>
                    <ul>
                        {this.state.related_tracks.map((track, i)=>{
                            if(track.id !== this.state.track.id){
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
                                    tracks={this.state.related_tracks}
                                    setTrackPlaylistIndex={this.props.setTrackPlaylistIndex}
                                    loading={this.props.loading}
                                    setLoading={this.props.setLoading}
                                    user={this.props.user}
                                    setErrors={this.props.setErrors}
                                />)
                            }
                        })}
                    </ul>
                </div> 
                : ''}
            </div>
        )   
    }
}

export default SingleTrack
