import React from 'react'

export default function Die(props){
    return (
        <h2 
            onClick={props.onClick}
            className={props.locked ? 
                "die locked" : "die"}
            >{props.value}</h2> 
    )
}

