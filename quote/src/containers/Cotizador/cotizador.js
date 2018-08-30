import React, { Component } from 'react';
import Item from '../../components/items/item';
import Cost from '../../components/cost/cost';
import axios from 'axios';
import Aux from '../../hoc/Auxiliar';



class cotizador extends Component {

    state={
        currentItem: 0,
        cotizaciones: [],
    }

    componentDidUpdate = () => {
        const queryParams = '?auth=' + this.props.token + '&orderBy="userId"&equalTo="' + this.props.userId + '"';

        axios.get("https://cotizador-92b14.firebaseio.com/currentItem.json" + queryParams)
        .then(response => this.setState({currentItem : response.data.currentItem}) )
       
    }
   

    
    render() {

        let item = null;

        if (this.props.itemList !== null) {
            item =  <Item 
            leStyle={this.props.leStyle} 
            listClasses={this.props.itemClasses} 
            changed={this.itemChangeHandler}
            changed1={this.itemClassChangeHandler}
            dispItemAdd="Nope"
           />
        }

        return(
            
            <Aux> 
                <div className={this.props.leStyle}>
                    <h1>Cotizaciones </h1>
                    <h4>Escoja el producto y el proveedor para realizar una cotización. </h4>
                </div>
                {item}
                <Cost leStyle={this.props.leStyle} myvalue={this.state.currentItem}/> 

                
            </Aux>
            
            
        )
    }
    
}

export default cotizador;