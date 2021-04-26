import React, { Component } from 'react'
import { BiCheck, BiLeftArrow, BiX } from 'react-icons/bi';
import { BsFlag, BsFlagFill, BsHeart, BsHeartFill, BsPause, BsPlay } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Delete from '../Helper/Delete';
import Like from '../Helper/Like';
import SetPlaylistToLocal from '../Helper/SetPlaylistToLocal';

export default class TrackBoxSingle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmation: false,
            delete_id: null
        }
        this.likeUnlike = this.likeUnlike.bind(this);
        this.sendDeleteRequest = this.sendDeleteRequest.bind(this);
        this.setPlaylistToLocal = this.setPlaylistToLocal.bind(this);
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
                this.props.data,
                this.props.setTrackPlaylistIndex
            );
        }
    }

    sendDeleteRequest(){
        Delete(this.state.delete_id, 'track', this.props.setLoading);
    }

    render() {
        return (
            <figure className="musicBox">
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
                {this.props.user && this.props.user.id === this.props.track.user_id ? 
                    <div className="deleteOption"><BiLeftArrow /> <span onClick={()=>{this.setState({confirmation:true, delete_id: this.props.track.id})}}>Delete</span></div>
                : ''}
                <div className="imgWrapper">
                    <img src={window.location.origin+this.props.track.cover} />
                    <div className="musicBoxHoverOverlay">
                        <div className="ovrlBtns">
                            <button 
                                data-idenity={this.props.track.id}
                                onClick={(e)=>{
                                    this.likeUnlike(e, "like")
                                }}
                            >{this.props.track.isLiked ? <BsHeartFill /> : <BsHeart />}</button>
                            {this.props.currentTrack != null && this.props.track.id == this.props.currentTrack.id && this.props.play ? 
                            <button 
                                data-id={this.props.i}
                                data-idenity={this.props.track.id}
                                data-file={this.props.track.file_name} 
                                className="musicBoxPauseBtn playToggle"
                                onClick={this.setPlaylistToLocal}
                            ><BsPause /></button>
                            :
                            <button 
                                data-id={this.props.i}
                                data-idenity={this.props.track.id}
                                data-file={this.props.track.file_name} 
                                data-playlist={this.props.playlist} 
                                className="musicBoxPlayBtn playToggle"
                                onClick={this.setPlaylistToLocal}
                            ><BsPlay /></button>
                            }
                            <button 
                                data-idenity={this.props.track.id}
                                onClick={(e)=>{
                                    this.likeUnlike(e, "save")
                                }}
                            >{this.props.track.isSaved ? <BsFlagFill /> : <BsFlag />}</button>
                        </div>
                        <div>
                            <h5><Link to={'/track/'+this.props.track.slug}>{this.props.track.name}</Link></h5>
                            <p>{this.props.track.singer}</p>
                        </div>
                    </div>
                </div>
                <div className="musicBoxBottomInfo">
                    <h5>{this.props.track.name}</h5>
                    <p>{this.props.track.singer}</p>
                </div>
            </figure>
        )
    }
}
