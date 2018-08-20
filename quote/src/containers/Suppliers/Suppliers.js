import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import Spinner from '../../UI/Spinner/Spinner';
import classes from './Suppliers.css';
import fire from '../../fire';
import Button from '../../UI/Button/Button';
import ButtonSuccess from '../../UI/ButtonSuccess/ButtonSuccess';
import Input from '../../UI/Input/Input';


class Suppliers extends Component {

    state={
        newSupplier: null,
        showAddSupplierButton: false,
        suppliers: [],
        deletedSupplier: null,
        showWarning: false,
        showSuccess: false
    }

    componentWillMount () {
        
        this.retrieveSuppliersHandler();
        
    }
    
    retrieveSuppliersHandler = () => {
        let responseArray = [];

        const myLoop = (response) => {
            for(let i = 0; i < Object.keys(response).length; i++){
                responseArray.push(response[Object.keys(response)[i]]["supplier"])
            }
            console.log(responseArray)
            return(responseArray)
        } 


        axios.get('https://cotizador-92b14.firebaseio.com/Proveedores.json')
        .then(response => {this.setState({suppliers: myLoop(response.data)})})

    }

    setSupplierHandler = (event) =>{
        event.preventDefault()
        this.setState({newSupplier: this.input.value, showAddSupplierButton: true})
        console.log(this.input.value.replace(/ /g,'').toLowerCase())
    }

    addSupplierHandler = (event) =>{
        event.preventDefault()
        const supplierName = this.state.newSupplier.slice()
        fire.database().ref('Proveedores/').child(this.state.newSupplier.replace(/ /g,'').toLowerCase())
        .set({
            "supplier": supplierName
        },  this.setState((prevState) => {
            return {suppliers: prevState.suppliers.concat(supplierName)}
          }));

        this.setState({showAddSupplierButton: false})
    }

    showWarningDeleteHandler = (sup) => {
        
        this.setState({showWarning: sup})
    }

    deleteSupplierHandler = (sup) =>{

        let supplier = sup.replace(/ /g,'').toLowerCase()
        fire.database().ref('Proveedores/').child(supplier)
        .set(null); 

        this.setState({showSuccess: true})
        setTimeout(()=> {this.setState({showSuccess: false})}, 2000)
        this.retrieveSuppliersHandler();
    }

    

    render() {
        /* Show warning */
        
        
        /* Retrieve list of suppliers */

        let suppliers = <Spinner/>;
        if (this.state.suppliers){
            console.log(this.state.deletedSupplier)
            suppliers = this.state.suppliers
            .map(sup => <li onClick={() => this.showWarningDeleteHandler(sup)} key={sup}> {sup} {this.state.showWarning == sup? 
            <Button clicked={() => this.deleteSupplierHandler(sup)}> Borrar permanentemente al proveedor? </Button> : null } </li>)
        } 
 
        return(
            <div className={this.props.leStyle}>
                <h1>Sección Proveedores </h1>
                <h4>Hacer click sobre proveedor que deseas eliminar </h4>
                <ul style={{textAlign: "left"}}> {suppliers} </ul>
                <form onSubmit={this.setSupplierHandler}>
                    <Input leName="newSupplier" leRef={(element) => { this.input = element }}/>
                    <Input leType="submit" leValue="Añadir Proveedor Nuevo" /> 
                    {this.state.showAddSupplierButton? <Button className={classes.Button} clicked={this.addSupplierHandler}> Segur@? </Button> : null }
                    <ButtonSuccess leClass={this.state.showSuccess} > Proveedor borrado! </ButtonSuccess> 
                </form>
                
            </div>
        )
    }
}

const mapStateToProps = state => {
    return{
        suppliers: state
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        onRetrieveSuppliers : (suppliers) => dispatch({type: "RETRIEVE_SUPPLIERS", suppliers: suppliers}),
    }
}

export default connect(mapStateToProps)(Suppliers);


