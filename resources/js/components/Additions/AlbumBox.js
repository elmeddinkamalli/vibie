import React, { Component } from 'react'
import Carousel from 'react-elastic-carousel'
import {Link} from 'react-router-dom'
import { BsFlag, BsFlagFill, BsHeart, BsHeartFill } from 'react-icons/bs'
import Like from '../Helper/Like';
import { BiCheck, BiLeftArrow, BiX } from 'react-icons/bi';
import Delete from '../Helper/Delete';

class AlbumBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMount: true,
            confirmation: false,
            delete_id: null
        };
        this.breakPointsMusicBox = [
            { width: 1, itemsToShow: 1 },
            { width: 300, itemsToShow: 2, itemPadding: [0, 5], outerSpace: 0},
            { width: 500, itemsToShow: 3, itemPadding: [0, 5], outerSpace: 0},
            { width: 1020, itemsToShow: 5, itemPadding: [0, 5], outerSpace: 0},
        ];
        this.likeUnlike = this.likeUnlike.bind(this);
        this.sendDeleteRequest = this.sendDeleteRequest.bind(this);
    }
    
    componentDidMount(){
        this.albums = this.props.albums;
    }

    componentWillUnmount(){
        this.setState({
            isMount: false
        })
    }

    likeUnlike(e, direction){
        if(this.props.user){
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
    }

    sendDeleteRequest(){
        Delete(this.state.delete_id, 'album', this.props.setLoading);
    }

    render(){
        return (
            <section style={{position:'relative'}}>
                <div className="sectionHeadline">
                    <div>
                        <h4>{this.props.headline}</h4>
                        <p>{this.props.headDesc}</p>
                    </div>
                    <Link to="/albums">View other albums &nbsp; &gt;</Link>
                </div>
                <Carousel itemsToShow={6} pagination={false} breakPoints={this.breakPointsMusicBox} >
                {this.props.albums.map((album, i)=>{
                return (<figure key={i} className="musicBox">
                    {this.state.confirmation ? <div className="grayed-bg active">
                        <div className="shareOvrly active deleteConf">
                        <div className="headingOvrly">
                            <h5>Would you like to delete this album?</h5>
                        </div>
                        <div>
                            <button className="confirm" onClick={this.sendDeleteRequest} ><BiCheck /> Confirm</button>
                            <button className="cancel" onClick={(e)=>{this.setState({confirmation:false,delete_id: null})}}><BiX /> Cancel</button>
                        </div>
                        </div>
                    </div> : ''}
                    {this.props.user && this.props.user.id === album.user_id ? 
                        <div className="deleteOption"><BiLeftArrow /> <span onClick={()=>{this.setState({confirmation:true, delete_id: album.id})}}>Delete</span></div>
                    : ''}
                    <div className="imgWrapper">
                        <img src={window.location.origin + album.cover} />
                        <div className="musicBoxHoverOverlay">
                            <div className="ovrlBtns">
                                <button 
                                    data-idenity={album.id}
                                    onClick={(e)=>{
                                        this.likeUnlike(e, "likealbum")
                                    }}
                                >{album.isLiked ? <BsHeartFill /> : <BsHeart />}</button>
                                <button 
                                    data-idenity={album.id}
                                    onClick={(e)=>{
                                        this.likeUnlike(e, "savealbum")
                                    }}
                                >{album.isSaved ? <BsFlagFill /> : <BsFlag />}</button>
                            </div>
                            <div>
                                <h5><Link to={'/album/'+album.slug}>{album.name}</Link></h5>
                                <p>{album.singer}</p>
                            </div>
                        </div>
                    </div>
                    <div className="musicBoxBottomInfo">
                        <h5>{album.name}</h5>
                        <p>{album.singer}</p>
                    </div>
                </figure>)
                })}
                </Carousel>
            </section>
        )
    }
}

export default AlbumBox
