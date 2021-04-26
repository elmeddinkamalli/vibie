import React, { useState, useRef, useEffect, useMemo } from 'react'
import {BrowserRouter as Router, Redirect, Route, Switch, useParams} from 'react-router-dom'
import {post} from 'axios';
import LeftAside from '../Aside/LeftAside'
import RightAside from '../Aside/RightAside'
import Player from '../Player/Player'
import SearchOverlay from '../Search/SearchOverlay'
import Home from '../Pages/Home'
import SingleTrack from '../SinglePages/SingleTrack'
import SingleGenre from '../SinglePages/SingleGenre'
import Genres from '../Pages/Genres'
import SingleAlbum from '../SinglePages/SingleAlbum'
import SingleUser from '../SinglePages/SingleUser'
import Albums from '../Pages/Albums'
import Users from '../Pages/Users'
import Blogs from '../Pages/Blogs'
import SingleBlog from '../SinglePages/SingleBlog'
import Gallery from '../Pages/Gallery'
import Search from '../Search/Search'
import Login from '../Auth/Login'
import Register from '../Auth/Register'
import Likes from '../Pages/Likes'
import Saves from '../Pages/Saves'
import Settings from '../Pages/Settings'
import { Errors } from '../Additions/Errors'

function detectEscKey(key, cb){
    var callbackRef = useRef(cb);

    useEffect(()=>{
        callbackRef.current = cb;
    })

    useEffect(()=>{
        function handle(event){
            if(event.code === key){
                callbackRef.current(event);
            }
        }
        document.addEventListener('keydown', handle);
        return () => document.removeEventListener('keydown', handle);
    }, [key]);
}

