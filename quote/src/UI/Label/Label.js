import React from 'react';
import classes from './Label.css';

const label = (props) => {
    return(
        <label className={classes.Label}> {props.children} </label>
    )
}

export default label;