import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import classes from './Suppliers.css';
import fire from '../../fire';
import Button from '../../UI/Button/Button';
import ButtonSuccess from '../../UI/ButtonSuccess/ButtonSuccess';
import Input from '../../UI/Input/Input';
import Warning from '../../UI/Warning/Warning';


class Suppliers extends Component {

    state={
        newSupplier: null,
        showAddSupplierButton: false,
        suppliers: null,
        deletedSupplier: null,
        showWarning: false,
        showSuccessAdd: false,
        showSuccessDelete: false,
    }

    componentDidMount () {
        this.retrieveSuppliersHandler(this.props.token, this.props.userId);
        console.log(this.state.suppliers)
    }

    retrieveSuppliersHandler = () => {
        let responseArray = []; 

        const myLoop = (response) => {
            for(let i = 0; i < Object.keys(response).length; i++){
                responseArray.push(response[Object.keys(response)[i]]["supplier"])
            }
            
            return(responseArray)
        } 

        axios.get('https://cotizador-92b14.firebaseio.com/' + this.props.userId + '/Proveedores.json'
         + this.props.queryParams)
        .then(response => {this.setState({suppliers: myLoop(response.data)})})
        .catch(error => this.setState({error: error}))

       

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
        fire.database().ref(this.props.userId).child('Proveedores/').child(this.state.newSupplier.replace(/ /g,'').toLowerCase())
        .set({
            "supplier": supplierName,
            "userId": userId
        },  this.setState((prevState) => {
            return {suppliers: prevState.suppliers.concat(supplierName)}
          })).then(
                this.showSuccessAddButtonHandler()
          );

        this.setState({showAddSupplierButton: false})
        document.getElementById("newSupplier").value = "";
    }

    showSuccessAddButtonHandler = () => {
        this.setState({
            showSuccessAdd: true
        })

        setTimeout(() => {
            this.setState({showSuccessAdd: false})
        }, 1500)
    }

    showWarningDeleteHandler = (sup) => {
        this.retrieveSuppliersHandler(this.props.token, this.props.userId);
        this.setState({showWarning: sup})
    }

    deleteSupplierHandler = (sup) =>{

        let supplier = sup.replace(/ /g,'').toLowerCase()
        fire.database().ref(this.props.userId).child('Proveedores/').child(supplier)
        .set(null); 

        /* let supplierIndex = this.state.suppliers.indexOf(sup)
        this.state.suppliers[supplierIndex] = null;
        console.log(this.state.suppliers) */
        

        this.setState({showSuccess: true, suppliers: null })
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

        let suppliers = this.props.token ? <Button  clicked={this.updateSupplierHandler}> Actualizar proveedores </Button>: <Warning leDisp="yes"> Ingresar credenciales, por favor.</Warning>;
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
                    <Input leId="newSupplier" leName="newSupplier" leRef={(element) => { this.input = element }}/>
                    <Input leType="submit" leValue="Añadir Proveedor Nuevo" /> 
                    {this.state.showAddSupplierButton? <Button className={classes.Button} clicked={this.addSupplierHandler}> 
                    Segur@? </Button> : null }
                    <ButtonSuccess leClass={this.state.showSuccessDelete} > Proveedor borrado! </ButtonSuccess>
                    <ButtonSuccess leClass={this.state.showSuccessAdd} > Proveedor añadido! </ButtonSuccess> 
                </form>
                
            </div>
        )
    }
}

const mapStateToProps = state => {
    return{
        suppliers: state,
        userId: state.userId,
        token: state.token,
        queryParams: state.queryParams
    }
}


export default connect(mapStateToProps)(Suppliers);


