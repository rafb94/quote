import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import Spinner from '../../UI/Spinner/Spinner';
import classes from './Suppliers.css';
import fire from '../../fire';


class Suppliers extends Component {

    state={
        newSupplier: null,
        showAddSupplierButton: false,
        suppliers: null,
        deletedSupplier: null,
        showWarning: false
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
        .setValue({
            "supplier": supplierName
        }); 
    }

    showWarningDeleteHandler = () => {
        let showWarning = !this.state.showWarning.slice()
        this.setState({showWarning: showWarning})
    }

   /*  deleteSupplierHandler = (sup) =>{

        let supplier = sup.replace(/ /g,'').toLowerCase()
        fire.database().ref('Proveedores/').child(supplier)
        .set(null); 

        this.retrieveSuppliersHandler();
    }
 */

    render() {
        /* Show warning */
        
        
        /* Retrieve list of suppliers */

        let suppliers = <Spinner/>;
        if (this.state.suppliers){
            console.log(this.state.deletedSupplier)
            suppliers = this.state.suppliers
            .map(sup => <li onClick={() => this.deleteSupplierHandler(sup)} key={sup}> {sup} </li>)
        } 
 
        return(
            <div className={classes.Element}>
                <h1>Sección Proveedores </h1>
                <h4>Hacer click sobre proveedor que desea ser eliminado </h4>
                <ul> {suppliers} </ul>
                <form onSubmit={this.setSupplierHandler}>
                    <input name="newSupplier" ref={(element) => { this.input = element }}/>
                    <input type="submit" value="Añadir Proveedor Nuevo" /> 
                    {this.state.showAddSupplierButton? <button onClick={this.addSupplierHandler}> Segur@? </button> : null }
                   {/*  {this.state.showWarning? <button> Borrar permanentemente al proveedor </button> : null } */}
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
        onDeleteSupplier: () => dispatch({type: "DELETE_SUPPLIER"})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Suppliers);


