import React, { Component } from 'react';
import classes from './App.css';
import {connect} from 'react-redux';
import * as actions from './store/actions/index';
import fire from './fire';
import {  BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Aux from './hoc/Auxiliar';
import asyncComponent from './hoc/AsyncComponent';

import Menu from './containers/Menu/Menu'
import Auth from './containers/Auth/Auth';


const AsyncNewItems = asyncComponent( () =>{
    return import('./containers/NewItems/NewItems')
})

const AsyncSuppliers  = asyncComponent( () =>{
  return import('./containers/Suppliers/Suppliers')
})

const AsyncCategories = asyncComponent( () =>{
  return import('./containers/Categories/Categories')
})

const AsyncCotizador = asyncComponent( () =>{
  return import('./containers/Cotizador/cotizador')
})

const AsyncCustomers = asyncComponent( () =>{
  return import('./containers/Customers/Customers')
})


class App extends Component {

  state={
    showSideDrawer: false,
    }

  
  componentDidMount() {
    this.props.onTryAutoSignUp();
    fire.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser){
        console.log(firebaseUser)
      }else{
        console.log("not logged in!")
      }
    })
  }

 
 
  render() {   
    
    let routes = null;

    if(this.props.token){
      routes = (
        <Aux>
          <Route path="/cotizador" exact render={(routeProps) =>  <AsyncCotizador {...routeProps} leStyle={classes.Element} costList={this.state.cost}/>}/>
          <Route path="/clientes" exact render={(routeProps) =>  <AsyncCustomers {...routeProps} leStyle={classes.Element}/>}/>
          <Route path="/productos" exact render={(routeProps) =>  <AsyncNewItems {...routeProps} leStyle={classes.Element} />}/>
          <Route path="/proveedores" exact render={(routeProps) =>  <AsyncSuppliers {...routeProps} leStyle={classes.Element}  />}/>
          <Route path="/categorias" exact render={(routeProps) =>  <AsyncCategories {...routeProps} leStyle={classes.Element}/>}/>
          <Route path="/" exact render={(routeProps) =>  <Auth {...routeProps} leStyle={classes.Element}/>}/>
        </Aux>
      )}else{
        routes =  <Route path="/" render={(routeProps) =>  <Auth {...routeProps} leStyle={classes.Element}/>}/>
      }
    
    return (
      <BrowserRouter>
        <Aux>
          <Menu showSideDrawer={this.state.showSideDrawer} />
          {routes}
        </Aux>
      </BrowserRouter>
    );
  }
  
}

const mapStateToProps = state =>{
  return{
    token: state.token
  }
}

const mapDisaptchToProps = dispatch => {
  return{
    onTryAutoSignUp: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDisaptchToProps)(App);
