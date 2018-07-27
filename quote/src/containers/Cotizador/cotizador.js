import React, { Component } from 'react';
import classes from './cotizador.css';
import Item from '../../components/items/item';
import Cost from '../../components/cost/cost';
import axios from 'axios';



class cotizador extends Component {

    state={
        currentValue: 0,
        cotizaciones: [],
    }

    componentWillUpdate = () => {
        axios.get("https://cotizador-92b14.firebaseio.com/currentItem/currentItem.json")
        .then(response => this.setState({currentValue: response}),
        console.log(this.state.currentValue))
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
            <div className={classes.Main}>
                
                {item}
                <Cost leStyle={classes.Element} myvalue={this.state.currentValue}/> 

                <div className={classes.Element}> 
                    Cotización: <textarea onBlur={this.addQuotationHandler}></textarea> <br/>
                    <p> Margen: {this.state.margin} %</p>
                    <button> Analizar </button> 
                </div>
            
            </div>
        )
    }
    
}

export default cotizador;