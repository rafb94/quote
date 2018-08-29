import React, {Component} from 'react';
import classes from './SideDrawer.css'
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import Aux from '../../hoc/Auxiliar';

class SideDrawer extends Component{

    render(){

        let loggedinLinks = (
            <Aux>
                <Link  className={classes.Link} to="/categorias"> <div onClick={this.props.onChange}>Categorías de Producto</div></Link>
                <Link className={classes.Link} to="/"> <div onClick={this.props.onChange}> Cotizador </div> </Link>
                <Link  className={classes.Link} to="/productos"> <div onClick={this.props.onChange}> Productos </div> </Link>
                <Link  className={classes.Link} to="/proveedores"> <div onClick={this.props.onChange}>Proveedores </div> </Link>
            </Aux>
        )

        return(
            <nav className={this.props.style ? classes.SideDrawer : classes.SideDrawerHide}>
                <Link  className={classes.Link} to="/auth"> <div onClick={this.props.onChange}>Log In </div></Link>
                {this.props.token? loggedinLinks : null}
                
               
               
        </nav>
        )
    }
}



const mapStateToProps = state => {
    return{
        token: state.token
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onChange: () => dispatch(actions.toggleSideDrawer())
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideDrawer);