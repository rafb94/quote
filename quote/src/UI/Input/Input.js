import React from 'react';
import classes from './Input.css';


const input = (props) => {

    return(<input 
        required 
        onChange={props.changed}  
        className={props.leType === "text"?classes.Input: classes.Button} 
        name={props.leName} 
        value={props.leValue} 
        ref={props.leRef}
        type={props.leType}
        placeholder={props.lePlaceholder}/>);
}


export default input