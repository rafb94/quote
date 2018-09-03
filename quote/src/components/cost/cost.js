import React, {Component} from 'react';
import {connect} from 'react-redux'; 
import Spinner from '../../UI/Spinner/Spinner';
import Aux from '../../hoc/Auxiliar';
import classes from './cost.css';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import fire from '../../fire';

class cost extends Component {

    state = {
        prices : null,
        loading: false,
        currentSupplier: null,
        currentPrice: null,
        currentQuotation: null,
        showMargin: false
    }

    addQuotationHandler = () => {
        console.log("hi!");

        fire.database().ref('Clientes')
        .child(this.props.currentCustomer)
        .child(this.props.currentItem)
        .child(new Date().getTime())
        .set(this.state.currentQuotation);
    }

    retrievePricesHandler = ()  => {

        this.setState({loading: true})

        if(this.props.currentClass && this.props.currentItem) {

            fire.database().ref('Productos/' + this.props.currentItem).child('quotations').once('value').then(response =>
                this.setState({prices : response.val(), loading: false}))
        }

        
        
    }

    supplierSelectedHandler = (sup, price) => {
        this.setState({currentSupplier: sup, currentPrice: price})
    }

    analizeQuotationHandler = (event) => {
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

       
        for (let i in this.state.prices){
           if(i === "userId"){
               delete this.state.prices[i] 
           }
        } 

            suppliers = Object.keys(this.state.prices)
            .map(
                sup => <div className={this.state.currentSupplier === sup? classes.SelectedSupplier : null} 
                key={sup} onClick={() => this.supplierSelectedHandler(sup, this.state.prices[sup])}> 
                {sup}: {this.state.prices[sup]}
                </div>)
       }



        /*  Retrieve the current active item class from redux */
        let currentClass = null;
    
        if (this.props.currentClass !== undefined){
            currentClass = this.props.currentClass
        
        }

        /*  Retrieve the current active item from redux */
        let currentItem = null;

        if (this.props.currentItem !== null && this.props.currentItem !== undefined){
            currentItem = this.props.currentItem
        }


        /* Show loading spinner or actual data (supplier prices) */

        let priceList = (
        <Aux>
            <div style={{textAlign: "center"}}> {suppliers} </div>
            <Button clicked={this.retrievePricesHandler}> Actualizar Precios </Button>
        </Aux>
    )

        if (this.state.loading && this.props.currentClass){
            priceList = <Spinner />
        }
        

        return(
        <Aux>
            <div className={this.props.leStyle}>
                <h3 style={{color: "#01015B"}}>Precio Proveedor: {currentItem} {currentClass}</h3>
                    {priceList}
            </div>

            
            <div className={this.props.leStyle}> 
                    Cotización: <Input changed={this.analizeQuotationHandler}/> <br/>
                    <p> Margen: {this.state.showMargin? (((this.state.currentQuotation /this.state.currentPrice) - 1) * 100).toFixed(2) : null} %</p>
                    <Button clicked={this.showMarginHandler}> Analizar </Button> 
                    <Button clicked={this.addQuotationHandler}> Añadir cotización</Button> 
            </div>
        </Aux>
       
        
        )
    }
}

const mapStateToProps = state =>{
    return{
        currentItem: state.currentItem,
        currentClass: state.currentClass
    }
}

export default connect(mapStateToProps)(cost);