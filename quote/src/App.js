import React, { Component } from 'react';
import Cotizador from './containers/Cotizador/cotizador';
import './App.css';
import Menu from './containers/Menu/Menu'
import Aux from './hoc/Auxiliar';
import {  BrowserRouter, Route } from 'react-router-dom';
import NewItems from './containers/NewItems/NewItems';
import Suppliers from './containers/Suppliers/Suppliers';


class App extends Component {

  state={
    showSideDrawer: false,
    }


  showSideDrawerHandler = () => {
    this.setState({showSideDrawer: !this.state.showSideDrawer})
  }

 
  render() {    
    return (
      <BrowserRouter>
        <Aux>
          <Menu showSideDrawer={this.state.showSideDrawer} clicked={this.showSideDrawerHandler}/>
          <Route path="/" exact render={() =>  <Cotizador costList={this.state.cost}/>}/>
          <Route path="/productos" exact render={() =>  <NewItems />}/>
          <Route path="/proveedores" exact render={() =>  <Suppliers />}/>
        </Aux>
      </BrowserRouter>
    );
  }
  
}

export default App;
