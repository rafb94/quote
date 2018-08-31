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
import fire from './fire';
import Customers from './containers/Customers/Customers';


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
    return (
      <BrowserRouter>
        <Aux>
          <Menu showSideDrawer={this.state.showSideDrawer} />
          <Route path="/cotizador" exact render={(routeProps) =>  <Cotizador {...routeProps} leStyle={classes.Element} costList={this.state.cost}/>}/>
          <Route path="/clientes" exact render={(routeProps) =>  <Customers {...routeProps} leStyle={classes.Element}/>}/>
          <Route path="/productos" exact render={(routeProps) =>  <NewItems {...routeProps} leStyle={classes.Element} />}/>
          <Route path="/proveedores" exact render={(routeProps) =>  <Suppliers {...routeProps} leStyle={classes.Element}  />}/>
          <Route path="/categorias" exact render={(routeProps) =>  <Categories {...routeProps} leStyle={classes.Element}/>}/>
          <Route path="/" exact render={(routeProps) =>  <Auth {...routeProps} leStyle={classes.Element}/>}/>
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
