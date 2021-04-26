import React from 'react'
import { Link } from 'react-router-dom'

const HomeTopSliderItem = (props) => {
    return (
        <div 
        className="homeTopSliderItem" 
        style={{
            backgroundImage: "url("+props.bg+")"
        }}
        >
            <div className="homeSliderItemInfo">
                <h1>{props.album_name}</h1>
                <p>Listen one of weeks popular album now from {props.album_artist}</p>
                <p>Click below to listen the album</p>
                <Link style={{textDecoration:'none'}} to={'/album/'+props.album_slug}>Show the Album</Link>
            </div>
            <div className="bottomGradient"></div>
        </div>
    )
}

export default HomeTopSliderItem
