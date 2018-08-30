import React, { Component } from 'react';
import Item from '../../components/items/item';
import Aux from '../../hoc/Auxiliar';
import axios from 'axios';
import Spinner from '../../UI/Spinner/Spinner';
import {connect} from 'react-redux';
import fire from '../../fire';
import Label from '../../UI/Label/Label';
import Input from '../../UI/Input/Input';
import Warning from '../../UI/Warning/Warning';

class newItem extends Component {

    state={
        suppliers: null,
        precios : null,
        newItem: null,
        showWarning: false
    }

    componentWillMount () {
        
        /* Retrieve supplier list from firebase */

        let responseArray = [];

        const myLoop = (response) => {
            for(let i = 0; i < Object.keys(response).length; i++){
                responseArray.push(response[Object.keys(response)[i]]["supplier"])
            }
            return(responseArray)
        } 

        const queryParams = '?auth=' + this.props.token + '&orderBy="userId"&equalTo="' + this.props.userId + '"';
        axios.get('https://cotizador-92b14.firebaseio.com/Proveedores.json' + queryParams)
        .then(response => {this.setState({suppliers:myLoop(response.data)})})

        
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
        console.log(this.props.userId);
        const updatePriceList = () => {
            console.log(this.state.precios)

            let updatedPriceList = {};
            if (this.state.suppliers && this.state.precios) {
                for (let i = 0; i < this.state.suppliers.length; i++){
                    let supplier = this.state.suppliers[i].replace(/ /g,'').toLowerCase()
                    let price = null;

                    if(this.state.precios[supplier]){
                        price = this.state.precios[supplier]
                        console.log(price)
                    }
                    
                    updatedPriceList[supplier] = price ;   
                }
                updatedPriceList["userId"] = this.props.userId
                console.log(updatedPriceList)
                return(updatedPriceList)
            }
        }

        
        
        
        fire.database().ref('itemPrices/').child(this.props.currentClass)
        .child(this.state.newItem).set(updatePriceList());
      }

    itemPriceHandler = (event, supplier) => {
        if(!this.props.currentClass){
            this.setState({showWarning: true})
            document.getElementById(supplier).value = "";
            
        }else{
            this.setState({showWarning: false})
            const newPriceState = this.state.precios
            newPriceState[supplier] = event.target.value
            this.setState({newPriceState})
        }
       
    }

    
    itemSetHandler = (event) => {
        if(this.props.currentClass){
            this.setState({newItem :  event.target.value})
        }else{
            this.setState({showWarning: true})
            document.getElementById("newItemInput").value = "";
        }
        
    }


    render(){

      /* Show warning if user is trying to add products without having selected a class */

      let warning =  warning = <Warning leDisp={this.state.showWarning}> 
                                    Por favor selecciona una categoría de producto o ingresa el nombre del artículo nuevo.
                                </Warning>;

       /*  Retrieve all suppliers */

       let suppliers = <Spinner/>;
        if (this.state.suppliers){
            suppliers = this.state.suppliers
            .map(sup => <Aux key={sup}> <Label>Precio {sup}: </Label> <Input notRequired="true" leId={sup} leType="text" changed={(event) => 
                this.itemPriceHandler(event, sup.replace(/ /g,'').toLowerCase())}/> </Aux>)
        } 

        /* Retrieve list of all the items of the current class */
        let item = null;

        if (this.props.itemList !== null) {
            item =  <Item clicked={this.updateSupplierPriceListHandler} leStyle={this.props.leStyle} list={this.props.itemClasses} dispProductList="Nope"/>
        }

        return(
        <Aux>
            <div className={this.props.leStyle}>
                <h1>Sección Productos </h1>
                <h4>Añadir información y hacer click sobre el botón para insertar producto en la base de datos </h4>
            </div>
           {item}

            {/* Add new items to the database with corresponding prices (only shown when in "Productos") */}
            <div className={this.props.leStyle}>
                <form onSubmit={this.itemAddHandler}>
                   {/*  <input type="text" onChange={this.itemSetHandler}/>  */}
                    <Input leId="newItemInput" leType="text" changed={this.itemSetHandler}/> 
                    <Input leType="submit" leValue="Añadir item" />
                    {warning}
                    <br/><br/>
                    {suppliers} 
                    
                </form>
           </div>
        </Aux>
        )
    }
}

const mapStateToProps = state => {
    return{
        currentClass: state.currentClass,
        userId: state.userId,
        token: state.token
    }
}

export default connect(mapStateToProps)(newItem);