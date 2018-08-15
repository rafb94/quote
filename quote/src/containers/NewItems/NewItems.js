import React, { Component } from 'react';
import Item from '../../components/items/item';
import Aux from '../../hoc/Auxiliar';
import classes from './NewItems.css';
import axios from 'axios';
import Spinner from '../../UI/Spinner/Spinner';
import {connect} from 'react-redux';
import fire from '../../fire';
import Button from '../../UI/Button/Button';
import Label from '../../UI/Label/Label';

class newItem extends Component {

    state={
        suppliers: null,
        precios : null,
        currentClass: null,
        newItem: null
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


        axios.get('https://cotizador-92b14.firebaseio.com/Proveedores.json')
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

        const updatePriceList = () => {
            console.log(this.state.precios)

            let updatedPriceList = {};
            if (this.state.suppliers && this.state.precios) {
                for (let i = 0; i < this.state.suppliers.length; i++){
                    let supplier = this.state.suppliers[i].replace(/ /g,'').toLowerCase()
                    let price = null;

                    if(this.state.precios[supplier]){
                        price = this.state.precios[supplier]
                    }
                    
                    updatedPriceList[supplier] = price ;   
                }
                return(updatedPriceList)
            }
        }

        console.log(updatePriceList());


        fire.database().ref('itemPrices/').child(this.props.currentClass.currentClass)
        .child(this.state.newItem).set(updatePriceList());
      }

    itemPriceHandler = (event, supplier) => {
        const newPriceState = this.state.precios
        newPriceState[supplier] = event.target.value
        this.setState({newPriceState})
        console.log(this.state)
    }

    
    itemSetHandler = (event) => {
        this.setState({newItem :  event.target.value})
        
    }


    render(){

      console.log(this.state.precios)
       /*  Retrieve all suppliers */

       let suppliers = <Spinner/>;
        if (this.state.suppliers){
            suppliers = this.state.suppliers
            .map(sup => <Aux key={sup}> <Label>Precio {sup}: </Label> <input type="text" onChange={(event) => 
                this.itemPriceHandler(event, sup.replace(/ /g,'').toLowerCase())}/> </Aux>)
        } 

        /* Retrieve list of all the items of the current class */
        let item = null;

        if (this.props.itemList !== null) {
            item =  <Item clicked={this.updateSupplierPriceListHandler} leStyle={classes.Element} list={this.props.itemClasses} dispProductList="Nope"/>
        }

        return(
        <Aux>
            <div className={classes.Element}>
                <h1>Sección Productos </h1>
                <h4>Añadir información y hacer click sobre el botón para insertar producto en la base de datos </h4>
            </div>
           {item}

            {/* Add new items to the database with corresponding prices (only shown when in "Productos") */}
            <div className={classes.Element}>
                <form>
                    <input type="text" onChange={this.itemSetHandler}/> 
                    <Button clicked={this.itemAddHandler}> Añadir item </Button>
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
        currentClass: state
    }
}

export default connect(mapStateToProps)(newItem);