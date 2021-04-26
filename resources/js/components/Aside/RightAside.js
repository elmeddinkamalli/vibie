import React, { Component } from 'react'
import { BsX, BsPlay, BsPause } from 'react-icons/bs'
import { Link } from 'react-router-dom';
import SetPlaylistToLocal from '../Helper/SetPlaylistToLocal';

class RightAside extends Component {
    constructor(props){
        super(props);
        this.playlistController = this.playlistController.bind(this);
        this.setPlaylistToLocal = this.setPlaylistToLocal.bind(this);
        this.ref = React.createRef();
        this.setSlug = this.setSlug.bind(this);
    }

    componentDidMount(){
        document.addEventListener('mousedown', (event)=>{
            if (!this.ref.current.contains(event.target) &&
                event.target.className != 'currentPlaylistToggle' &&
                event.target.id != 'currentPlaylistToggleSvg' &&
                event.target.id != 'userAvatar') {
                this.props.setPlaylist(false);
            }
        })
    }

    playlistController(){
        this.props.setPlaylist(!this.props.playlist);
        this.props.setUserPopUp(false);
    }

    setPlaylistToLocal(e){
        if(e){
            SetPlaylistToLocal(
                e,
                this.props.currentTrack,
                this.props.setCurrentTrack,
                null,
                null,
                this.props.play,
                this.props.setPlay,
                this.props.currentPlaylist,
                this.props.setTrackPlaylistIndex,
                true
            );
        }
    }

    setSlug(e){
        if(e){
            this.props.setAsideSlug(e.target.dataset.slug);
        }
    }

    render(){
        return (
            <aside ref={this.ref} className={`rightAside ${this.props.playlist ? 'active' : ''}`}>
                <div className="playlistHead">
                    <h2>Playlist</h2>
                    <button onClick={this.playlistController}><BsX /></button>
                </div>
                <div className="currentPlaylists">
                    <ul>
                        {(this.props.currentPlaylist && this.props.currentPlaylist.length > 0) ? this.props.currentPlaylist.map((track, i) => {
                            return (
                                <li className="playlistItem" key={i}>
                                    {this.props.currentTrack != null && track.id == this.props.currentTrack.id && this.props.play ? 
                                    <button className="musicBoxPlayBtn playToggle" data-id={i} data-idenity={track.id} onClick={this.setPlaylistToLocal}>
                                        <BsPause />
                                    </button>
                                    :
                                    <button className="musicBoxPlayBtn playToggle" data-id={i} data-idenity={track.id} onClick={this.setPlaylistToLocal}>
                                        <BsPlay />
                                    </button>
                                    }
                                    <img src={window.location.origin + track.cover} />
                                    <div className="playlistTrackInfo">
                                        <p><Link to={'/track/'+track.slug} data-slug={track.slug} onClick={this.setSlug}>{track.name}</Link></p>
                                        <p>{track.singer}</p>
                                    </div>
                                    <div className="duration">5:03</div>
                                </li>
                            )
                        }) : ''}
                    </ul>
                </div>
            </aside>
        )
    }
}

export default RightAside
