import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { BsPlay, BsFlag, BsHeart, BsPause, BsCollectionPlay, BsHeartFill } from 'react-icons/bs'
import { ClipLoader } from 'react-spinners'
import InitializeData from '../Helper/InitializeData'
import LoadMore from '../Helper/LoadMore'
import SetPlaylistToLocal from '../Helper/SetPlaylistToLocal'
import Loading from '../Additions/Loading';
import Like from '../Helper/Like'
import TrackBoxSingle from '../Additions/TrackBoxSingle'

class SingleGenre extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genre: null,
            slug: this.props.slug,
            isMount: true,
        }
        this.show = this.show.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.setFirsData = this.setFirsData.bind(this);
    }

    componentDidMount(){
        if(this.state.isMount){
            this.props.setLoading(true);
            this.axiosCancelSource = axios.CancelToken.source();
            axios.get(`api/genre/${this.state.slug}`)
            .then((res)=>{
                this.setState({
                    genre: res.data.genre,
                }, this.setFirsData(res.data.tracks, InitializeData));
                this.props.setLoading(false);
            })
            .catch((err)=>{
                this.props.setLoading(false);
            })

            window.addEventListener('scroll', this.loadMore);
        }
    }

    setFirsData(data, callBack){
        this.props.setData(data);
        callBack(
            this.props.setCurrentPlaylist, 
            this.props.currentPlaylist, 
            this.props.setCurrentTrack, 
            this.props.currentTrack, 
            data, 
            data[0]
        )
    }

    loadMore(){
        LoadMore(
            this.props.end,
            this.props.setEnd,
            this.state.isMount,
            this.props.loading,
            this.props.setLoading,
            this.props.data,
            this.props.setData,
            "genreTracks",
            this.state.genre,
            this.props.currentPlaylist,
            this.props.setCurrentPlaylist
        );
    }

    componentWillUnmount(){
        this.setState({
            isMount: false,
            genre: null,
        });
        this.props.setData(null);
        this.props.setEnd(false);
        this.props.setLoading(false);
        this.axiosCancelSource.cancel('Axios request canceled.');
        window.removeEventListener('scroll', this.loadMore, false);
    }

    show(){
        console.log(this.props.data);
        console.log(this.state.genre);
    }

    render(){
        return (
            <div className="mainWrapper" onClick={this.show}>
                <Loading loading={this.props.loading} />
                {this.state.genre ? 
                <section className="singleTrack" style={{backgroundImage: `url(${window.location.origin + '/img/track-bg.webp'})`}}>
                    <div className="trackInfos">
                        <div className="singleGenreIcon">
                            <BsCollectionPlay />
                        </div>
                        <div className="singTrackInf">
                            <small>GENRE</small>
                            <h2>{this.state.genre.name}</h2>
                        </div>
                    </div>
                </section> : '' }
                {this.state.genre && this.props.data ? 
                <div className="relatedTracks">
                    <div className="relatedTracksHeading"><h4>Last {this.state.genre.name} Tracks</h4></div>
                    <div className="genreTracksGrid">
                        {this.props.data.map((track, i)=>{
                            return (<TrackBoxSingle 
                                key={i} 
                                i={i} 
                                track={track} 
                                currentTrack={this.props.currentTrack} 
                                setCurrentTrack={this.props.setCurrentTrack}
                                currentPlaylist={this.props.currentPlaylist}
                                setCurrentPlaylist={this.props.setCurrentPlaylist}
                                play={this.props.play}
                                setPlay={this.props.setPlay}
                                data={this.props.data}
                                setTrackPlaylistIndex={this.props.setTrackPlaylistIndex}
                                loading={this.props.loading}
                                setLoading={this.props.setLoading}
                                user={this.props.user}
                                setErrors={this.props.setErrors}/>)
                        })}
                    </div>
                </div> 
                : ''}
                {this.props.loading ? 
                <div style={{width:'100%', textAlign: 'center', margin: '30px 0'}}><ClipLoader color="#0C101B" /></div>
                : ''}
            </div>
        )   
    }
}

export default SingleGenre
