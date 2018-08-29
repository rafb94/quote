import React from 'react';
import classes from './SideDrawer.css'
import { Link } from 'react-router-dom';

const sideDrawer = (props) => { 


    return(
        <nav className={props.style ? classes.SideDrawer : classes.SideDrawerHide}>
                <Link className={classes.Link} to="/"> Cotizador </Link>
                <Link  className={classes.Link} to="/productos"> Productos</Link>
                <Link  className={classes.Link} to="/proveedores"> Proveedores </Link>
                <Link  className={classes.Link} to="/auth"> Log In </Link>
                <Link  className={classes.Link} to="/categorias"> Categorías de Producto</Link>
        </nav>
    )
}

export default sideDrawer;