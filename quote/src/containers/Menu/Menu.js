import React from 'react';
import classes from './Menu.css';
import Logo from '../../components/Logo/Logo';
import SideDrawer from '../../navigation/SideDrawer/SideDrawer';
import Aux from '../../hoc/Auxiliar';


const menu = (props) => {
 

    return(
        <Aux>
            <SideDrawer style={props.showSideDrawer}/>
            <div className={classes.Menu}> 
                <Logo myStyle={classes.MenuLogo}/> 
                <div className={classes.TitleDiv}> <span className={classes.Title}>Cotizador</span> </div>
                <div className={classes.MenuButton} onClick={props.clicked}>  Menu </div>
            </div>
        </Aux>
    )
}


export default menu;