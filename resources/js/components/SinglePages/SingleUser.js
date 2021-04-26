import React, { Component } from 'react'
import axios, {post} from 'axios'
import { Link } from 'react-router-dom'
import { BsPersonPlusFill, BsPersonCheck } from 'react-icons/bs'
import {BiUpload, BiFile, BiX, BiPlay, BiPause, BiImage, BiRefresh, BiMusic, BiShare} from 'react-icons/bi'
import InitializeData from '../Helper/InitializeData';
import BlogPost from '../Additions/BlogPost';
import Loading from '../Additions/Loading';
import Follows from '../Additions/Follows'
import AlbumBoxSingle from '../Additions/AlbumBoxSingle'
import Track from '../Additions/Track'

class SingleUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artist: null,
            tracks: null,
            albums: null,
            last_followers: null,
            genres: null,
            isMount: true,
            userSlug: this.props.username,
            prevSlug: this.props.userSlug,
            shareOverlay: null,
            shareCover: null,
            shareTrack: null,
            playing: false,
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.setShareOverlay = this.setShareOverlay.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.showPreview = this.showPreview.bind(this);
        this.setReader = this.setReader.bind(this);
        this.playSong = this.playSong.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
        this.setProgress = this.setProgress.bind(this);
        this.endSong = this.endSong.bind(this);
        this.followUnfollow = this.followUnfollow.bind(this);
        this.setUserSlug = this.setUserSlug.bind(this);
    }

    componentDidMount(){
        if(this.state.isMount){
            this.props.setLoading(true);
            this.axiosCancelSource = axios.CancelToken.source();
            axios.get(`api/user/${this.state.userSlug}`)
            .then((res)=>{
                this.setState({
                    artist: res.data.artist,
                    last_followers: res.data.last_followers,
                    tracks: res.data.tracks,
                    albums: res.data.albums,
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
            axios.get(`api/genres`)
            .then((res)=>{
                this.setState({
                    genres: res.data
                })
            })

            window.addEventListener('scroll', this.loadMore);

            if(this.props.user && this.state.artist && this.props.user.id === this.state.artist.id){
                document.getElementById('uploadedAudio').addEventListener('timeupdate', this.updateProgress);
                document.getElementById('uploadedAudio').addEventListener('ended', this.endSong);
                document.getElementById('progress-container').addEventListener('click', this.setProgress);
            }
        }
    }

    async componentDidUpdate(){
        if(this.props.userSlug && this.props.userSlug != this.state.userSlug && this.props.userSlug != this.state.prevSlug && this.state.isMount){
            var i = 0;
            await this.setState({
                userSlug: this.props.userSlug,
            })
            this.componentDidMount();
        }
    }

    componentWillUnmount(){
        this.axiosCancelSource.cancel('Axios request canceled.');
        this.setState({
            isMount: false,
        })
        this.props.setUserSlug(null);
    }

    setShareOverlay(value){
        this.setState({
            shareOverlay: value,
            shareCover: null
        })
    }

    submitForm(e, direction){
        e.preventDefault();
        if(!this.state.loading){
            this.props.setLoading(true);
            this.props.setErrors(null);
            var url = 'api/'+direction+'/create';
            var formData = new FormData();
            if(direction === "track"){
                let cover = document.getElementById('createTrackCover').files[0];
                if(cover){
                    formData.append('cover', document.getElementById('createTrackCover').files[0]);
                }
                formData.append('file_name', document.getElementById('createTrackTrack').files[0]);
                formData.append('name', document.getElementById('createTrackName').value);
                formData.append('singer', document.getElementById('createTrackSinger').value);
                formData.append('genre_id', document.getElementById('createTrackGenre').value);
                formData.append('description', document.getElementById('createTrackDesc').value);
            }else if(direction === "blog"){
                let cover = document.getElementById('createBlogCover').files[0];
                if(cover){
                    formData.append('cover', document.getElementById('createBlogCover').files[0]);
                }
                formData.append('title', document.getElementById('createBlogName').value);
                formData.append('description', document.getElementById('createBlogDesc').value);
            }else if(direction === "album"){
                let cover = document.getElementById('createAlbumCover').files[0];
                if(cover){
                    formData.append('cover', document.getElementById('createAlbumCover').files[0]);
                }
                formData.append('artist', document.getElementById('createAlbumArtistName').value);
                formData.append('name', document.getElementById('createAlbumName').value);
                formData.append('description', document.getElementById('createAlbumDesc').value);
                const track_ids = Array.from(document.querySelectorAll("input.cBfAtI[type=checkbox][name=track]:checked")).map(e => parseInt(e.value));
                if(track_ids.length){
                    formData.append('track_ids', track_ids);
                }
            }
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            post(url, formData,config)
            .then(res=>{
                window.location.reload();
            })
            .catch(err=>{
                if(err.response.status === 422){
                    let errors = Object.keys(err.response.data.errors).map((key)=>{
                        if(err.response.data.errors[key].length){
                            return err.response.data.errors[key].map((error)=>{
                                return error;
                            });
                        }else{
                            return err.response.data.errors[key];
                        }
                    }).flat();
                    this.props.setErrors(errors);
                }
                this.props.setLoading(false);
            })
        }
    }

    async showPreview(e, direction, _this=this){
        e.persist();
        await this.props.setErrors(null);
        const file = e.target.files[0];
        if(file){
            const fileType = e.target.files[0].type;
            if(direction === "track"){
                if(fileType === 'audio/mpeg' || fileType === 'audio/mpga' || fileType === 'audio/mp3' || fileType === 'audio/wav'){
                    this.setReader(file, direction);
                }else{
                    this.setState({
                        shareTrack: null,
                    });
                    this.props.setErrors(["The audio file must be a file of type mpeg, mpga, mp3, wav."]);
                    e.target.value = null;
                }
            }else if(direction === "cover"){
                if(fileType === 'image/png' || fileType === 'image/jpg' || fileType === 'image/jpeg'){
                    this.setReader(file, direction);
                }else{
                    this.setState({
                        shareCover: null,
                    });
                    this.props.setErrors(["The cover must be a file of type jpg, jpeg, png."]);
                    e.target.value = null;
                }
            }
        }else{
            e.target.value = null;
            if(direction === "cover"){
                this.setState({
                    shareCover: null
                });
            }else if(direction === "track"){
                this.setState({
                    shareTrack: null,
                    playing: false
                });
                document.getElementById('uploadedAudio').setAttribute('src', '');
                document.getElementById('progresss').style.width = 0;
            }
        }
    }

    setReader(file, direction, _this=this){
        let reader = new FileReader();
        reader.addEventListener("load", function(){
            if(direction === "cover"){
                _this.setState({
                    shareCover: this.result
                })
            }else if(direction === "track"){
                _this.setState({
                    shareTrack: this.result,
                    playing: false
                })
                document.getElementById('progresss').style.width = 0;
            }
        });
        reader.readAsDataURL(file);
    }

    playSong(e) {
        e.preventDefault();
        if(this.state.playing){
            document.getElementById('uploadedAudio').pause();
            this.setState({
                playing: false
            })
        }else{
            window.wavesurfer.stop();
            this.props.setPlay(false);
            document.getElementById('uploadedAudio').play();
            this.setState({
                playing: true
            })
        }
    }

    updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        document.getElementById('progresss').style.width = `${progressPercent}%`;
    }

    setProgress(e) {
        const width = document.getElementById('progress-container').clientWidth;
        const clickX = e.offsetX;
        const duration = document.getElementById('uploadedAudio').duration;      
        document.getElementById('uploadedAudio').currentTime = (clickX / width) * duration;
    }

    endSong(){
        document.getElementById('uploadedAudio').currentTime = 0;
        document.getElementById('progresss').style.width = '0%';
        this.setState({
            playing: false
        })
    }

    followUnfollow(user_id){
        this.props.setErrors(null);
        if(!this.props.loading){
            this.props.setLoading(true);
            const options = {
                url: 'api/followunfollow',
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
                },
                withCredentials: true,
                credentials: 'include',
                data: {
                    user_id:user_id
                }
            };
            axios(options)
            .then((res)=>{
                this.props.setLoading(false);
                if(res.data === "followed"){
                    document.getElementById('follUnf').innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M11 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM1.022 13h9.956a.274.274 0 00.014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 00.022.004zm9.974.056v-.002.002zM6 7a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0zm6.854.146a.5.5 0 010 .708l-3 3a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 01.708-.708L12.5 7.793l2.646-2.647a.5.5 0 01.708 0z" clip-rule="evenodd"></path></svg>Unfollow`;
                    document.getElementById('follUnf').classList.remove('unfollowed');
                    document.getElementById('follUnf').classList.add('followed');
                    let currCount = document.querySelector('.followers_count').innerHTML;
                    document.querySelector('.followers_count').textContent=parseInt(currCount)+1;
                }else if(res.data === "unfollowed"){
                    document.getElementById('follUnf').innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 100-6 3 3 0 000 6zm7.5-3a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 010-1H13V5.5a.5.5 0 01.5-.5z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M13 7.5a.5.5 0 01.5-.5h2a.5.5 0 010 1H14v1.5a.5.5 0 01-1 0v-2z" clip-rule="evenodd"></path></svg>Follow`;
                    document.getElementById('follUnf').classList.remove('followed');
                    document.getElementById('follUnf').classList.add('unfollowed');
                    let currCount = document.querySelector('.followers_count').innerHTML;
                    document.querySelector('.followers_count').textContent=parseInt(currCount)-1;
                }
            })
            .catch((err)=>{
                if(err.response.status === 401 && err.response.statusText === "Unauthorized"){
                    this.props.setErrors(["You need to login first"]);
                }else{
                    this.props.setErrors(["Something went wrong. Refresh the page and try again."]);
                }
                this.props.setLoading(false);
            })
        }
    }

    setUserSlug(e){
        if(e){
            var element = e.target.tagName.toLowerCase();
            if(element === "a"){
                var slug = e.target.dataset.userslug;
            }else if(element === "img"){
                var slug = e.target.parentNode.dataset.userslug;
            }
            this.props.setUserSlug(slug);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    render(){
        return(<div className="mainWrapper">
            <Loading loading={this.props.loading} />
            <section className="userSection">
            {this.state.artist ? <>
                <div className="userSectionTopWrapper exactUser">
                    <div className="userSectionFirstInf">
                        <img src={this.state.artist.avatar ? window.location.origin + this.state.artist.avatar : window.location.origin + '/img/users/default_avatar.jpg'} />
                        <h4>{this.state.artist.name}</h4>
                        <h5>{this.state.artist.username}</h5>
                        <p>Musician</p>
                        {this.props.user && this.props.user.id === this.state.artist.id ?
                        <div className="userButtons">
                            <button onClick={(e)=>{this.setShareOverlay("track")}}><BiUpload />Share track</button>
                            <button onClick={(e)=>{this.setShareOverlay("blog")}}><BiFile />Write blog post</button>
                            {this.state.tracks.length ? <button onClick={(e)=>{this.setShareOverlay("album")}}><BiFile />Create Album</button> : ''}
                            <Link to="/settings"><BiFile />Settings</Link>
                        </div> : <button id="follUnf" className={this.state.artist.follow ? "followed" : "unfollowed"} onClick={()=>{this.followUnfollow(this.state.artist.id)}}>{this.state.artist.follow ? <><BsPersonCheck />Unfollow</> : <><BsPersonPlusFill />Follow</>}</button>}
                    </div>
                    <div className="userSectionSecInfTable">
                        <table>
                            <tbody>
                                <tr>
                                    <th><h5>Official informations</h5></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="infoBlock">
                                            <h4>Email</h4>
                                            <p>{this.state.artist.email}</p>
                                        </div>
                                    </td>
                                    <td>
                                    {this.state.artist.phone_number ?
                                        <div className="infoBlock">
                                            <h4>Phone Number</h4>
                                            <p>{this.state.artist.phone_number}</p>
                                        </div> : ''}
                                    </td>
                                    <td>
                                    {this.state.artist.adress ?
                                        <div className="infoBlock">
                                            <h4>Adress</h4>
                                            <p>{this.state.artist.adress}</p>
                                        </div> : ''}
                                    </td>
                                </tr>
                                <tr>
                                    <th><h5>Account informations</h5></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="infoBlock">
                                            <h4>Following</h4>
                                            <p onClick={()=>{this.setShareOverlay('Followings')}}>{this.state.artist.followings_count}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="infoBlock">
                                            <h4>Follower</h4>
                                            <p onClick={()=>{this.setShareOverlay('Followers')}} className="followers_count">{this.state.artist.followers_count}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="infoBlock">
                                            <h4>Tracks</h4>
                                            <p>{this.state.artist.tracks_count}</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {this.state.last_followers.length ? 
                        <div className="lastFollowers">
                            <h4>New Followers</h4>
                            <div className="followers">
                                {this.state.last_followers.map((follower, i)=>{
                                    return(
                                        <span key={i}>
                                            <Link to={'/user/'+follower.username} title={follower.username} onClick={this.setUserSlug} data-userslug={follower.username}>
                                                <img src={follower.avatar ? window.location.origin + follower.avatar : window.location.origin + '/img/users/default_avatar.jpg'} />
                                            </Link>
                                        </span>
                                    )
                                })}
                            </div>
                        </div>: ''}
                    </div>
                </div>

                
                <div className={this.state.artist.blogs.length ? 'withBlogs relatedTracks' : 'relatedTracks'}>
                    <div className="seperator">
                    {this.state.tracks.length > 0 ? <>
                    <div className="relatedTracksHeading"><h4>Published Tracks</h4></div>
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
                        </ul> </> : ''}

                        {this.state.albums && this.state.albums.length ? <div style={{marginTop:'40px'}}>
                            <div><h4>Published Albums</h4></div>
                            <div className="albumsGrid">
                                {this.state.albums.map((album, i) => {
                                    return (<AlbumBoxSingle key={i} album={album} user={this.props.user} setLoading={this.props.setLoading} setErrors={this.props.setErrors} />)
                                })}
                            </div>
                        </div> : ''}
                    </div>
                    {this.state.artist.blogs.length ? <div className="userBlogs"><div className="relatedTracksHeading"><h4>Published Blogs</h4></div><BlogPost blogs={this.state.artist.blogs} setLoading={this.props.setLoading} user={this.props.user} /></div> : ''}
                </div>
            </> : ''}
        </section>
        {this.props.user && this.state.artist && this.props.user.id === this.state.artist.id ?
        <div className={this.state.shareOverlay && this.state.shareOverlay !== "Followings" && this.state.shareOverlay !== "Followers" ? "grayed-bg active" : "grayed-bg"}>
            <div className={this.state.shareOverlay === "track" ? "shareOvrly active" : "shareOvrly"}>
                <div className="heading">
                    <h5>Share</h5>
                    <BiX onClick={
                        (e)=>{
                            this.setShareOverlay(null);
                            document.getElementById('uploadedAudio').pause();
                            this.setState({
                                playing:false
                            })
                        }
                    } />
                </div>
                <div>
                    <form onSubmit={(e) => {this.submitForm(e, "track")}}>
                        {this.state.shareCover ? 
                        <div className="targetPreview">
                            <img src={this.state.shareCover} />
                            <span onClick={()=>{document.getElementById('createTrackCover').click()}}><BiRefresh />CHANGE</span>
                        </div> : '' }
                        {this.state.shareCover ? '' :
                        <div className="previewBox" onClick={()=>{document.getElementById('createTrackCover').click()}}>
                            <BiImage />
                            SELECT COVER IMAGE
                        </div> }
                        {this.state.shareTrack ? '' :
                        <div className="selectMusic" onClick={()=>{document.getElementById('createTrackTrack').click()}}>
                            <BiMusic />
                            SELECT AUDIO FILE
                        </div> }
                        <input style={{display:'none'}} id="createTrackCover" accept="image/*" type="file" name="cover" onChange={(e) => {this.showPreview(e, "cover")}} />
                        <input style={{display:'none'}} id="createTrackTrack" accept="audio/*" type="file" name="file_name"onChange={(e) => {this.showPreview(e, "track")}}  /> 
                        <div className={this.state.shareTrack ? "uploadedTrackPrev active" : "uploadedTrackPrev"}>
                            <div>
                                <button onClick={this.playSong}>
                                    {this.state.playing ? <BiPause /> : <BiPlay />}
                                </button>
                                <div className="progress-container" id="progress-container">
                                    <div className="progresss" id="progresss"></div>
                                </div>
                            </div>
                            <span className="changeAudio" onClick={()=>{document.getElementById('createTrackTrack').click()}}><BiRefresh />CHANGE</span>
                        </div>
                        <audio id="uploadedAudio" src={this.state.shareTrack}></audio>
                        <div className="inputs">
                            <input id="createTrackName" type="text" name="name" placeholder="Name of the track" />
                            <input id="createTrackSinger" type="text" name="singer" placeholder="Performer / Singer" />
                            {this.state.genres ?
                            <select id="createTrackGenre" name="genre_id">
                                <option value="" defaultValue>Genre</option>
                                {this.state.genres.map((genre,i)=>{
                                    return(
                                        <option key={i} value={genre.id}>{genre.name}</option>
                                    )
                                })}
                            </select> : ''}
                            <textarea id="createTrackDesc" name="description" placeholder="Description"></textarea>
                            <button type="submit" ><BiShare /> SHARE</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className={this.state.shareOverlay === "blog" ? "shareOvrly active" : "shareOvrly"}>
                <div className="heading">
                    <h5>Share</h5>
                    <BiX onClick={(e)=>{this.setShareOverlay(null)}} />
                </div>
                <div>
                    <form onSubmit={(e) => {this.submitForm(e, "blog")}}>
                        {this.state.shareCover ? 
                        <div className="targetPreview">
                            <img src={this.state.shareCover} />
                            <span onClick={()=>{document.getElementById('createBlogCover').click()}}><BiRefresh />CHANGE</span>
                        </div> : '' }
                        {this.state.shareCover ? '' :
                        <div className="previewBox" onClick={()=>{document.getElementById('createBlogCover').click()}}>
                            <BiImage />
                            SELECT COVER IMAGE
                        </div> }
                        <input style={{display:'none'}} accept="image/*" id="createBlogCover" type="file" name="cover" onChange={(e) => {this.showPreview(e, "cover")}} />
                        <div className="inputs">
                            <input id="createBlogName" type="text" name="title" placeholder="Title" />
                            <textarea id="createBlogDesc" name="description" placeholder="Description"></textarea>
                            <button type="submit" ><BiShare /> SHARE</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className={this.state.shareOverlay === "album" ? "shareOvrly active" : "shareOvrly"}>
                <div className="heading">
                    <h5>Share</h5>
                    <BiX onClick={(e)=>{this.setShareOverlay(null)}} />
                </div>
                <div>
                    <form onSubmit={(e) => {this.submitForm(e, "album")}}>
                        {this.state.shareCover ? 
                        <div className="targetPreview">
                            <img src={this.state.shareCover} />
                            <span onClick={()=>{document.getElementById('createAlbumCover').click()}}><BiRefresh />CHANGE</span>
                        </div> : '' }
                        {this.state.shareCover ? '' :
                        <div className="previewBox" onClick={()=>{document.getElementById('createAlbumCover').click()}}>
                            <BiImage />
                            SELECT COVER IMAGE
                        </div> }
                        <input style={{display:'none'}} accept="image/*" id="createAlbumCover" type="file" name="cover" onChange={(e) => {this.showPreview(e, "cover")}} />
                        <div className="inputs">
                            <input id="createAlbumArtistName" type="text" name="artist" placeholder="Artist name" />
                            <input id="createAlbumName" type="text" name="title" placeholder="Title" />
                            <textarea id="createAlbumDesc" name="description" placeholder="Description"></textarea>
                            <p style={{margin: '0', marginTop: '20px'}}>Check the tracks below that album includes</p>
                            <div className="tracks_for_album" onClick={this.checkboxes}>
                                {this.state.tracks.length ?
                                this.state.tracks.map((track, i)=>{
                                    return(
                                        <div key={i}>
                                            <input className="cBfAtI" type="checkbox" name="track" value={track.id} /> <span>- {track.name}</span>
                                        </div>
                                    )
                                }) : <p>You haven't shared track yet</p>}
                            </div>
                            <button type="submit" ><BiShare /> SHARE</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>: ''}
        {this.state.shareOverlay === "Followings" || this.state.shareOverlay === "Followers" ? 
        <Follows 
            direction = {this.state.shareOverlay}
            setShareOverlay = {this.setShareOverlay}
            setLoading = {this.props.setLoading}
            user_id = {this.state.artist.id}
        /> : ''}
        </div>)
    }
}

export default SingleUser