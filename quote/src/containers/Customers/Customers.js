import React, {Component} from 'react';
import Aux from '../../hoc/Auxiliar';
import Input from '../../UI/Input/Input';
import fire from '../../fire';
import {connect} from 'react-redux';
import Spinner from '../../UI/Spinner/Spinner';
import Button from '../../UI/Button/Button';
import ButtonSuccess from '../../UI/ButtonSuccess/ButtonSuccess';
import Warning from '../../UI/Warning/Warning';


class Customers extends Component {

    state={
        newClient: null,
        customers: null,
        showConfirm: false,
        showSuccess: false,
        showDelete: false,
        showSuccessDelete: false,

    }

    componentDidMount() {
        console.log(this)
        this.retrieveCustomersHandler();
        
    }

    confirmClientDeletedHandler = (cust) => {
        console.log("confirm")

        let notUpdatedCustomer = this.state.customers.slice()
        let indexCust = notUpdatedCustomer.indexOf(cust);
        notUpdatedCustomer.splice(indexCust, 1)
        let updatedCustomer= notUpdatedCustomer
        console.log(updatedCustomer)
        this.setState({showSuccessDelete: cust, showDelete: false, 
        customers : updatedCustomer})

        setTimeout( () => {
            this.setState({showSuccessDelete : false})
        }, 1500)
    }

    deleteClientHandler = (cust) => {

        console.log(cust)
        fire.database().ref('Clientes').child(cust).set(null).then(
            this.confirmClientDeletedHandler(cust)
        );
    }


    retrieveCustomersHandler = () => {
        fire.database().ref('Clientes').once('value').then(response => this.setState({
            customers: Object.keys(response.val())}))
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

    showConfirmHandler = (event) => {
        event.preventDefault();
        this.setState({showConfirm: true})
        
    }

    showDeleteHandler = (cust) => {
        this.setState({showDelete: cust})
        console.log(this.state.showDelete)
    }

    showSuccessHandler = () => {
        this.setState({showSuccess: true})
        setTimeout( () => {
            this.setState({showSuccess : false})
        }, 1500)

        let newClient = this.state.newClient.slice();
        this.state.customers.push(newClient)
    }

    render() {

        /* Retrieve list with current customers  */

        let customers =  <Spinner />

       if(this.state.customers){
        customers = this.state.customers.map(cust => 
            <Aux key={cust === "null"? cust + Math.random(): cust}>
                <div style={{display: "block"}}  onClick={() => this.showDeleteHandler(cust)}> {cust}</div> 
                {this.state.showDelete === cust? <Warning clicked={() => this.deleteClientHandler(cust)} leDisp="yes"> 
                Borrar Cliente {cust}? Todos los datos relacionados al cliente serán borrados! </Warning>: null}
                {this.state.showSuccessDelete === cust? <ButtonSuccess leClass="disp">Cliente borrado! </ButtonSuccess>: null}
           </Aux>)
       } ; 

        return(
            <Aux>
                <div className={this.props.leStyle}> 
                    <h1> Clientes </h1>
                    <h3> En esta sección puede gestionar su base de datos de clientes </h3> 
                </div>

                <div className={this.props.leStyle}> 
                    <h3> Clientes: </h3>
                    {customers}
                </div>

                <div className={this.props.leStyle}> 
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
        userId: state.userId
    }
}


export default connect(mapStateToProps)(Customers);