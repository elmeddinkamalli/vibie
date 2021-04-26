import React, { Component } from 'react'
import { BiCheck, BiLeftArrow, BiX } from 'react-icons/bi';
import { BsFlag, BsFlagFill, BsHeart, BsHeartFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Delete from '../Helper/Delete';
import Like from '../Helper/Like';

export default class AlbumBoxSingle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmation: false,
            delete_id: null
        }
        this.likeUnlike = this.likeUnlike.bind(this);
        this.sendDeleteRequest = this.sendDeleteRequest.bind(this);
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
        Delete(this.state.delete_id, 'album', this.props.setLoading);
    }

    render() {
        return (
            <figure className="musicBox albumBox">
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
                {this.props.user && this.props.user.id === this.props.album.user_id ? 
                    <div className="deleteOption"><BiLeftArrow /> <span onClick={()=>{this.setState({confirmation:true, delete_id: this.props.album.id})}}>Delete</span></div>
                : ''}
                <div className="imgWrapper">
                    <img src={window.location.origin + this.props.album.cover} />
                    <div className="musicBoxHoverOverlay">
                        <div className="ovrlBtns">
                        <button 
                            data-idenity={this.props.album.id}
                            onClick={(e)=>{
                                this.likeUnlike(e, "savealbum")
                            }}
                        >{this.props.album.isSaved ? <BsFlagFill /> : <BsFlag />}</button>
                        <button 
                            data-idenity={this.props.album.id}
                            onClick={(e)=>{
                                this.likeUnlike(e, "likealbum")
                            }}
                        >{this.props.album.isLiked ? <BsHeartFill /> : <BsHeart />}</button>
                        </div>
                        <div>
                            <h5><Link to={'/album/'+this.props.album.slug}>{this.props.album.name}</Link></h5>
                            <p>{this.props.album.artist}</p>
                        </div>
                    </div>
                </div>
                <div className="musicBoxBottomInfo">
                    <h5>{this.props.album.name}</h5>
                    <p>{this.props.album.artist}</p>
                </div>
            </figure>
        )
    }
}
