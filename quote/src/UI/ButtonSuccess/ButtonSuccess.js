import React from 'react';
import classes from './ButtonSuccess.css';

const buttonSuccess = (props) => {
    return(
        <button onClick={props.clicked} className={classes.ButtonSuccess}> {props.children} </button>
    )
}

export default buttonSuccess;