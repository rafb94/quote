import React, {Component} from 'react';
import Aux from '../../hoc/Auxiliar';
import Input from '../../UI/Input/Input';
import fire from '../../fire';
import {connect} from 'react-redux';
import Spinner from '../../UI/Spinner/Spinner';
import Button from '../../UI/Button/Button';
import ButtonSuccess from '../../UI/ButtonSuccess/ButtonSuccess';
import Warning from '../../UI/Warning/Warning';
import axios from 'axios';
import classes from './Customers.css';
import classNames from 'classnames';


class Customers extends Component {

    state={
        newClient: null,
        customers: null,
        showConfirm: false,
        showSuccess: false,
        showDelete: false,
        showSuccessDelete: false,
        showPriceListButton: false,
        deleteOrPriceList: "priceList",
        priceList: null
    }

    componentDidMount() {
        this.retrieveCustomersHandler();
        
    }

    confirmClientDeletedHandler = (cust) => {
        let notUpdatedCustomer = this.state.customers.slice()
        let indexCust = notUpdatedCustomer.indexOf(cust);
        notUpdatedCustomer.splice(indexCust, 1)
        let updatedCustomer= notUpdatedCustomer
        this.setState({showSuccessDelete: cust, showDelete: false, 
        customers : updatedCustomer})

        setTimeout( () => {
            this.setState({showSuccessDelete : false})
        }, 1500)
    }

    deleteClientHandler = (cust) => {
        fire.database().ref('Clientes').child(cust).set(null).then(
            this.confirmClientDeletedHandler(cust)
        );
    }


    retrieveCustomersHandler = () => {
      /*   fire.database().ref('Clientes').once('value').then(response => this.setState({
            customers: Object.keys(response.val())})) */

        axios.get('https://cotizador-92b14.firebaseio.com/Clientes.json' + this.props.queryParams)
        .then(response => this.setState({customers: Object.keys(response.data)}))
    }

    addClientHandler = (event) => {
        event.preventDefault();

        if(this.props.userId){
            
            fire.database().ref('Clientes').child(this.state.newClient).set({
                userId: this.props.userId,
                name: this.state.newClient
            }).then(this.showSuccessHandler(this.state.newClient)).catch(error => console.log(error))

        }else{
            console.log("error")
        }
        
        
    }   

    setClientHandler = (event) => {
        this.setState({newClient: event.target.value})
    }

    setDeleteOrPricelistHandler = (option) => {
        this.setState({deleteOrPriceList: option})
    }

    showConfirmHandler = (event) => {
        event.preventDefault();
        this.setState({showConfirm: true})
        
    }

    showButtonHandler = (cust, deleteOrPriceList) => {
        if(deleteOrPriceList === "priceList"){
            this.setState({showPriceListButton: cust})
        }else if(deleteOrPriceList === "delete"){
            this.setState({showDelete: cust})
        }
       
        
    }

    showSuccessHandler = () => {
        this.setState({showSuccess: true})
        setTimeout( () => {
            this.setState({showSuccess : false})
        }, 1500)

        let newClient = this.state.newClient.slice();
        this.state.customers.push(newClient)
    }

    retrievePricelistHandler = (cust) => {

        fire.database().ref('Clientes').once('value').then(response => {
            let myPriceList = response.val()[cust]
            let myPriceObject = {}
            for (let i in myPriceList){
                myPriceObject[i] = myPriceList[i];
            }
            this.setState({priceList: myPriceObject})
            
        })
    }

    render() {

        /* Retrieve list with current customers  */

        let customers =  this.props.token ? <Button  clicked={this.retrieveCustomersHandler }> 
        Actualizar clientes </Button>: <Warning leDisp="yes"> Ingresar credenciales, por favor.</Warning>;

       if(this.state.customers){
           console.log(this.state.customers)
        customers = this.state.customers.map(cust => 
            <Aux key={cust === "null"? Math.random(): cust}>
                <div style={{display: "block"}}  
                onClick={() => this.showButtonHandler(cust, this.state.deleteOrPriceList)}> {cust}</div> 
                {this.state.showDelete === cust && this.state.deleteOrPriceList === "delete"
                    ? <Warning  clicked={() => this.deleteClientHandler(cust)} leDisp="yes"> 
                Borrar Cliente {cust}? Todos los datos relacionados al cliente serán borrados! </Warning>: null}
                {this.state.showPriceListButton === cust && this.state.deleteOrPriceList === "priceList" 
                    ? <ButtonSuccess clicked={() => this.retrievePricelistHandler(cust)} leCustomer="yes" leClass="disp"> Mostrar lista de precios </ButtonSuccess>: null}
                {this.state.showSuccessDelete === cust ? <ButtonSuccess leClass="disp">Cliente borrado! </ButtonSuccess>: null}
           </Aux>)
       } ; 

       /* Retrieve current customer´s price list */
       let priceList = null;

       if(this.state.priceList){   
        priceList = [];
           for (let i in Object.keys(this.state.priceList)){
                let item = Object.keys(this.state.priceList)[i]
                
               if(!(item === "name" || item === "userId")){
                    priceList.push(
                    <Aux key={Math.random()}>
                        {
                            Object.keys(this.state.priceList[item]).map(date =>
                            <tr className={classes.Row}  key={Math.random()}>
                                <td>{item} <span className={classes.Hide}> .</span></td>
                                <td> {new Intl.DateTimeFormat('en-GB')
                                .format(new Date(parseInt(date)))}<span className={classes.Hide}> .</span></td> 
                                <td>{this.state.priceList[item][date]}<span className={classes.Hide}> .</span></td>
                            </tr>
                        )}
                    </Aux>
                    );         
               }    
           }
       }

      
        return(
            <Aux>
                <div className={this.props.leStyle}> 
                    <h1> Clientes </h1>
                    <h3> En esta sección puede gestionar su base de datos de clientes </h3> 
                    <Warning leDisp="yes" clicked={() => this.setDeleteOrPricelistHandler("delete")}> Borrar clientes? </Warning>
                    <ButtonSuccess leClass="disp" clicked={() => this.setDeleteOrPricelistHandler("priceList")}> Mostrar lista de cotizaciones </ButtonSuccess>
                </div>

                <div className={this.props.leStyle}> 
                    
                    <h3> Clientes: </h3>
                    {customers}
                </div>

                 <div className={priceList? classNames(this.props.leStyle): classes.NoDisplay}>
                    <h2> Lista de Precios </h2>
                    <h3> Cliente: {this.state.showPriceListButton} </h3>
                    <table className={classes.CenterElement}>
                        <thead> 
                            <tr className={classes.Row}>
                                <th> Item <span className={classes.Hide}> .</span></th>
                                <th>Fecha <span className={classes.Hide}> .</span></th>
                                <th> Cotización <span className={classes.Hide}> .</span></th>
                            </tr>
                        </thead>

                        <tbody>
                            {priceList}
                        </tbody>
                    </table>
                    
                </div>

                <div className={this.props.leStyle}> 
                    <h2> Añadir clientes </h2>
                    <form onSubmit={this.addClientHandler}>
                        <Input leType="text" changed={this.setClientHandler}/>
                        <Button clicked={this.showConfirmHandler} >Añadir cliente </Button>
                        {this.state.showConfirm? <Input leValue="Segur@?" leType="submit" /> : null}
                        {this.state.showSuccess? <ButtonSuccess leClass="disp"> Cliente añadido </ButtonSuccess>: null}
                    </form>
                </div>

                
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return{
        token: state.token,
        userId: state.userId,
        queryParams: state.queryParams
    }
}


export default connect(mapStateToProps)(Customers);