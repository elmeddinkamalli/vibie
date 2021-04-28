import React, { Component } from 'react'
import Carousel from 'react-elastic-carousel'
import axios from 'axios'
import HomeTopSliderItem from '../Additions/HomeTopSliderItem'
import MusicBox from '../Additions/MusicBox'
import MusicList from '../Additions/MusicList'
import BlogPost from '../Additions/BlogPost'
import InitializeData from '../Helper/InitializeData'
import Loading from '../Additions/Loading';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            last_tracks: null,
            weeks_popular: {
                genres:[],
            },
            blogs: null,
            popular_tracks: null,
            popular_albums: null,
            isMount: true,
        }
    }

    componentDidMount(){
        this.cancelTokenSource = axios.CancelToken.source();
        this.options = {
            url: null,
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
            },
            withCredentials: true,
            credentials: 'include',
            cancelToken: this.cancelTokenSource.token
        };
        if(this.state.isMount){
            this.props.setLoading(true);
            this.options.url = 'api/albums/popular';
            axios(this.options)
            .then(res => {
                this.setState({
                    popular_albums: res.data
                })
                this.props.setLoading(false);
            })
            .catch(err => {
                this.props.setLoading(false);
            })
            
            this.options.url = 'api/tracks';
            this.props.setLoading(true);
            axios(this.options)
            .then((res)=>{
                this.setState({
                    last_tracks: res.data
                })
                this.props.setLoading(false);
            })
            .catch((err)=>{
                this.props.setLoading(false);
            })
            
            this.options.url = 'api/tracks/weeks_popular';
            this.props.setLoading(true);
            axios(this.options)
            .then((res)=>{
                this.setState(weeks_popular=>(
                        {
                            weeks_popular: {genres: res.data}
                        }
                    )
                );
                this.props.setLoading(false);
            })
            .catch((err)=>{
                this.props.setLoading(false);
            })
            
            this.options.url = 'api/blogs?limit=3';
            this.props.setLoading(true);
            axios(this.options)
            .then((res)=>{
                this.setState({
                    blogs: res.data
                })
                this.props.setLoading(false);
            })
            .catch((err)=>{
                this.props.setLoading(false);
            })
            
            this.options.url = 'api/tracks/popular';
            this.props.setLoading(true);
            axios(this.options)
            .then((res)=>{
                this.setState({
                    popular_tracks: res.data
                }, ()=>{
                    InitializeData(this.props.setCurrentPlaylist, 
                    this.props.currentPlaylist, 
                    this.props.setCurrentTrack, 
                    this.props.currentTrack, 
                    this.state.popular_tracks, 
                    this.state.popular_tracks[0])
                })
                this.props.setLoading(false);
            })
            .catch((err)=>{
                this.props.setLoading(false);
            })
        }
    }

    componentWillUnmount(){
        this.cancelTokenSource.cancel();
        this.setState({
            isMount: false,
        });
    }

    render(){
        return (
            <div className="mainWrapper">
                <Loading loading={this.props.loading} />
                {this.state.popular_albums && this.state.popular_albums.length > 0 ? 
                    <section className="homeTopSlider">
                        <Carousel itemsToShow={1} pagination={false} enableTilt={true} >
                            {this.state.popular_albums.map((album, i)=>{
                                return(<HomeTopSliderItem 
                                        key={i} 
                                        bg={album.cover_big}
                                        album_name={album.name}
                                        album_artist={album.artist}
                                        album_slug={album.slug}
                                    />)
                            })}
                        </Carousel>
                    </section>
                : ''}
                <div className="secondWrapper">
                {this.state.last_tracks ? 
                <MusicBox 
                    headline="New Releases For You"
                    headDesc="Enjoy some new awesome music"
                    play={this.props.play} 
                    setPlay={this.props.setPlay} 
                    tracks={this.state.last_tracks}
                    currentTrack={this.props.currentTrack}
                    setCurrentTrack={this.props.setCurrentTrack}
                    currentPlaylist={this.props.currentPlaylist}
                    setCurrentPlaylist={this.props.setCurrentPlaylist}
                    trackPlaylistIndex={this.props.trackPlaylistIndex}
                    setTrackPlaylistIndex={this.props.setTrackPlaylistIndex}
                    loading={this.props.loading}
                    setLoading={this.props.setLoading}
                    user={this.props.user}
                    setErrors={this.props.setErrors}
                /> : ''}
                <section className="weeksPopularAndBlog">
                    {this.state.weeks_popular.genres && this.state.weeks_popular.genres.length > 0 ? 
                    <MusicList 
                        play={this.props.play} 
                        setPlay={this.props.setPlay} 
                        genres={this.state.weeks_popular.genres}
                        currentTrack={this.props.currentTrack}
                        setCurrentTrack={this.props.setCurrentTrack}
                        currentPlaylist={this.props.currentPlaylist}
                        setCurrentPlaylist={this.props.setCurrentPlaylist}
                        trackPlaylistIndex={this.props.trackPlaylistIndex}
                        setTrackPlaylistIndex={this.props.setTrackPlaylistIndex}
                        loading={this.props.loading}
                        setLoading={this.props.setLoading}
                        user={this.props.user}
                        setErrors={this.props.setErrors}
                    /> : ''}
                    <BlogPost 
                        blogs={this.state.blogs}
                        setLoading={this.props.setLoading}
                        user={this.props.user}
                    />
                </section>
                {this.state.popular_tracks ? 
                <MusicBox 
                    headline="Recommended For You"
                    headDesc="Find your taste of music"
                    play={this.props.play} 
                    setPlay={this.props.setPlay} 
                    tracks={this.state.popular_tracks}
                    currentTrack={this.props.currentTrack}
                    setCurrentTrack={this.props.setCurrentTrack}
                    currentPlaylist={this.props.currentPlaylist}
                    setCurrentPlaylist={this.props.setCurrentPlaylist}
                    trackPlaylistIndex={this.props.trackPlaylistIndex}
                    setTrackPlaylistIndex={this.props.setTrackPlaylistIndex}
                    loading={this.props.loading}
                    setLoading={this.props.setLoading}
                    user={this.props.user}
                    setErrors={this.props.setErrors}
                /> : ''}
                </div>
            </div>
        )   
    }
}

export default Home
