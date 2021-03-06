import React, { Component } from 'react';
import Item from '../../components/items/item';
import Aux from '../../hoc/Auxiliar';
import {connect} from 'react-redux';
import fire from '../../fire';
import Label from '../../UI/Label/Label';
import Input from '../../UI/Input/Input';
import Warning from '../../UI/Warning/Warning';
import axios from 'axios';
import Button from '../../UI/Button/Button';
import ButtonSuccess from '../../UI/ButtonSuccess/ButtonSuccess';

class newItem extends Component {

    state={
        suppliers: null,
        precios : null,
        newItem: null,
        showWarning: false,
        showSuccess: false,
        newPriceState: null,
        hideItemList: false,
    }

    componentWillMount () {
        
        this.retrieveSuppliersHandler();
       
        /* const queryParams = '?auth=' + this.props.token + '&orderBy="userId"&equalTo="' + this.props.userId + '"';
        axios.get('https://cotizador-92b14.firebaseio.com/Proveedores.json' + queryParams)
        .then(response => {this.setState({suppliers:myLoop(response.data)})}) */

        
    }

    hideItemListHandler = () => {
        this.setState({hideItemList: true})
       
    }

    showItemListHandler = () => {
        this.setState({hideItemList: false})
        console.log(this.props.currentItem)
    }

    retrieveSuppliersHandler = () => {
    

        let responseArray = [];

        const myLoop = (response) => {
            for(let i = 0; i < Object.keys(response).length; i++){
                responseArray.push(response[Object.keys(response)[i]]["supplier"])
            }
            return(responseArray)
        } 

        

        axios.get('https://cotizador-92b14.firebaseio.com/' + this.props.userId + '/Proveedores.json' + this.props.queryParams)
        .then((snapshot => {
            if(snapshot.data){
                this.setState({suppliers: myLoop(snapshot.data)})
            }else{
                this.setState({suppliers: ["Añadir proveedores, por favor!"]})
            }
            
        }))

        /* ref.once("value").then((snapshot => {
            this.setState({suppliers: myLoop(snapshot.val())})
        })) */
    }

    updateSupplierPriceListHandler = () =>{
         /* Set keys of prices using the supplier list */
        
        let updatedPriceList = {};
        if (this.state.suppliers) {
            for (let i = 0; i < this.state.suppliers.length; i++){
                updatedPriceList[this.state.suppliers[i]] = null;   
            }
            
        }
        this.setState({precios: updatedPriceList})
    }

    itemAddHandler = (event) => {
        event.preventDefault();
        if (this.state.suppliers && Object.keys(this.state.precios).length !== 0) { 
            fire.database().ref(this.props.userId)
                .child('Productos')
                .child(
                    this.state.hideItemList? this.state.newItem: this.props.currentItem
                )
                .child('category')
                .set(this.props.currentClass)
            for (let i = 0; i < this.state.suppliers.length; i++){
                let supplier = this.state.suppliers[i].replace(/ /g,'').toLowerCase()
                let price = null;

                if(this.state.precios[supplier]){
                    price = this.state.precios[supplier]
                }

                fire.database().ref(this.props.userId)
                .child('Productos')
                .child(
                    this.state.hideItemList? this.state.newItem: this.props.currentItem
                )
                .child('quotations')
                .child(supplier)
                .child(new Date().getTime())
                .set(price)
                .then(this.showSuccessHandler())  
            }
      }else{
            this.showWarningHandler();
      }
    }

    itemPriceHandler = (event, supplier) => {
        if(!this.props.currentClass){
            this.showWarningHandler()
            document.getElementById(supplier).value = "";
            
        }else{
            this.setState({showWarning: false})
            const newPriceState = this.state.precios
            newPriceState[supplier] = event.target.value
            this.setState({newPriceState: newPriceState})
        }
       
    }

    
    itemSetHandler = (event) => {
        if(this.props.currentClass){
            this.setState({newItem :  event.target.value})
        }else{
            this.showWarningHandler()
            document.getElementById("newItemInput").value = "";
        }
        
    }

   /*  clearInputsHandler = () => {
            for (let i in document.getElementsByClassName('input')){
                document.getElementsByClassName('input')[i].value = "";
            }
    } */

    showSuccessHandler = () => {
        this.setState({showSuccess: true})       

        setTimeout(() =>{
            this.setState({showSuccess: false})
        }, 2000)
    }

    showWarningHandler = () => {
        this.setState({showWarning: true})

        setTimeout(() =>{
            this.setState({showWarning: false})
        }, 2000)
    }


    render(){

      /* Show warning if user is trying to add products without having selected a class */

      let warning = <Warning leDisp={this.state.showWarning}> 
                        Debes seleccionar una categoría de producto e ingresar el nombre del artículo, al igual
                        que mínimo un precio.
                    </Warning>;

       /*  Retrieve all suppliers */

       let suppliers = this.props.token ? <Button  clicked={this.retrieveSuppliersHandler}> 
       Actualizar proveedores </Button>: <Warning leDisp="yes"> Ingresar credenciales, por favor.</Warning>;

       
        if (this.state.suppliers && this.state.suppliers[0] !== "Añadir proveedores, por favor!"){
            suppliers = this.state.suppliers
            .map(sup => <Aux key={sup}> <Label>Precio {sup}: </Label> <Input notRequired="true" leId={sup} leType="text" changed={(event) => 
                this.itemPriceHandler(event, sup.replace(/ /g,'').toLowerCase())}/> </Aux>)
        }else{
            suppliers = "Añadir proveedores, por favor!"
        } 

        /* Retrieve list of all the items of the current class */
        let item = null;

        if (this.props.itemList !== null) {
            item =  <Item clicked={this.updateSupplierPriceListHandler} leStyle={this.props.leStyle} list={this.props.itemClasses} dispProductList={this.state.hideItemList? true: false}/>
        }


        return(
        <Aux>
            <div className={this.props.leStyle}>
                <h1>Sección Productos </h1>
                <h4>Añadir información y hacer click sobre el botón para insertar producto en la base de datos</h4>
                <ButtonSuccess leClass="disp" clicked={this.showItemListHandler}> Actualizar productos </ButtonSuccess>
                <Button clicked={this.hideItemListHandler}> Añadir producto nuevo </Button>
                <h5 style={{color: "#155724", textDecoration: "underline"}}> {this.state.hideItemList? "Añadiendo items": "Actualizando items"} </h5>
            </div>
            
            {item}

            {/* Add new items to the database with corresponding prices (only shown when in "Productos") */}
            <div className={this.props.leStyle}>
                <form onSubmit={this.itemAddHandler}>
                   {/*  <input type="text" onChange={this.itemSetHandler}/>  */}
                    {this.state.hideItemList? <Input leId="newItemInput" leType="text" changed={this.itemSetHandler}/> : null}
                    <Input leType="submit" leValue={this.state.hideItemList?"Añadir item":"Actualizar item"} />
                    {warning}
                    {this.state.showSuccess? 
                    <ButtonSuccess leClass="yes"> Producto añadido! </ButtonSuccess>: null}
                    <br/><br/>                    
                </form>
                {suppliers} 
           </div>
        </Aux>
        )
    }
}

const mapStateToProps = state => {
    return{
        currentClass: state.currentClass,
        currentItem: state.currentItem,
        userId: state.userId,
        token: state.token,
        queryParams: state.queryParams
    }
}

export default connect(mapStateToProps)(newItem);