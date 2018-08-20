import React, {Component} from 'react';
import classes from './Menu.css';
import SideDrawer from '../../navigation/SideDrawer/SideDrawer';
import Aux from '../../hoc/Auxiliar';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';


class Menu extends Component {
 
   
    render() {
        
        return(
        <Aux>
            <SideDrawer style={this.props.showSideDrawer}/>
            <div className={classes.Menu}> 
                <div className={classes.TitleDiv}> <span className={classes.Title}>Cotizador</span> </div>
                <div className={classes.MenuButton} onClick={this.props.clicked}>  Menu </div>
                {this.props.token? <div className={classes.MenuButton} onClick={this.props.onLogout}>  Log out </div> : null} 
            </div>
        </Aux>
    )
    }
}

const mapStateToProps = state => {
    return{
        token: state.token
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        onLogout:() => dispatch(actions.onLogout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);