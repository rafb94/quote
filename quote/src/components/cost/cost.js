import React, {Component} from 'react';
import {connect} from 'react-redux'; 
import Spinner from '../../UI/Spinner/Spinner';
import Aux from '../../hoc/Auxiliar';
import classes from './cost.css';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import fire from '../../fire';
import classNames from 'classnames';
import Warning from '../../UI/Warning/Warning';
import ButtonSuccess from '../../UI/ButtonSuccess/ButtonSuccess';

class cost extends Component {

    state = {
        prices : null,
        loading: false,
        currentSupplier: null,
        currentPrice: null,
        currentQuotation: null,
        showMargin: false,
        showWarning: false,
        showSuccess: false
    }

    addQuotationHandler = () => {

        if(this.props.currentCustomer){
            fire.database().ref(this.props.userId)
            .child('Clientes')
            .child(this.props.currentCustomer)
            .child(this.props.currentItem)
            .child(new Date().getTime())
            .set(this.state.currentQuotation)
            .then(this.showSuccessHandler())
        }else{
            this.showWarningHandler()
        }
    }

    retrievePricesHandler = ()  => {

        this.setState({loading: true})

        

            fire.database().ref(this.props.userId)
            .child('Productos/' + this.props.currentItem)
            .child('quotations').once('value').then(response =>{
                if(response.val()){
                    this.setState({prices : response.val(), loading: false})
                }else{
                    this.setState({prices : ["No se han registrado precios todavía"], loading: false})
                }
               
            })    
    }

    showWarningHandler = () => {
        this.setState({showWarning: true})

        setTimeout(() => {
            this.setState({showWarning: false})
        }, 1500)
    }

    showSuccessHandler = () => {
        this.setState({showSuccess: true})

        setTimeout(() => {
            this.setState({showSuccess: false})
        }, 1500)
    }

    supplierSelectedHandler = (sup, price, date) => {
        this.setState({currentSupplier: sup, currentPrice: price, currentQuotationDate: date})
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

       let suppliers = [];

       if (this.state.prices && this.state.prices[0] != "No se han registrado precios todavía"){
           let mysuppliers = [];
           console.log(this.state.prices)
            for (let i in this.state.prices){
                if(i !== "userId"){
                    mysuppliers.push(i)

                    for (let y in this.state.prices[i]){
                        suppliers.push(
                            <tr 
                            className={
                            classNames(this.state.currentSupplier === i 
                                && this.state.currentQuotationDate  === parseInt(y, 10)? classes.SelectedSupplier : null,
                                classes.Row)} 
                            key={parseInt(y, 10)} 
                            onClick={() => this.supplierSelectedHandler(i, this.state.prices[i][y], parseInt(y, 10))}> 
                                <td>{i}</td> 
                                <td> {new Intl.DateTimeFormat('en-GB')
                                .format(new Date(parseInt(y, 10)))}</td>
                                <td> {this.state.prices[i][y]}</td>
                            </tr>   
                        )                        
                    }
                }
            }
       }else{
           suppliers = ( 
            <tr> 
                <td> Añadir precios o</td> 
                <td> Escoger categoría y</td> 
                <td>escoger cliente</td> 
            </tr>   )
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

        let quotationsList = null;

        if (this.state.prices){
            quotationsList = (
                <Aux>
                    <h2> Lista de Cotizaciones </h2>
                    <h3> Cliente: {this.state.showPriceListButton} </h3>
                    <div className={classes.tableContainer}>
                        <table className={classes.CenterElement}>
                            <thead> 
                                <tr className={classes.Row}>
                                    <th> Proveedor <span className={classes.Hide}> .</span></th>
                                    <th>Fecha <span className={classes.Hide}> .</span></th>
                                    <th> Cotización <span className={classes.Hide}> .</span></th>
                                </tr>
                            </thead>
            
                            <tbody>
                                {suppliers} 
                            </tbody>
                        </table>
                    </div>
                </Aux>
            )
        }

        if (this.state.loading && this.props.currentClass){
            quotationsList = <Spinner />
        }
        

        return(
        <Aux>
            <div className={this.props.leStyle}>
                <h3 style={{color: "#01015B"}}>Precio Proveedor: {currentItem} {currentClass}</h3>
                    {quotationsList}
                    <Button clicked={this.retrievePricesHandler}> Actualizar Precios </Button>
            </div>

            
            <div className={this.props.leStyle}> 
                    Cotización: <Input changed={this.analizeQuotationHandler}/> <br/>
                    <p> Margen: 
                        {this.state.showMargin? 
                        (((this.state.currentQuotation /this.state.currentPrice) - 1) * 100).toFixed(2) : null} %
                    </p>
                    {this.state.showWarning? <Warning leDisp="yes"> Escoge un cliente, por favor </Warning>: null}
                    {this.state.showSuccess? <ButtonSuccess leClass="yes"> Cotización añadida! </ButtonSuccess>: null}
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