const Index = (props) => {
    const [play, setPlay] = useState(false);
    const [menu, setMenu] = useState(false);
    const [playlist, setPlaylist] = useState(false);
    const [userPopUp, setUserPopUp] = useState(false);
    const [search, setSearch] = useState(false);
    const [currentPlaylist, setCurrentPlaylist] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [trackPlaylistIndex, setTrackPlaylistIndex] = useState(null);
    const [asideSlug, setAsideSlug] = useState(null);
    const [playerSlug, setPlayerSlug] = useState(null);
    const [userSlug, setUserSlug] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);
    const path = window.location.pathname;
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState(null);

    function closeAllMenus(){
        setMenu(false);
        setPlaylist(false);
        setSearch(false);
    }

    useEffect(() => {
        const options = {
            url: 'api/algorithm',
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
            },
            data: {
                data_id: currentTrack,
                direction: "track",
            }
        };
        post(options.url, options.data)
    }, [currentTrack])
    
    detectEscKey('Escape', closeAllMenus);
    return (
        <>
            {errors ? <Errors errors={errors} /> : ''}
            <Router>
                {path !== "/login" && path !== "/register" ?
                <SearchOverlay 
                    search={search}
                    setSearch={setSearch}
                    setUserSlug={setUserSlug}
                /> : ''}
                {path !== "/login" && path !== "/register" ?
                <RightAside 
                    play={play} 
                    setPlay={setPlay} 
                    playlist={playlist} 
                    setPlaylist={setPlaylist} 
                    userPopUp={userPopUp} 
                    setUserPopUp={setUserPopUp}
                    currentTrack={currentTrack}
                    currentPlaylist={currentPlaylist}
                    setCurrentPlaylist={setCurrentPlaylist}
                    setCurrentTrack={setCurrentTrack}
                    trackPlaylistIndex={trackPlaylistIndex}
                    setTrackPlaylistIndex={setTrackPlaylistIndex}
                    asideSlug={asideSlug}
                    setAsideSlug={setAsideSlug}
                /> : ''}
                {path !== "/login" && path !== "/register" ?
                <LeftAside menu={menu} /> : ''}
                <Switch>
                    <Route path="/" exact>
                        <Home
                            play={play} 
                            setPlay={setPlay} 
                            currentTrack={currentTrack}
                            currentPlaylist={currentPlaylist}
                            setCurrentPlaylist={setCurrentPlaylist}
                            setCurrentTrack={setCurrentTrack}
                            trackPlaylistIndex={trackPlaylistIndex}
                            setTrackPlaylistIndex={setTrackPlaylistIndex}
                            user={props.user}
                            loading={loading}
                            setLoading={setLoading}
                            setErrors={setErrors}
                        />
                    </Route>
                    <Route 
                        path="/track/:slug"
                        exact
                        render={(propsRoute) => ( 
                        <SingleTrack
                            slug={propsRoute.match.params.slug}
                            play={play} 
                            setPlay={setPlay} 
                            currentTrack={currentTrack}
                            currentPlaylist={currentPlaylist}
                            setCurrentPlaylist={setCurrentPlaylist}
                            setCurrentTrack={setCurrentTrack}
                            trackPlaylistIndex={trackPlaylistIndex}
                            setTrackPlaylistIndex={setTrackPlaylistIndex}
                            asideSlug={asideSlug}
                            setAsideSlug={setAsideSlug}
                            playerSlug={playerSlug}
                            user={props.user}
                            loading={loading}
                            setLoading={setLoading}
                            setErrors={setErrors}
                        />)} 
                    />
                    <Route path="/genres">
                        <Genres
                            play={play} 
                            setPlay={setPlay} 
                            currentTrack={currentTrack}
                            currentPlaylist={currentPlaylist}
                            setCurrentPlaylist={setCurrentPlaylist}
                            setCurrentTrack={setCurrentTrack}
                            trackPlaylistIndex={trackPlaylistIndex}
                            setTrackPlaylistIndex={setTrackPlaylistIndex}
                            loading={loading}
                            setLoading={setLoading}
                        />
                    </Route>
                    <Route 
                        path="/genre/:slug"
                        render={(propsRoute) => ( 
                        <SingleGenre
                            slug={propsRoute.match.params.slug}
                            play={play} 
                            setPlay={setPlay} 
                            currentTrack={currentTrack}
                            currentPlaylist={currentPlaylist}
                            setCurrentPlaylist={setCurrentPlaylist}
                            setCurrentTrack={setCurrentTrack}
                            trackPlaylistIndex={trackPlaylistIndex}
                            setTrackPlaylistIndex={setTrackPlaylistIndex}
                            data={data}
                            setData={setData}
                            end={end}
                            setEnd={setEnd}
                            loading={loading}
                            setLoading={setLoading}
                            user={props.user}
                            setErrors={setErrors}
                        />)} 
                    />
                    <Route path="/albums">
                        <Albums
                            play={play} 
                            setPlay={setPlay} 
                            currentTrack={currentTrack}
                            currentPlaylist={currentPlaylist}
                            setCurrentPlaylist={setCurrentPlaylist}
                            setCurrentTrack={setCurrentTrack}
                            trackPlaylistIndex={trackPlaylistIndex}
                            setTrackPlaylistIndex={setTrackPlaylistIndex}
                            loading={loading}
                            setLoading={setLoading}
                            user={props.user}
                        />
                    </Route>
                    <Route 
                        path="/album/:slug"
                        render={(propsRoute) => ( 
                        <SingleAlbum
                            slug={propsRoute.match.params.slug}
                            play={play} 
                            setPlay={setPlay} 
                            currentTrack={currentTrack}
                            currentPlaylist={currentPlaylist}
                            setCurrentPlaylist={setCurrentPlaylist}
                            setCurrentTrack={setCurrentTrack}
                            trackPlaylistIndex={trackPlaylistIndex}
                            setTrackPlaylistIndex={setTrackPlaylistIndex}
                            loading={loading}
                            setLoading={setLoading}
                            user={props.user}
                            setErrors={setErrors}
                        />)} 
                    />
                    <Route path="/users">
                        <Users
                            play={play} 
                            setPlay={setPlay} 
                            currentTrack={currentTrack}
                            currentPlaylist={currentPlaylist}
                            setCurrentPlaylist={setCurrentPlaylist}
                            setCurrentTrack={setCurrentTrack}
                            trackPlaylistIndex={trackPlaylistIndex}
                            setTrackPlaylistIndex={setTrackPlaylistIndex}
                            data={data}
                            setData={setData}
                            end={end}
                            setEnd={setEnd}
                            loading={loading}
                            setLoading={setLoading}
                        />
                    </Route>
                    <Route 
                        path="/user/:username"
                        render={(propsRoute) => ( 
                        <SingleUser
                            username={propsRoute.match.params.username}
                            play={play} 
                            setPlay={setPlay} 
                            currentTrack={currentTrack}
                            currentPlaylist={currentPlaylist}
                            setCurrentPlaylist={setCurrentPlaylist}
                            setCurrentTrack={setCurrentTrack}
                            trackPlaylistIndex={trackPlaylistIndex}
                            setTrackPlaylistIndex={setTrackPlaylistIndex}
                            userSlug={userSlug}
                            setUserSlug={setUserSlug}
                            loading={loading}
                            setLoading={setLoading}
                            user={props.user}
                            setErrors={setErrors}
                        />)} 
                    />
                    <Route path="/blogs">
                        <Blogs
                            play={play} 
                            setPlay={setPlay} 
                            currentTrack={currentTrack}
                            currentPlaylist={currentPlaylist}
                            setCurrentPlaylist={setCurrentPlaylist}
                            setCurrentTrack={setCurrentTrack}
                            trackPlaylistIndex={trackPlaylistIndex}
                            setTrackPlaylistIndex={setTrackPlaylistIndex}
                            data={data}
                            setData={setData}
                            end={end}
                            setEnd={setEnd}
                            loading={loading}
                            setLoading={setLoading}
                            user={props.user}
                        />
                    </Route>
                    <Route 
                        path="/blog/:slug"
                        render={(propsRoute) => ( 
                        <SingleBlog
                            slug={propsRoute.match.params.slug}
                            play={play} 
                            setPlay={setPlay} 
                            currentTrack={currentTrack}
                            currentPlaylist={currentPlaylist}
                            setCurrentPlaylist={setCurrentPlaylist}
                            setCurrentTrack={setCurrentTrack}
                            trackPlaylistIndex={trackPlaylistIndex}
                            setTrackPlaylistIndex={setTrackPlaylistIndex}
                            loading={loading}
                            setLoading={setLoading}
                            user={props.user}
                        />)} 
                    />
                    <Route path="/gallery">
                        <Gallery
                            play={play} 
                            setPlay={setPlay} 
                            currentTrack={currentTrack}
                            currentPlaylist={currentPlaylist}
                            setCurrentPlaylist={setCurrentPlaylist}
                            setCurrentTrack={setCurrentTrack}
                            trackPlaylistIndex={trackPlaylistIndex}
                            setTrackPlaylistIndex={setTrackPlaylistIndex}
                            data={data}
                            setData={setData}
                            end={end}
                            setEnd={setEnd}
                            loading={loading}
                            setLoading={setLoading}
                        />
                    </Route>
                    <Route path="/search">
                        <Search
                            play={play} 
                            setPlay={setPlay} 
                            currentTrack={currentTrack}
                            currentPlaylist={currentPlaylist}
                            setCurrentPlaylist={setCurrentPlaylist}
                            setCurrentTrack={setCurrentTrack}
                            trackPlaylistIndex={trackPlaylistIndex}
                            setTrackPlaylistIndex={setTrackPlaylistIndex}
                            loading={loading}
                            setLoading={setLoading}
                            user={props.user}
                            setErrors={setErrors}
                        />
                    </Route>
                    <Route path="/likes">
                        <Likes
                            play={play} 
                            setPlay={setPlay} 
                            currentTrack={currentTrack}
                            currentPlaylist={currentPlaylist}
                            setCurrentPlaylist={setCurrentPlaylist}
                            setCurrentTrack={setCurrentTrack}
                            trackPlaylistIndex={trackPlaylistIndex}
                            setTrackPlaylistIndex={setTrackPlaylistIndex}
                            user={props.user}
                            loading={loading}
                            setLoading={setLoading}
                            setErrors={setErrors}
                        />
                    </Route>
                    <Route path="/saves">
                        <Saves
                            play={play} 
                            setPlay={setPlay} 
                            currentTrack={currentTrack}
                            currentPlaylist={currentPlaylist}
                            setCurrentPlaylist={setCurrentPlaylist}
                            setCurrentTrack={setCurrentTrack}
                            trackPlaylistIndex={trackPlaylistIndex}
                            setTrackPlaylistIndex={setTrackPlaylistIndex}
                            user={props.user}
                            loading={loading}
                            setLoading={setLoading}
                            setErrors={setErrors}
                        />
                    </Route>
                    <Route path="/settings">
                        <Settings
                            play={play} 
                            setPlay={setPlay} 
                            currentTrack={currentTrack}
                            currentPlaylist={currentPlaylist}
                            setCurrentPlaylist={setCurrentPlaylist}
                            setCurrentTrack={setCurrentTrack}
                            trackPlaylistIndex={trackPlaylistIndex}
                            setTrackPlaylistIndex={setTrackPlaylistIndex}
                            loading={loading}
                            setLoading={setLoading}
                            user={props.user}
                        />
                    </Route>
                    <Route path='/login'
                        render={() => (
                            props.user !== null ? (
                                <Redirect to="/" />
                            ) : (
                                <Login />
                            )
                        )}
                    />
                    <Route path='/register'
                        render={() => (
                            props.user !== null ? (
                                <Redirect to="/" />
                            ) : (
                                <Register />
                            )
                        )}
                    />
                </Switch>
                {path !== "/login" && path !== "/register" ?
                <Player
                    play={play} 
                    setPlay={setPlay} 
                    setMenu={setMenu} 
                    menu={menu} 
                    playlist={playlist} 
                    setPlaylist={setPlaylist}
                    userPopUp={userPopUp} 
                    setUserPopUp={setUserPopUp}
                    setSearch={setSearch}
                    currentPlaylist={currentPlaylist}
                    setCurrentPlaylist={setCurrentPlaylist}
                    currentTrack={currentTrack}
                    setCurrentTrack={setCurrentTrack}
                    trackPlaylistIndex={trackPlaylistIndex}
                    setTrackPlaylistIndex={setTrackPlaylistIndex}
                    userSlug={userSlug}
                    setUserSlug={setUserSlug}
                    setPlayerSlug={setPlayerSlug}
                    user={props.user}
                    setUser={setUser}
                /> : ''}
            </Router>
        </>
    )
}

export default Index