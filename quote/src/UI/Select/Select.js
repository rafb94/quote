import React from 'react';
import classes from './Select.css';

const select = (props) => {
    return(
        <select onClick={props.clicked} onChange={props.changed} className={classes.Select} defaultValue={props.default}> {props.children} </select>
    )
}

export default select;