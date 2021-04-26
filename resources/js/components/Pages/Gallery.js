import React, { Component } from 'react'
import InitializeData from '../Helper/InitializeData';
import {AiOutlineZoomIn, AiOutlineCloseCircle} from 'react-icons/ai'
import { ClipLoader } from 'react-spinners';
import LoadMore from '../Helper/LoadMore';
import Loading from '../Additions/Loading';

export default class Gallery extends Component {
    constructor(props){
        super(props);
        this.state = {
            isMount: true,
            src: null,
        }
        this.loadMore = this.loadMore.bind(this);
        this.zoomPhoto = this.zoomPhoto.bind(this);
        this.findSrc = this.findSrc.bind(this);
        this.closeZoom = this.closeZoom.bind(this);
    }

    componentDidMount(){
        if(this.state.isMount){
            this.props.setLoading(true);
            this.axiosCancelSource = axios.CancelToken.source();
            axios.get('api/gallery?limit=12')
            .then((res)=>{
                this.props.setData(res.data);
                this.props.setLoading(false);
            })
            .catch((err)=>{
                this.props.setLoading(false);
            })

            InitializeData(this.props.setCurrentPlaylist, 
                this.props.currentPlaylist, 
                this.props.setCurrentTrack, 
                this.props.currentTrack);

            window.addEventListener('scroll', this.loadMore);
        }
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
            "gallery"
        );
    }

    componentWillUnmount() {
        this.props.setData(null);
        this.props.setEnd(false);
        this.props.setLoading(false);
        this.setState({
            isMount: false,
        })
        this.axiosCancelSource.cancel('Axios request canceled.');
        window.removeEventListener('scroll', this.loadMore, false);
    }

    findSrc(e){
        if(e){
            var element = e.target.tagName.toLowerCase();
            if(element === "div"){
                var src = e.target.previousSibling.getAttribute('src');
            }else if(element === "svg"){
                var src = e.target.parentNode.previousSibling.getAttribute('src');
            }else if(element === "path"){
                var src = e.target.parentNode.parentNode.previousSibling.getAttribute('src');
            }

            return src;
        }
    }

    zoomPhoto(e){
        if(e){
            var src = this.findSrc(e);
            this.setState({
                src: src,
            })
        }
    }

    closeZoom(){
        this.setState({
            src: null,
        })
    }

    render() {
        return (
            <div className="mainWrapper">
                <Loading loading={this.props.loading} />
                <div className="galleryPage">
                    <div className="galleryHeading">
                        <h2>Gallery</h2>
                        <p>See what people shares</p>
                    </div>
                    {this.props.data && this.props.data.length ? 
                    <div className="galleryGrid">
                        <div className={this.state.src ? "galleryZoom active" : "galleryZoom"}>
                            <span className="close" onClick={this.closeZoom}>
                                <AiOutlineCloseCircle />
                            </span>
                            <img src={this.state.src} />
                        </div>
                        {this.props.data.map((photo, i)=>{
                            return(
                                <div className="galleryGridItem" key={i}>
                                    <img className="galleryImage" src={window.location.origin + photo.cover} />
                                    <div className="galleryBoxHoverOverlay" onClick={this.zoomPhoto}><AiOutlineZoomIn /></div>
                                </div>
                            )
                        })}
                    </div> : ''}
                </div>
                {this.props.loading ? 
                <div style={{width:'100%', textAlign: 'center', margin: '30px 0'}}><ClipLoader color="#0C101B" /></div>
                : ''}
            </div>
        )
    }
}
