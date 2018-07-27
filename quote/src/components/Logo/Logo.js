import React from 'react';
import westfalenLogo from '../../assets/img/logo.png'

const logo = (props) => {

    return(
        <img className={props.myStyle} src={westfalenLogo} alt="Logo"/>
    )
}

export default logo;