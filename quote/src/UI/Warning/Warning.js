import React from 'react';
import classes from './Warning.css';

const warning = (props) => {
    return(<div 
        className={props.leDisp? classes.Warning: classes.NoDisp} onClick={props.clicked}> {props.children} </div>)
}

export default warning;