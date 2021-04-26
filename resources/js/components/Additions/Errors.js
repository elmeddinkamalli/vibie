import React, { useEffect } from 'react'
import { BsExclamationCircle, BsX } from 'react-icons/bs'

export const Errors = (props) => {
    useEffect(() => {
        var lists = document.querySelectorAll('li.errList');
        if(lists.length){
            setTimeout(()=>{
                for (let i = 0; i < lists.length; i++) {
                    fadeOut(lists[i]);
                }
            }, 6000)
        }
    })
    function fadeOut(element){
        element.style.opacity = 0
        setTimeout(() => {
            element.remove();
        }, 400);
    }
    const styleDiv = {
        position: 'fixed',
        bottom: '50px',
        left: '40px',
        zIndex: 250,
        transition: '1s',
    }
    const styleUl = {
        listStyleType: 'none'
    }
    const styleP = {
        display: 'inline-block',
        color: '#000',
        background: '#ffb100',
        borderRadius: '20px',
        padding: '3px 5px',
        boxShadow: 'rgb(0 0 0) 1px 1px 20px 2px'
    }
    const styleLi = {
        margin: '10px 0',
        transition: '.4s'
    }
    const styleSvg = {
        marginRight: '5px',
        color: '#ff0000',
        fontSize: '20px',
        transition: 'opacity .5s'
    }
    return (
        <div style={styleDiv} className={props.errors ? 'fadeIn' : ''}>
            {props.errors ?
            <ul style={styleUl}>
                    {props.errors.map(function(error,i){
                        return (
                            <li style={styleLi} key={i} className="errList" >
                                <p style={styleP}><BsExclamationCircle style={styleSvg} />{error} <BsX style={{cursor: 'pointer'}} onClick={(e)=>{e.target.closest('li').remove()}} /></p>
                            </li>
                        )
                    })}
            </ul>: ''}
        </div>
    )
}
