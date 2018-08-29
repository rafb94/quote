import React, { Component } from 'react';
import Cotizador from './containers/Cotizador/cotizador';
import {connect} from 'react-redux';
import './App.css';
import Menu from './containers/Menu/Menu'
import Aux from './hoc/Auxiliar';
import {  BrowserRouter, Route } from 'react-router-dom';
import NewItems from './containers/NewItems/NewItems';
import Suppliers from './containers/Suppliers/Suppliers';
import Auth from './containers/Auth/Auth';
import Categories from './containers/Categories/Categories';
import classes from './App.css';
import * as actions from './store/actions/index';


class App extends Component {

  state={
    showSideDrawer: false,
    }

  
  componentDidMount() {
    this.props.onTryAutoSignUp();
  }

  showSideDrawerHandler = () => {
    this.setState({showSideDrawer: !this.state.showSideDrawer})
  }

 
  render() {    
    return (
      <BrowserRouter>
        <Aux>
          <Menu showSideDrawer={this.state.showSideDrawer} clicked={this.showSideDrawerHandler}/>
          <Route path="/" exact render={() =>  <Cotizador leStyle={classes.Element} costList={this.state.cost}/>}/>
          <Route path="/productos" exact render={() =>  <NewItems leStyle={classes.Element} />}/>
          <Route path="/proveedores" exact render={() =>  <Suppliers leStyle={classes.Element}  />}/>
          <Route path="/auth" exact render={() =>  <Auth leStyle={classes.Element}/>}/>
          <Route path="/categorias" exact render={() =>  <Categories leStyle={classes.Element}/>}/>
        </Aux>
      </BrowserRouter>
    );
  }
  
}

const mapDisaptchToProps = dispatch => {
  return{
    onTryAutoSignUp: () => dispatch(actions.authCheckState())
  }
}

export default connect(null, mapDisaptchToProps)(App);
