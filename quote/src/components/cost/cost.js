import React, {Component} from 'react';
import {connect} from 'react-redux'; 
import axios from 'axios';
import Spinner from '../../UI/Spinner/Spinner';
import Aux from '../../hoc/Auxiliar';
import classes from './cost.css';

class cost extends Component {

    state = {
        prices : null,
        loading: false,
        currentSupplier: null,
        currentPrice: null,
        currentQuotation: null,
        showMargin: false
    }

    updatePriceHandler = ()  => {

        this.setState({loading: true})

        if(this.props.currentClass.currentClass && this.props.currentItem.currentItem) {
            axios.get('https://cotizador-92b14.firebaseio.com/itemPrices/' + this.props.currentClass.currentClass 
            + "/" + this.props.currentItem.currentItem + ".json")
            .then(response => 
            this.setState({prices : response.data, loading: false}, console.log(response)));
        }
        
    }

    supplierSelectedHandler = (sup, price) => {
        this.setState({currentSupplier: sup, currentPrice: price})
    }

    addQuotationHandler = (event) => {
        this.setState({currentQuotation: event.target.value})
        console.log(event.target.value)
    }

    showMarginHandler = () => {
        let showMargin = !this.state.showMargin
        this.setState({showMargin : showMargin})
    }

    render(){

       /*  Retrieve list of suppliers that quoted the product */

       let suppliers = null;

       if (this.state.prices !== null){

            suppliers = Object.keys(this.state.prices)
            .map(
                sup => <li className={this.state.currentSupplier === sup? classes.SelectedSupplier : null} 
                key={sup} onClick={() => this.supplierSelectedHandler(sup, this.state.prices[sup])}> 
                {sup}: {this.state.prices[sup]}
                </li>)
       }



        /*  Retrieve the current active item class from redux */
        let currentClass = null;
    
        if (this.props.currentClass !== undefined){
            currentClass = this.props.currentClass.currentClass
        
        }

        /*  Retrieve the current active item from redux */
        let currentItem = null;

        if (this.props.currentItem !== null && this.props.currentItem !== undefined){
            currentItem = this.props.currentItem.currentItem
        }


        /* Show loading spinner or actual data (supplier prices) */

        let priceList = (
        <Aux>
            <ul style={{textAlign: "left"}}> {suppliers} </ul>
            <button onClick={this.updatePriceHandler}> Actualizar Precios </button>
        </Aux>
    )

        if (this.state.loading){
            priceList = <Spinner />
        }
        

        return(
        <Aux>
            <div className={this.props.leStyle}>
                <div >Precio Proveedor: {currentItem} {currentClass}</div>
                    {priceList}
            </div>

            
            <div className={this.props.leStyle}> 
                    Cotización: <input onChange={this.addQuotationHandler}/> <br/>
                    <p> Margen: {this.state.showMargin? ((this.state.currentQuotation /this.state.currentPrice) - 1) * 100 : null} %</p>
                    <button onClick={this.showMarginHandler}> Analizar </button> 
            </div>
        </Aux>
       
        
        )
    }
}

const mapStateToProps = state =>{
    return{
        currentItem: state,
        currentClass: state
    }
}

export default connect(mapStateToProps)(cost);