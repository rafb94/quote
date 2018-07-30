import React, { Component } from 'react';
import classes from './cotizador.css';
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
        axios.get("https://cotizador-92b14.firebaseio.com/currentItem.json")
        .then(response => this.setState({currentItem : response.data.currentItem}) )
       
    }
   

    
    render() {

        let item = null;

        if (this.props.itemList !== null) {
            item =  <Item 
            leStyle={classes.Element} 
            listClasses={this.props.itemClasses} 
            changed={this.itemChangeHandler}
            changed1={this.itemClassChangeHandler}
            dispItemAdd="Nope"
           />
        }

        return(
            
            <Aux> 
                {item}
                <Cost leStyle={classes.Element} myvalue={this.state.currentItem}/> 

                
            </Aux>
            
            
        )
    }
    
}

export default cotizador;