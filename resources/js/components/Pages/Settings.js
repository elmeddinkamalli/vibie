import React, { Component } from 'react'
import axios, {put,post} from 'axios'
import { BiSave, BiX } from 'react-icons/bi'
import Loading from '../Additions/Loading';
import InitializeData from '../Helper/InitializeData';
import Cropper from 'cropperjs'
import { Errors } from '../Additions/Errors';
import "cropperjs/dist/cropper.css";

export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMount: true,
            errors: null,
            avatar: null,
            openCropper: false,
            cropperjs: null
        }
        this.submitForm = this.submitForm.bind(this);
        this.showPreview = this.showPreview.bind(this);
        this.setReader = this.setReader.bind(this);
        this.openCropper = this.openCropper.bind(this);
        this.showCroppedImage = this.showCroppedImage.bind(this);
        this.closeCropper = this.closeCropper.bind(this);
    }

    componentDidMount(){
        if(this.state.isMount){
            this.props.setLoading(true);
            InitializeData(this.props.setCurrentPlaylist, 
                this.props.currentPlaylist, 
                this.props.setCurrentTrack, 
                this.props.currentTrack)
            this.props.setLoading(false);
        }
    }

    componentWillUnmount(){
        this.setState({
            isMount: false,
        })
    }

    setReader(file, _this=this){
        let reader = new FileReader();
        reader.addEventListener("load", function(){
            _this.setState({
                openCropper: true
            }, ()=>{
                document.getElementById('preview').setAttribute('src', this.result);
                return _this.openCropper();
            })
        });
        reader.readAsDataURL(file)
    }

    showPreview(e){
        const file = e.target.files[0];
        if(file){
            const fileType = e.target.files[0].type;
            if(fileType === 'image/png' || fileType === 'image/jpg' || fileType === 'image/jpeg'){
                this.setReader(file)         
            }else{
                e.target.value = null;
                this.setState({
                    avatar: null,
                    errors: ["The profile picture must be a file of type jpg, jpeg, png."]
                });
            }
        }
    }

    openCropper(){
        let image = document.getElementById('preview');
        this.state.cropperjs = new Cropper(image, {
            aspectRatio: 1 / 1,
            rounded: true
        });
    }

    showCroppedImage(e, _this=this){
        var canvas = this.state.cropperjs.getCroppedCanvas({
            width: 200,
            height: 200
        });
        canvas.toBlob(function (blob) {
            var url = URL.createObjectURL(blob);
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function(){
                var base64data = reader.result;
                _this.setState({
                    avatar: base64data
                })
                document.getElementById('currAvatar').setAttribute('src', base64data);
                _this.closeCropper();
            }
        })
    }

    closeCropper(){
        this.state.cropperjs.destroy();
        this.setState({
            openCropper: false
        })
    }

    submitForm(e){
        e.preventDefault();
        if(!this.props.loading){
            this.props.setLoading(true);
            this.setState({
                errors: null
            });
            const formData = new FormData();
            if(this.state.avatar){
                formData.append('avatar', this.state.avatar);
            }
            formData.append('name', document.getElementById('name').value);
            formData.append('username', document.getElementById('username').value);
            formData.append('about', document.getElementById('about').value);
            formData.append('email', document.getElementById('email').value);
            formData.append('phone_number', document.getElementById('phone_number').value);
            formData.append('adress', document.getElementById('adress').value);
            formData.append('_token', document.getElementById('csrf_token').getAttribute('content'));
            formData.append("_method", "put");
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                    'X-CSRF-TOKEN': document.getElementById('csrf_token').getAttribute('content'),
                },
            }

            post('api/user/update',formData,config)
            .then(res=>{
                if(res.status===200 && res.data === 'updated'){
                    this.props.setLoading(false);
                    window.location.reload();
                }else{
                    this.props.setLoading(false);
                    this.setState({
                        errors: ["Something went wrong, please refresh the page and try again."]
                    })
                }
            })
            .catch(err=>{
                if(err.response.status === 422){
                    let errors = Object.keys(err.response.data.errors).map((key)=>{
                        if(err.response.data.errors[key].length){
                            return err.response.data.errors[key].map((error)=>{
                                return error;
                            });
                        }else{
                            return err.response.data.errors[key];
                        }
                    }).flat();
                    this.setState({
                        errors: errors,
                    });
                }
                this.props.setLoading(false);
            })
        }
    }

    render() {
        return (
            <div className="mainWrapper">
                <Loading loading={this.props.loading} />
                {this.state.errors ? <Errors errors={this.state.errors} /> : ''}
                <section className="userSection settings">
                {this.props.user ?
                <div className="userSectionTopWrapper">
                    <div className="userSectionFirstInf">
                        <img id="currAvatar" src={this.props.user.avatar ? window.location.origin + this.props.user.avatar : window.location.origin + '/img/users/default_avatar.jpg'} />
                        <input type="file" accept="image/*" style={{display:'none'}} id="profilePic" onChange={this.showPreview} />
                        <button className="changeAvatarBtn" onClick={()=>{document.getElementById('profilePic').click()}}>Change avatar</button>
                        <label htmlFor="name">Full-name</label>
                        <input type="text" id="name" name="name" defaultValue={this.props.user.name}/>
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" defaultValue={this.props.user.username}/>
                        <label htmlFor="about">About me</label>
                        <input type="text" id="about" name="about" defaultValue={this.props.user.about}/>
                        <div className="userButtons">
                            <button className="saveBtn" onClick={this.submitForm}><BiSave />Save</button>
                        </div>
                    </div>
                    <div className="userSectionSecInfTable settingsInf">
                        <table>
                            <tbody>
                            <tr className="heading">
                                <th><h5>Official informations</h5></th>
                                <th></th>
                                <th></th>
                            </tr>
                            <tr className="settingsOffInfBl">
                                <td>
                                    <div className="infoBlock">
                                        <h4>Email</h4>
                                        <input id="email" name="email" defaultValue={this.props.user.email}/>
                                    </div>
                                </td>
                                <td>
                                    <div className="infoBlock">
                                        <h4>Phone Number</h4>
                                        <input id="phone_number" name="phone_number" defaultValue={this.props.user.phone_number}/>
                                    </div>
                                </td>
                                <td>
                                    <div className="infoBlock">
                                        <h4>Adress</h4>
                                        <input id="adress" name="adress" defaultValue={this.props.user.adress}/>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div> : ''}
                </section>
                {this.state.openCropper ? 
                <div className="grayed-bg active">
                    <div className="avatar_prev active" style={{height: '350px', display: 'block'}}>
                        <div className="heading">
                            <h5>Crop image</h5>
                            <BiX onClick={this.closeCropper} />
                        </div>
                        <img style={{display: 'none'}} id="preview" />
                        <div className="footer">
                            <button onClick={this.showCroppedImage}>CROP</button>
                        </div>
                    </div>
                </div>: ''}
            </div>
        )
    }
}
