import React, { Component } from 'react'
import Carousel from 'react-elastic-carousel'
import {Link} from 'react-router-dom'
import SetPlaylistToLocal from '../Helper/SetPlaylistToLocal';
import Like from '../Helper/Like';
import TrackBoxSingle from './TrackBoxSingle';

class MusicBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMount: true,
        };
        this.breakPointsMusicBox = [
            { width: 1, itemsToShow: 1 },
            { width: 300, itemsToShow: 2, itemPadding: [0, 5], outerSpace: 0},
            { width: 500, itemsToShow: 3, itemPadding: [0, 5], outerSpace: 0},
            { width: 1040, itemsToShow: 6, itemPadding: [0, 5], outerSpace: 0},
        ];
        this.setPlaylistToLocal = this.setPlaylistToLocal.bind(this);
        this.likeUnlike = this.likeUnlike.bind(this);
    }
    
    componentDidMount(){
        this.playlist = this.props.tracks;
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
                this.playlist,
                this.props.setTrackPlaylistIndex
            );
        }
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

    render(){
        return (
            <section style={{position:'relative'}}>
                <div className="sectionHeadline">
                    <div>
                        <h4>{this.props.headline}</h4>
                        <p>{this.props.headDesc}</p>
                    </div>
                    <Link to="/albums">View Alboms &nbsp; &gt;</Link>
                </div>
                <Carousel itemsToShow={6} pagination={false} breakPoints={this.breakPointsMusicBox} >
                {this.props.tracks.map((track, i)=>{
                    return (<TrackBoxSingle key={i} 
                        i={i} 
                        track={track} 
                        currentTrack={this.props.currentTrack} 
                        setCurrentTrack={this.props.setCurrentTrack}
                        currentPlaylist={this.props.currentPlaylist}
                        setCurrentPlaylist={this.props.setCurrentPlaylist}
                        play={this.props.play}
                        setPlay={this.props.setPlay}
                        data={this.props.tracks}
                        setTrackPlaylistIndex={this.props.setTrackPlaylistIndex}
                        loading={this.props.loading}
                        setLoading={this.props.setLoading}
                        user={this.props.user}
                        setErrors={this.props.setErrors} 
                        />)
                })}
                </Carousel>
            </section>
        )
    }
}

export default MusicBox
