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
        suppliers: null,
        deletedSupplier: null,
        showWarning: false,
        showSuccess: false
    }

    componentDidMount () {
        this.retrieveSuppliersHandler(this.props.token, this.props.userId);
        console.log(this.state.suppliers)
    }

    retrieveSuppliersHandler = (token, userId) => {
        let responseArray = [];
        const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"'; 

        const myLoop = (response) => {
            for(let i = 0; i < Object.keys(response).length; i++){
                responseArray.push(response[Object.keys(response)[i]]["supplier"])
            }
            
            return(responseArray)
        } 


        axios.get('https://cotizador-92b14.firebaseio.com/Proveedores.json' + queryParams)
        .then(response => {this.setState({suppliers: myLoop(response.data)})}).catch(error => this.setState({error: error}))

       

    }

    setSupplierHandler = (event) =>{
        event.preventDefault()
        this.setState({newSupplier: this.input.value, showAddSupplierButton: true})
        console.log(this.input.value.replace(/ /g,'').toLowerCase())
    }

    addSupplierHandler = (event) =>{
        event.preventDefault()
        const supplierName = this.state.newSupplier.slice()
        const userId = this.props.userId;
        fire.database().ref('Proveedores/').child(this.state.newSupplier.replace(/ /g,'').toLowerCase())
        .set({
            "supplier": supplierName,
            "userId": userId
        },  this.setState((prevState) => {
            return {suppliers: prevState.suppliers.concat(supplierName)}
          }));

        this.setState({showAddSupplierButton: false})
    }

    showWarningDeleteHandler = (sup) => {
        this.retrieveSuppliersHandler(this.props.token, this.props.userId);
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

    updateSupplierHandler = (event) => {
        event.preventDefault();
        this.retrieveSuppliersHandler(this.props.token, this.props.userId);
    }

    

    render() {
        /* Show warning */
        
        
        /* Retrieve list of suppliers */

        let suppliers = this.props.token ? <Button  clicked={this.updateSupplierHandler}> Actualizar proveedores </Button>: <div> Ingresar credenciales, por favor.</div>;
        if (this.state.suppliers){
            console.log(this.state.suppliers)
            suppliers = this.state.suppliers
            .map(sup => <li style={{display: "block"}} onClick={() => this.showWarningDeleteHandler(sup)} key={sup}> {sup} {this.state.showWarning == sup? 
            <Button clicked={() => this.deleteSupplierHandler(sup)}> Borrar permanentemente al proveedor? </Button> : null } </li>)
        } 
 
        return(
            <div className={this.props.leStyle}>
                <h1>Sección Proveedores </h1>
                
                <h4>Hacer click sobre proveedor que deseas eliminar </h4>
                <ul style={{textAlign: "center", padding: 0}}> {suppliers} </ul>
                <form onSubmit={this.setSupplierHandler}>
                    <Input leName="newSupplier" leRef={(element) => { this.input = element }}/>
                    <Input leType="submit" leValue="Añadir Proveedor Nuevo" /> 
                    {this.state.showAddSupplierButton? <Button className={classes.Button} clicked={this.addSupplierHandler}> 
                    Segur@? </Button> : null }
                    <ButtonSuccess leClass={this.state.showSuccess} > Proveedor borrado! </ButtonSuccess> 
                </form>
                
            </div>
        )
    }
}

const mapStateToProps = state => {
    return{
        suppliers: state,
        userId: state.userId,
        token: state.token
    }
}

/* const mapDispatchToProps = dispatch =>{
    return{
        onRetrieveSuppliers : (suppliers) => dispatch({type: "RETRIEVE_SUPPLIERS", suppliers: suppliers}),
    }
}
 */
export default connect(mapStateToProps)(Suppliers);


