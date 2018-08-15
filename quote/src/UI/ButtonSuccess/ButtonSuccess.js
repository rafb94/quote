import React from 'react';
import classes from './ButtonSuccess.css';

const buttonSuccess = (props) => {
    return(
        <button onClick={props.clicked} className={props.leClass? classes.ButtonSuccess: classes.NoDisplay}> {props.children} </button>
    )
}

export default buttonSuccess;