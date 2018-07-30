import React, { Component } from 'react';
import classes from './items.css';
import axios from 'axios';
import fire from '../../fire';
import {connect} from 'react-redux'; 



class item extends Component {

    state={
        newItem: "",
        items: {
            ReactivosFrios: null,
            ReactivosCalientes: null,
            Directos: null,
            Dispersos: null,
            Basicos: null,
            Auxiliares: null
        },
        cost: null,
        itemClasses: null,
        error: false,
        itemDetail: null,
        currentClass: null,
        currentItem: null,
        precios : {
            ohyoung: null,
            alliance: null,
            wishland: null,
            aditya: null
        }
    }
    
    componentDidMount = () => {
        axios.get('https://cotizador-92b14.firebaseio.com/itemPrices.json').then(response => {
            let itemClasses = Object.keys(response.data)
            console.log(response)
            this.setState({itemClasses: itemClasses, 
              cost: response.data, 
              items: {
                ReactivosFrios: response.data["ReactivosFrios"],
                ReactivosCalientes: response.data["ReactivosCalientes"],
                Directos: response.data["Directos"],
                Dispersos: response.data["Dispersos"],
                Basicos: response.data["Basicos"],
                Auxiliares: response.data["Auxiliares"]
              },
              currentItemClass: "",
            }) 
        }).catch(error => {
            this.setState({error: true})
        }
        )
    }

    itemAddHandler = (event) => {
        
        event.preventDefault();
        fire.database().ref('itemPrices/').child(this.state.currentClass)
        .child(this.state.newItem).set({
          ohyoung: this.state.precios["ohyoung"],
          wishland: this.state.precios["wishland"],
          alliance: this.state.precios["alliance"],
          aditya: this.state.precios["aditya"],
        });
      }

    itemPriceHandler = (event, supplier) => {
        const newPriceState = this.state.precios
        newPriceState[supplier] = event.target.value
        this.setState({newPriceState})
        console.log(this.state)
    }

    itemUpdateHandler = (event) => {

        axios.put('https://cotizador-92b14.firebaseio.com/currentItem.json', {
            currentItem: event.target.value
        })

        this.setState({currentItem: event.target.value})
        
    }

    itemSetHandler = (event) => {
        this.setState({newItem :  event.target.value})
        
    }

    classUpdateHandler = (event) => {
        let currentClass1 = null;
        
        let currentClass2 = event.target.value; 
            
        if (this.state.items !== null){ 
    
            switch (currentClass2) {
                case "ReactivosCalientes":
                    currentClass1= "ReactivosCalientes";
                    break;
                case "ReactivosFrios":
                    currentClass1= "ReactivosFrios";
                    break;
                default:
                    currentClass1= currentClass2;
               
            }
            
            this.setState({currentClass: currentClass1})
            
            
        }
        this.props.onUpdateClass(event)
    }

    

    
    
    render(){

        
        let list = null;
        let itemDetail= null;            
        
       
        /* Return a list with item classes, option tags */
        if (this.state.itemClasses !== null){
            list= this.state.itemClasses.map(itemClass =>{  
                return (
                <option key={itemClass}> {itemClass}</option>
            ) 
            })
        } 

         /* Return a list with items of the current class, option tags */  
         if (this.state.currentClass !== null){

            let currentClass = this.state.currentClass.slice();
            
            itemDetail= Object.keys(this.state.items[currentClass]).map(num =>{  
                return (<option key={num}> {num}</option>) 
            })
           
        }

        
        
        return(
            <div className={this.props.leStyle}>

            {/* Select Tag for item classes */}

                <div >
                    <select  className={classes.select} onChange={this.classUpdateHandler} defaultValue="default">
                        <option key="default" value="default" disabled> Tipo de Producto</option>
                        {list}
                    </select> 
                </div>
                <br/>

            {/* Select Tag for items: */}

                <div style={this.props.dispProductList ? {display: 'none'} : null}>
                    <select  className={classes.select} onChange={this.props.onUpdateItem} defaultValue="default">
                        <option key="default" value="default" disabled>  Producto</option>
                        {itemDetail} 
                    </select> 
                </div>
                <br/>

            {/* Add new items to the database with corresponding prices (only shown when in "Productos") */}

                <div style={this.props.dispItemAdd ? {display: "none"}: null}>
                    <form>
                        <input type="text" onChange={this.itemSetHandler}/> 
                        <button onClick={this.itemAddHandler}> Añadir item </button>
                        <br/><br/>
                        <label className={classes.Input}>Precio OhYoung:</label> 
                        <input type="text" onChange={(event) => this.itemPriceHandler(event, "ohyoung")}/>
                        <label className={classes.Input}>Precio Wishland:</label> 
                        <input type="text" onChange={(event) => this.itemPriceHandler(event, "wishland")}/>
                        <label className={classes.Input} >Precio Alliance:</label> 
                        <input type="text" onChange={(event) => this.itemPriceHandler(event, "alliance")}/>
                        <label className={classes.Input}>Precio Aditya:</label> 
                        <input type="text" onChange={(event) => this.itemPriceHandler(event, "aditya")}/>
                    </form>
                </div>
            </div> 
           
        )
        
    }
}

const mapStateToProps = state =>{
    return{
        currentItem: state,
        currentClass: state
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onUpdateItem: (event) => dispatch({type: "UPDATE_ITEM", value: event.target.value}),
        onUpdateClass: (event) => dispatch({type: "UPDATE_CLASS", value: event.target.value})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(item);