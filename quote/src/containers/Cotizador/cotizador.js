import React, { Component } from 'react';
import classes from './cotizador.css';
import Item from '../../components/items/item';
import Cost from '../../components/cost/cost';
import axios from 'axios';
import Aux from '../../hoc/Auxiliar';



class cotizador extends Component {

    state={
        currentValue: 0,
        cotizaciones: [],
    }

    
    componentDidMount = () => {
        axios.get("https://cotizador-92b14.firebaseio.com/itemPrices.json")
        .then(response => console.log(response.data["Reactivos Frios"]["B-56"]["Dragon"]) )
        
    }

    componentWillMount = () => {
        axios.get("https://cotizador-92b14.firebaseio.com/currentItem/currentItem.json")
        .then(response => console.log(response.data) )
       
    }
   

    
    render() {

        let item = null;

        if (this.props.itemList !== null) {
            item =  <Item 
            leStyle={classes.Element} 
            listClasses={this.props.itemClasses} 
            changed={this.itemChangeHandler}
            changed1={this.itemClassChangeHandler}
           />
        }

        return(
            
            <Aux> 
                {item}
                <Cost leStyle={classes.Element} myvalue={this.state.currentValue}/> 

                <div className={classes.Element}> 
                    Cotización: <textarea onBlur={this.addQuotationHandler}></textarea> <br/>
                    <p> Margen: {this.state.margin} %</p>
                    <button> Analizar </button> 
                </div>
            </Aux>
            
            
        )
    }
    
}

export default cotizador;