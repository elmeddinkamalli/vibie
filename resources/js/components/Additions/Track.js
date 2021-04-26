import React, { Component } from 'react'
import { BiCheck, BiLeftArrow, BiX } from 'react-icons/bi';
import { BsFlag, BsFlagFill, BsHeart, BsHeartFill, BsPause, BsPlay, BsTrash } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import Delete from '../Helper/Delete';
import Like from '../Helper/Like';
import SetPlaylistToLocal from '../Helper/SetPlaylistToLocal';

export default class Track extends Component {
    constructor(props){
        super(props);
        this.state = {
            confirmation: false,
            delete_id: null
        }
        this.setPlaylistToLocal = this.setPlaylistToLocal.bind(this);
        this.likeUnlike = this.likeUnlike.bind(this);
        this.sendDeleteRequest = this.sendDeleteRequest.bind(this);
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
                this.props.tracks,
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

    sendDeleteRequest(){
        Delete(this.state.delete_id, 'track', this.props.setLoading);
    }

    render() {
        return (
            <li className="relatedTrack">
                {this.state.confirmation ? <div className="grayed-bg active">
                    <div className="shareOvrly active deleteConf">
                    <div className="headingOvrly">
                        <h5>Would you like to delete this track?</h5>
                    </div>
                    <div>
                        <button className="confirm" onClick={this.sendDeleteRequest} ><BiCheck /> Confirm</button>
                        <button className="cancel" onClick={(e)=>{this.setState({confirmation:false,delete_id: null})}}><BiX /> Cancel</button>
                    </div>
                    </div>
                </div> : ''}
                {this.props.currentTrack != null && this.props.track.id == this.props.currentTrack.id && this.props.play ? 
                <button 
                    data-id={this.props.i}
                    data-idenity={this.props.track.id}
                    data-file={this.props.track.file_name} 
                    className="relatedTrackPlayBtn playToggle"
                    onClick={this.setPlaylistToLocal}
                ><BsPause /></button>
                :
                <button 
                    data-id={this.props.i}
                    data-idenity={this.props.track.id}
                    data-file={this.props.track.file_name} 
                    className="relatedTrackPlayBtn playToggle"
                    onClick={this.setPlaylistToLocal}
                ><BsPlay /></button> }
                <h5><a>{this.props.track.singer}</a> - <Link to={"/track/"+this.props.track.slug} data-slug={this.props.track.slug}>{this.props.track.name}</Link></h5>
                <div className="relatedTracksActions">
                    <span>5:00</span>
                    <button 
                        data-idenity={this.props.track.id}
                        onClick={(e)=>{
                            this.likeUnlike(e, "save")
                        }}
                    >{this.props.track.isSaved ? <BsFlagFill /> : <BsFlag />}</button>
                    <button 
                        data-idenity={this.props.track.id}
                        onClick={(e)=>{
                            this.likeUnlike(e, "like")
                        }}
                    >{this.props.track.isLiked ? <BsHeartFill /> : <BsHeart />}</button>
                    {this.props.user && this.props.user.id === this.props.track.user_id ? 
                        <button title="Delete" className="deleteOptionFlat" onClick={()=>{this.setState({confirmation:true, delete_id: this.props.track.id})}}><BsTrash /></button>
                    : ''}
                </div>
            </li>
        )
    }
}
