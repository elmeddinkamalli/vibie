import React from 'react'
import CircleLoader from 'react-spinners/CircleLoader'

export const Loading = (props) => {
    const style = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 250,
        background: 'rgba(0,0,0,0.7)',
        padding: '30px',
        display: props.loading ? 'block' : 'none'
    }
    return (
        <div style={style}>
            <CircleLoader color="#ff1744" />
        </div>
    )
}

export default Loading;

