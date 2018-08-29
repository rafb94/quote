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
            <SideDrawer style={this.props.show}/>
            <div className={classes.Menu}> 
                <div className={classes.TitleDiv}> <span className={classes.Title}>Cotizador</span> </div>
                <div className={classes.MenuButton} onClick={this.props.onChange}>  Menu </div>
                {this.props.token? <div className={classes.MenuButton} onClick={this.props.onLogout}>  Log out </div> : null} 
            </div>
        </Aux>
    )
    }
}

const mapStateToProps = state => {
    return{
        token: state.token,
        show: state.showSideDrawer
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        onLogout:() => dispatch(actions.onLogout()),
        onChange: () => dispatch(actions.toggleSideDrawer())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);