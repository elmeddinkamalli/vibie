import { uniqueId } from 'lodash';
import React, { Component, createRef } from 'react'
import { BsFlag, BsFlagFill, BsHeart, BsHeartFill, BsPause, BsPlay, BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom';
import FindElement from '../Helper/FindElement';
import Like from '../Helper/Like';
import SetPlaylistToLocal from '../Helper/SetPlaylistToLocal';

export default class MusicList extends Component {
    constructor(props){
        super(props)
        this.state = {
            elRefs: [],
            current_genre: 0,
            arrLength: 0,
        }
        this.toggleActions = this.toggleActions.bind(this);
        this.findActions = this.findActions.bind(this);
        this.setActions = this.setActions.bind(this);
        this.setPlaylistToLocal = this.setPlaylistToLocal.bind(this);
        this.changeGenre = this.changeGenre.bind(this);
        this.likeUnlike = this.likeUnlike.bind(this);
    }

    componentDidMount(){
        this.genres = this.props.genres;
        this.playlist = this.props.genres[this.state.current_genre].tracks;
        document.addEventListener('click', this.setActions);

        this.setState({
            arrLength: this.props.genres[this.state.current_genre].tracks.length,
        }, ()=>{
            this.setState({
                elRefs: Array(this.state.arrLength).fill().map((_, i) => this.state.elRefs[i] || createRef()),
            })
        });
    }

    changeGenre(event){
        var genre_id = event.target.dataset.genreId;
        this.setState({
            current_genre: genre_id,
        });
        this.setState({
            arrLength: this.props.genres[genre_id].tracks.length,
        }, ()=>{
            this.setState({
                elRefs: Array(this.state.arrLength).fill().map((_, i) => this.state.elRefs[i] || createRef()),
            })
        });
    }

    setActions(event){
        this.state.elRefs.map((ref, index)=>{
            if (ref.current && !ref.current.contains(event.target)){
                Array.prototype.map.call(document.querySelectorAll('.actions'),(element, i)=>{
                    if(i == index){
                        document.querySelectorAll('.actions')[i].classList.remove('active');
                    }
                })
            }else{
                this.findActions(event);
            }
        })
    }

    findActions(e){
        var element = e.target.tagName.toLowerCase();
        if(element === "div" && e.target.classList.contains('dots')){
            var actions = e.target.parentNode.querySelector('.actions');
            this.toggleActions(actions);
        }else if(element === "svg" && e.target.classList.contains('dots-svg')){
            var actions = e.target.parentNode.parentNode.querySelector('.actions');
            this.toggleActions(actions);
        }else if(element === "path" && e.target.parentNode.classList.contains('dots-svg')){
            var actions = e.target.parentNode.parentNode.parentNode.querySelector('.actions');
            this.toggleActions(actions);
        }
    }

    toggleActions(element){
        if(element.classList.contains('active')){
            element.classList.remove('active');
        }else{
            element.classList.add('active');
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
                this.genres[this.state.current_genre].tracks,
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

    render() {
        return (
            <div className="weeksPopular">
                <div className="h-100">
                    <div className="weeksPopularHeadline">
                        <h4>Most Popular This Week</h4>
                    </div>
                    <div className="quickGenres">
                        {this.props.genres.map((genre, i) => {
                            return (
                                <span key={i} onClick={this.changeGenre} data-genre-id={i} className={i == this.state.current_genre ? 'active' : ''}>{genre['name']}</span>
                            )
                        })}
                    </div>
                    <div className="h-100">
                        <ul>
                            {this.props.genres[this.state.current_genre].tracks.map((track,i)=>{
                            return (<li key={i+"-"+this.state.current_genre} className="playlistItem">
                                {this.props.currentTrack != null && track.id == this.props.currentTrack.id && this.props.play ? 
                                <button 
                                    data-id={i}
                                    data-idenity={track.id}
                                    data-file={track.file_name} 
                                    className="musicBoxPauseBtn playToggle"
                                    onClick={this.setPlaylistToLocal}
                                ><BsPause /></button>
                                :
                                <button 
                                    data-id={i}
                                    data-idenity={track.id}
                                    data-file={track.file_name} 
                                    data-playlist={this.props.playlist} 
                                    className="musicBoxPlayBtn playToggle"
                                    onClick={this.setPlaylistToLocal}
                                ><BsPlay /></button>
                                }
                                <img src={window.location.origin+track.cover} />
                                <div className="playlistTrackInfo">
                                    <p><Link to={'/track/'+track.slug}>{track.name}</Link></p>
                                    <p>{track.singer}</p>
                                </div>
                                <div className="duration bg-none">5:03</div>
                                <div className="trackActions" ref={this.state.elRefs[i]}>
                                    <div className="dots"><BsThreeDots className="dots-svg" /></div>
                                    <div className="actions">
                                        <div>
                                            <button 
                                                data-idenity={track.id}
                                                onClick={(e)=>{
                                                    this.likeUnlike(e, "like")
                                                }}
                                            >{track.isLiked ? <BsHeartFill /> : <BsHeart />}</button>
                                            <span>Like</span>
                                        </div>
                                        <div>
                                            <button 
                                                data-idenity={track.id}
                                                onClick={(e)=>{
                                                    this.likeUnlike(e, "save")
                                                }}
                                            >{track.isSaved ? <BsFlagFill /> : <BsFlag />}</button>
                                            <span>Save</span>
                                        </div>
                                    </div>
                                </div>
                            </li>)
                            })} 
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
