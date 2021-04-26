import React, { Component } from 'react'
import { BiX } from 'react-icons/bi'

export default class Follows extends Component {
    constructor(props){
        super(props);
        this.state = {
            users: null,
            isMonth: true
        }
    }

    componentDidMount(){
        if(this.state.isMonth){
            this.props.setLoading(true);
            axios.get(`api/${this.props.direction.toLowerCase()}/${this.props.user_id}`)
            .then((res)=>{
                this.setState({
                    users: res.data
                })
                this.props.setLoading(false);
            })
            .catch((err)=>{
                this.props.setLoading(false);
            })
        }
    }

    render() {
        return (
            <div className="grayed-bg active">
                <div className="shareOvrly active">
                    <div className="heading">
                        <h5>{this.props.direction}</h5>
                        <BiX onClick={(e)=>{this.props.setShareOverlay(null)}} />
                    </div>
                    {this.state.users ? 
                        <div className="followersFollowings">
                            <ul>
                                {this.state.users.map((user,i)=>{
                                    return(
                                        <li key={i}>{user.username}</li>
                                    )
                                })}
                            </ul>
                        </div>
                    : ''}
                </div>
            </div>
        )
    }
}
