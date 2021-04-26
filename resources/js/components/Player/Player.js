import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { BsPlay, BsSkipStart, BsSkipEnd, BsPause, BsViewList, BsSearch, BsHeart, BsPeopleCircle, BsFlag, BsBoxArrowInRight, BsListCheck } from 'react-icons/bs'
import WaveSurfer from 'wavesurfer.js';
import axios from 'axios';

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            volume: 0.5,
            currentTrack: [],
            currentPlaylist: [],
        }
        this.playOrNot = this.playOrNot.bind(this);
        this.menuController = this.menuController.bind(this);
        this.playlistController = this.playlistController.bind(this);
        this.volumeController = this.volumeController.bind(this);
        this.nextTrack = this.nextTrack.bind(this);
        this.prevTrack = this.prevTrack.bind(this);
        this.userPopUpController = this.userPopUpController.bind(this);
        this.searchController = this.searchController.bind(this);
        this.findIndex = this.findIndex.bind(this);
        this.setCurrentTrack2 = this.setCurrentTrack2.bind(this);
        this.setUserSlug = this.setUserSlug.bind(this);
        this.setTrackSlug = this.setTrackSlug.bind(this);
        this.logout = this.logout.bind(this);
    }

    async componentDidMount() {
        window.wavesurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: '#243049',
            progressColor: '#FF1744',
            barWidth: 3,
            barGap: 1,
            height: 50,
        });

        window.wavesurfer.setVolume(this.state.volume);

        window.wavesurfer.on('finish', (e) => {
            this.nextTrack(e);
        })
    }

    playOrNot() {
        if(window.wavesurfer.isPlaying()){
            window.wavesurfer.pause();
            this.props.setPlay(false);
        }else{
            window.wavesurfer.play();
            this.props.setPlay(true);
        }
    }

    volumeController (e) {
        e.persist();
        this.setState(volume => ({
            volume: e.target.value,
        }));
        window.wavesurfer.setVolume(this.state.volume);
    }

    async findIndex(){
        if(this.props.trackPlaylistIndex){
            return this.props.trackPlaylistIndex;
        }else{
            for (let i = 0; i < this.props.currentPlaylist.length; i++) {
                if (this.props.currentTrack.id === this.props.currentPlaylist[i].id) {
                    await this.props.setTrackPlaylistIndex([0,i,this.props.currentPlaylist.length-1]);
                    return this.props.trackPlaylistIndex;
                }
            }
        }
    }

    async nextTrack(e){
        var index = await this.findIndex();
        if(index[1] != index[2])
        {
            index[1] = index[1]+1;
        }
        window.wavesurfer.stop();
        window.wavesurfer.empty();
        window.wavesurfer.load(this.props.currentPlaylist[parseInt(index[1])].file_name);
        window.wavesurfer.on('ready', (e) => {
            window.wavesurfer.play();
            this.props.setPlay(true);
        });
        this.props.setTrackPlaylistIndex(index);
        this.setCurrentTrack2(index[1])
    }
    async prevTrack(e){
        var index = await this.findIndex();
        if(index[0] != index[1])
        {
            index[1] = index[1]-1;
        }
        window.wavesurfer.stop();
        window.wavesurfer.empty();
        window.wavesurfer.load(this.props.currentPlaylist[index[1]].file_name);
        window.wavesurfer.on('ready', (e) => {
            window.wavesurfer.play();
            this.props.setPlay(true);
        });
        this.props.setTrackPlaylistIndex(index);
        this.setCurrentTrack2(index[1])
    }

    setCurrentTrack(e){
        localStorage.setItem('currentTrack', JSON.stringify(this.props.currentPlaylist[e.target.closest('.playToggle').dataset.id]));
        this.props.setCurrentTrack(this.props.currentPlaylist[e.target.closest('.playToggle').dataset.id]);
    }
    setCurrentTrack2(index){
        localStorage.setItem('currentTrack', JSON.stringify(this.props.currentPlaylist[index]));
        this.props.setCurrentTrack(this.props.currentPlaylist[index]);
    }

    menuController(){
        this.props.setMenu(!this.props.menu);
        localStorage.removeItem('currentPlaylist');
        localStorage.removeItem('currentTrack');
    }
    playlistController(){
        this.props.setPlaylist(!this.props.playlist);
        this.props.setUserPopUp(false);
    }
    userPopUpController(){
        this.props.setUserPopUp(!this.props.userPopUp);
    }
    searchController(){
        this.props.setSearch(true);
        this.props.setUserPopUp(false);
    }

    setUserSlug(e){
            if(e){
                var element = e.target.tagName.toLowerCase();
                if(element === "a"){
                    var slug = e.target.dataset.userslug;
                }else if(element === "svg"){
                    var slug = e.target.parentNode.dataset.userslug;
                }else if(element === "path"){
                    var slug = e.target.parentNode.parentNode.dataset.userslug;
                }
            this.props.setUserSlug(slug);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    setTrackSlug(e){
        if(e){
            this.props.setPlayerSlug(e.target.closest('.currentTrack').dataset.trackslug);
        }
    }

    logout(){
        const options = {
            url: '/api/logout',
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
            },
            withCredentials: true,
            credentials: 'include',
        };
        axios(options)
        .then(res => {
            this.props.setUser(null);
            window.location.reload();
        })
    }

    render(){
        return (
            <section className="player">
                <div className="bars" onClick={this.menuController}>
                    <i></i>
                </div>
                <Link to="/" className="brandName">
                    <h4>vibie</h4>
                </Link>
                <div className={this.props.currentTrack ? "player-control ready" : "player-control"}>
                    <div className="controls">
                        <button data-next={this.state.prevTrack} onClick={this.prevTrack}>
                            <BsSkipStart />
                        </button>
                        <button id="playButton" onClick={this.playOrNot}>
                            {this.props.play ? <BsPause /> : <BsPlay />}
                        </button>
                        <button data-next={this.state.nextTrack} onClick={this.nextTrack}>
                            <BsSkipEnd />
                        </button>
                    </div>
                    <div>
                        <div id="waveform"></div>
                    </div>
                    <div className="volbox">
                        <input id="volume" type="range" min="0" max="1" defaultValue={this.state.volume} step="0.05" onChange={this.volumeController} />
                    </div>
                    {this.props.currentTrack ? 
                    <div className="currentTrack" data-trackslug={this.props.currentTrack.slug}>
                        <Link to={'/track/'+this.props.currentTrack.slug} onClick={this.setTrackSlug}><img src={window.location.origin + this.props.currentTrack.cover} title={this.props.currentTrack.singer+" - "+this.props.currentTrack.name} /></Link>
                    </div> : ''}
                </div>
                <button className="currentPlaylistToggle" onClick={this.playlistController}>
                    <BsViewList id="currentPlaylistToggleSvg" />
                </button>
                <button className="searchToggle" onClick={this.searchController}>
                    <BsSearch />
                </button>
                <figure className="playerUserSection">
                <img id="userAvatar" src={this.props.user && this.props.user.avatar ? window.location.origin + this.props.user.avatar : window.location.origin + '/img/users/default_avatar.jpg'} onClick={this.userPopUpController} />
                    {this.props.user ?
                    <div className={`userSectionPopUp ${this.props.userPopUp ? 'active' : ''}`}>
                        <Link to="/saves">
                            <BsFlag />
                            <br />
                            Saved
                        </Link>
                        <Link to="/likes">
                            <BsHeart />
                            <br />
                            Liked
                        </Link>
                        <Link to={this.props.user ? "/user/"+this.props.user.username : ''} onClick={this.setUserSlug} data-userslug={this.props.user ? this.props.user.username : ''}>
                            <BsPeopleCircle />
                            <br />
                            Profile
                        </Link>
                        <a onClick={this.logout}>
                            <BsBoxArrowInRight />
                            <br />
                            Logout
                        </a>
                    </div> :
                    <div className={`userSectionPopUp ${this.props.userPopUp ? 'active' : ''}`}>
                        <a href="/register">
                            <BsListCheck />
                            <br />
                            Register
                        </a>
                        <a href="/login">
                            <BsBoxArrowInRight />
                            <br />
                            Login
                        </a>
                    </div>}
                </figure>
            </section>
        )
    }
}

export default Player
