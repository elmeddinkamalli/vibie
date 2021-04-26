import React, { Component } from 'react'
import axios from 'axios';
import { BsCollectionPlay } from 'react-icons/bs'
import { Link } from 'react-router-dom';
import InitializeData from '../Helper/InitializeData';
import Loading from '../Additions/Loading';

export default class Genres extends Component {
    constructor(props){
        super(props);
        this.state = {
            genres: null,
            isMonth: true,
        }
    }

    componentDidMount(){
        if(this.state.isMonth){
            this.props.setLoading(true);
            this.axiosCancelSource = axios.CancelToken.source();
            axios.get('api/genres')
            .then(res => {
                this.setState({
                    genres: res.data
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
            genres: null,
            isMonth:false,
        })
    }

    render() {
        return (
            <div className="mainWrapper">
                <Loading loading={this.props.loading} />
                <div className="genresPage">
                    <div className="genresHeading">
                        <h2>Genres</h2>
                        <p>You can listen different types of musics from which genre you want to</p>
                    </div>
                    <div>
                        <p>Choose from existing genres below</p>
                        <div className="genresGrid">
                            {this.state.genres ? this.state.genres.map((genre, i) => {
                                return (
                                    <div className="genreGridItem" key={i}>
                                        <BsCollectionPlay />
                                        <div>
                                            <h5><Link to={'/genre/'+genre.slug}>{genre.name}</Link></h5>
                                            <small>{genre.tracks_count} Tracks</small>
                                        </div>
                                    </div>
                                )
                            })
                            : '' }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
