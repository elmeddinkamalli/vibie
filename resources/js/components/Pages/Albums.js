import React, { Component } from 'react'
import axios from 'axios';
import { BsFlag, BsFlagFill, BsHeart, BsHeartFill } from 'react-icons/bs'
import { Link } from 'react-router-dom';
import InitializeData from '../Helper/InitializeData';
import Like from '../Helper/Like';
import Loading from '../Additions/Loading';
import AlbumBoxSingle from '../Additions/AlbumBoxSingle';

export default class Albums extends Component {
    constructor(props){
        super(props);
        this.state = {
            isMount: true,
            albums: null,
        }
        this.likeUnlike = this.likeUnlike.bind(this);
    }

    async componentDidMount(){
        if(this.state.isMount){
            this.props.setLoading(true);
            this.axiosCancelSource = axios.CancelToken.source();
            await axios.get('api/albums')
            .then(res => {
                this.setState({
                    albums: res.data
                })
                this.props.setLoading(false);
            })
            .catch(err => {
                this.props.setLoading(false);
            })

            InitializeData(this.props.setCurrentPlaylist, 
                this.props.currentPlaylist, 
                this.props.setCurrentTrack, 
                this.props.currentTrack);
        }
    }

    componentWillUnmount(){
        this.axiosCancelSource.cancel('Axios request canceled.');
        this.setState({
            isMount: false,
            genres: null,
        })
    }

    likeUnlike(e, direction){
        if(this.props.user){
            if(e){
                Like(
                    e,
                    direction,
                    this.props.loading,
                    this.props.setLoading
                )
            }
        }
    }

    render() {
        return (
            <div className="mainWrapper">
                <Loading loading={this.props.loading} />
                <div className="genresPage">
                    <div className="genresHeading">
                        <h2>Albums</h2>
                        <p>Listen the last albums from Vibie below</p>
                    </div>
                    <div>
                        <div className="albumsGrid">
                            {this.state.albums ? this.state.albums.map((album, i) => {
                                return (<AlbumBoxSingle key={i} album={album} user={this.props.user} setLoading={this.props.setLoading} />)
                            })
                            : '' }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
