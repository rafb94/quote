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
    }

    componentWillMount () {
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
        console.log(this.state.newSupplier.replace(/ /g,'').toLowerCase())
        const supplierName = this.state.newSupplier.slice()
        fire.database().ref('Proveedores/').child(this.state.newSupplier.replace(/ /g,'').toLowerCase())
        .set({
            "supplier": supplierName
        }); 
    }


    render() {
        
        let suppliers = <Spinner/>;
        if (this.state.suppliers){
            console.log(this.state.suppliers)
            suppliers = this.state.suppliers
            .map(sup => <li key={sup}> {sup} </li>)
        } 
 
        return(
            <div className={classes.Element}>
                <ul> {suppliers} </ul>
                <form onSubmit={this.setSupplierHandler}>
                    <input name="newSupplier" ref={(element) => { this.input = element }}/>
                    <input type="submit" value="Añadir Proveedor Nuevo" /> 
                    {this.state.showAddSupplierButton? <button onClick={this.addSupplierHandler}> Segur@? </button> : null }
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


