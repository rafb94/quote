import React, { Component } from 'react';
import Item from '../../components/items/item';
import Cost from '../../components/cost/cost';
import axios from 'axios';
import Aux from '../../hoc/Auxiliar';
import fire from '../../fire';
import Spinner from '../../UI/Spinner/Spinner';
import {connect} from 'react-redux';
import Button from '../../UI/Button/Button';
import Warning from '../../UI/Warning/Warning';



class cotizador extends Component {

    state={
        currentItem: 0,
        cotizaciones: [],
        customers: null,
        currentCustomer: null,
    }

    componentDidMount = () => {
        

        this.retrieveCustomersHandler();
        console.log(this.state.customers)
       
    }

    retrieveCustomersHandler = () => {

        axios.get("https://cotizador-92b14.firebaseio.com/Clientes.json" + this.props.queryParams)
        .then(response => this.setState({
            customers: Object.keys(response.data)})) 

        /* fire.database().ref('Clientes').once('value').then(response => this.setState({
            customers: Object.keys(response.val())})) */
    }

    setSelectedCustomerHandler = (cust) => {
        this.setState({currentCustomer: cust})
       
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

       /*  Display list of current customers */
       let customers = this.props.token ? <Button  clicked={this.retrieveCustomersHandler }> 
       Actualizar clientes </Button>: <Warning leDisp="yes"> Ingresar credenciales, por favor.</Warning>;

        if(this.state.customers){
            console.log(this.state.customers)
            
            customers = this.state.customers.map(cust => <div style={this.state.currentCustomer === cust? {color: "red"}: {color: "black"}} 
                key={cust} id={cust} 
                onClick={() => this.setSelectedCustomerHandler(cust)}> {cust} </div>)
        }
      

        return(
            
            <Aux> 
                <div className={this.props.leStyle}>
                    <h1>Cotizaciones </h1>
                    <h4>Escoja el producto y el proveedor para realizar una cotización. </h4>
                </div>

                <div className={this.props.leStyle}>
                    <h3>Escoger cliente que recibirá cotización: </h3>
                    {customers}
                </div>

                
                {item}
                <Cost leStyle={this.props.leStyle} myvalue={this.state.currentItem} 
                currentCustomer={this.state.currentCustomer}/> 

                
            </Aux>
            
            
        )
    }
    
}

const mapStateToProps = state => {
    return{
        token: state.token,
        queryParams: state.queryParams
    }
}

export default connect(mapStateToProps)(cotizador);