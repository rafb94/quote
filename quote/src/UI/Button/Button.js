import React from 'react';
import classes from './Button.css';

const button = (props) => {
    return(
        <button onClick={props.clicked} className={props.noDisp? classes.NoDisp : classes.Button}> {props.children} </button>
    )
}

export default button;