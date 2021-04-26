import React from 'react'
import { AiOutlineHome } from "react-icons/ai";
import { Link } from 'react-router-dom'
import { BsImages, BsLayers, BsCardText, BsFileRichtext, BsPeople, BsCollectionPlay } from "react-icons/bs";

const LeftAside = (props) => {
    return (
        <aside className={`leftAside ${props.menu ? 'active' : ''}`}>
            <ul>
                <li className="active">
                <AiOutlineHome /> <Link to="/">Home</Link>
                </li>
                <li>
                <BsLayers /> <Link to="/genres">Categories</Link>
                </li>
                <li>
                <BsCollectionPlay /> <Link to="/albums">Albums</Link>
                </li>
                <li>
                <BsImages /> <Link to="/gallery">Gallery</Link>
                </li>
                <li>
                <BsFileRichtext /> <Link to="/blogs">Blogs</Link>
                </li>
                <li>
                <BsPeople /> <Link to="/users">Publishers</Link>
                </li>
            </ul>
        </aside>
    )
}

export default LeftAside
