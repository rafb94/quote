import React from 'react';
import classes from './Menu.css';
import SideDrawer from '../../navigation/SideDrawer/SideDrawer';
import Aux from '../../hoc/Auxiliar';


const menu = (props) => {
 

    return(
        <Aux>
            <SideDrawer style={props.showSideDrawer}/>
            <div className={classes.Menu}> 
                <div className={classes.TitleDiv}> <span className={classes.Title}>Cotizador</span> </div>
                <div className={classes.MenuButton} onClick={props.clicked}>  Menu </div>
            </div>
        </Aux>
    )
}


export default menu;