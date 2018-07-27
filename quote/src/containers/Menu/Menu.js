import React from 'react';
import classes from './Menu.css';
import Logo from '../../components/Logo/Logo';
import SideDrawer from '../../navigation/SideDrawer/SideDrawer';
import Aux from '../../hoc/Aux';


const menu = (props) => {
 

    return(
        <Aux>
            {props.showSideDrawer? <SideDrawer style={props.showSideDrawer}/> : null}
            <div className={classes.Menu}> 
                <Logo myStyle={classes.MenuLogo}/> 
                <div className={classes.TitleDiv}> <span className={classes.Title}>Cotizador</span> </div>
                <div className={classes.MenuButton} > <button onClick={props.clicked}> Menu </button> </div>
            </div>
        </Aux>
    )
}


export default menu;