import React, { Component } from 'react'
import { BsX } from 'react-icons/bs'
import { Link } from 'react-router-dom';

export default class SearchOverlay extends Component {
    constructor(props){
        super(props);
        this.state = {
            isMonth: true,
            lastUsers: null,
            searchUserRes: null,
            query: null,
        }
        this.searchController = this.searchController.bind(this);
        this.setUserSlug = this.setUserSlug.bind(this);
        this.closeSearchAndGoToUser = this.closeSearchAndGoToUser.bind(this);
        this.detectInput = this.detectInput.bind(this);
        this.timer;
    }

    componentDidMount(){
        this.options = {
            url: null,
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
            },
            withCredentials: true,
            credentials: 'include',
        };
        if(this.state.isMonth){
            this.options.url = 'api/users?limit=3';
            axios(this.options)
            .then((res)=>{
                this.setState({
                    lastUsers: res.data
                })
            })
        }
    }

    searchController(){
        this.props.setSearch(false);
    }

    setUserSlug(e){
        if(e){
            var slug = e.target.dataset.userslug;
            this.props.setUserSlug(slug);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    closeSearchAndGoToUser(e){
        this.searchController();
        this.setUserSlug(e);
    }

    detectInput(e){
        e.persist();
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
            var searchText = e.target.value;
            var trimmed_srctext = searchText.replace(/\s+/g, " ").trim();
            if(trimmed_srctext){
                axios.get(`http://localhost:8000/api/search?for=users&s_query=${trimmed_srctext}&limit=9`)
                .then((res)=>{
                    this.setState({
                        searchUserRes: res.data,
                        query: trimmed_srctext
                    })
                })
            }else{
                this.setState({
                    searchUserRes: null,
                    query: null
                })
            }
        }, 500);
    }

    render() {
        return (
            <div className={`searchOverlay ${this.props.search ? 'active' : ''}`}>
                <button className="closeSearchOverlay" onClick={this.searchController}>
                    <BsX />
                </button>
                <div className="searchInput">
                    <form method="get" action={window.location.origin+"/search"}>
                        <input name="s_query" type="text" placeholder="Search" onChange={this.detectInput} />
                    </form>
                </div>
                {this.state.lastUsers ?
                <div className="searchOverlayNewArtists">
                    <h5>{this.state.searchUserRes ? "You searched for \""+this.state.query+"\"" : "New Users"}</h5>
                    {this.state.searchUserRes ? 
                    <ul className="quickSearch">
                        {this.state.searchUserRes.map((user,i)=>{
                            return(
                                <li key={i}>
                                    <img className="userAvatar" src={user.avatar ? window.location.origin + user.avatar : window.location.origin + '/img/users/default_avatar.jpg'} />
                                    <div className="searchUserInfo">
                                        <Link to={'/user/'+user.username} onClick={this.closeSearchAndGoToUser} data-userslug={user.username}>{user.name}</Link>
                                        {user.tracks_count > 0 ?
                                        <small>{user.tracks_count} tracks</small>
                                        : <small>No track yet</small>}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    : 
                    <ul>
                        {this.state.lastUsers.map((user,i)=>{
                            return(
                                <li key={i}>
                                    <img className="userAvatar" src={user.avatar ? window.location.origin + user.avatar : window.location.origin + '/img/users/default_avatar.jpg'} />
                                    <div className="searchUserInfo">
                                        <Link to={'/user/'+user.username} onClick={this.closeSearchAndGoToUser} data-userslug={user.username}>{user.name}</Link>
                                        {user.tracks_count > 0 ?
                                        <small>{user.tracks_count} tracks</small>
                                        : <small>No track yet</small>}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    }
                </div> : ''}
            </div>
        )
    }
}
